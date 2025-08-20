import { CharacterBoothModel, TavernCardV1, TavernCardV2 } from '../models/character-booth.model';

const textDecoder = new TextDecoder();
const utf8 = (bytes: Uint8Array) => textDecoder.decode(bytes);

function readU32BE(view: DataView, offset: number) {
  return view.getUint32(offset, false);
}

function isPngSignature(buf: ArrayBuffer) {
  const sig = new Uint8Array(buf, 0, 8);
  const expected = [137, 80, 78, 71, 13, 10, 26, 10];
  return expected.every((b, i) => sig[i] === b);
}

async function inflateDeflate(data: Uint8Array): Promise<Uint8Array> {
  if ('DecompressionStream' in globalThis) {
    const ds = new DecompressionStream('deflate');
    const stream = new Response(new Blob([data]).stream().pipeThrough(ds));
    return new Uint8Array(await stream.arrayBuffer());
  }
  throw new Error(
    'Deflate decompression not supported by this browser. Please see https://caniuse.com/mdn-api_decompressionstream_decompressionstream_deflate for browser support.',
  );
}

interface TextEntry {
  keyword: string;
  text: string;
}

export async function extractPngText(buf: ArrayBuffer): Promise<TextEntry[]> {
  if (!isPngSignature(buf)) throw new Error('Not a PNG file');

  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  const texts: TextEntry[] = [];
  let offset = 8; // after signature

  while (offset + 12 <= u8.length) {
    const length = readU32BE(dv, offset);
    const type = utf8(u8.subarray(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd > u8.length) break;

    const data = u8.subarray(dataStart, dataEnd);

    if (type === 'tEXt') {
      const nul = data.indexOf(0);
      if (nul !== -1) {
        const keyword = utf8(data.subarray(0, nul));
        const text = utf8(data.subarray(nul + 1));
        texts.push({ keyword, text });
      }
    } else if (type === 'zTXt') {
      const nul = data.indexOf(0);
      if (nul !== -1 && data.length > nul + 2) {
        const keyword = utf8(data.subarray(0, nul));
        const compMethod = data[nul + 1]; // 0=zlib/deflate
        const comp = data.subarray(nul + 2);
        if (compMethod === 0) {
          const inflated = await inflateDeflate(comp);
          texts.push({ keyword, text: utf8(inflated) });
        }
      }
    } else if (type === 'iTXt') {
      // keyword\0 compFlag(1) compMethod(1) languageTag\0 translatedKeyword\0 text
      let p = 0;
      const readStr = () => {
        const start = p;
        while (p < data.length && data[p] !== 0) p++;
        const s = utf8(data.subarray(start, p));
        p++; // skip NUL
        return s;
      };
      const keyword = readStr();
      const compFlag = data[p++]; // 0 or 1
      const compMethod = data[p++];
      /* language */ readStr();
      /* translated */ readStr();
      const remaining = data.subarray(p);
      if (compFlag === 1 && compMethod === 0) {
        const inflated = await inflateDeflate(remaining);
        texts.push({ keyword, text: utf8(inflated) });
      } else {
        texts.push({ keyword, text: utf8(remaining) });
      }
    }

    offset = dataEnd + 4; // skip CRC
    if (type === 'IEND') break;
  }
  return texts;
}

function safeParseJson<T = unknown>(s: string): T | null {
  try {
    const obj = JSON.parse(s);
    if (obj && typeof obj === 'object') {
      // shallow sanitize
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const o = obj as UnsafeObject;
      delete o.__proto__;
      delete o.constructor;
    }
    return obj;
  } catch {
    return null;
  }
}

function isV2Card(x: unknown): x is TavernCardV2 {
  return (
    !!x &&
    typeof x === 'object' &&
    (x as TavernCardV2).spec === 'chara_card_v2' &&
    typeof (x as TavernCardV2).data === 'object'
  );
}

function isV1Card(x: unknown): x is TavernCardV1 {
  if (!x || typeof x !== 'object') return false;
  const o = x as TavernCardV1;
  return ['name', 'description', 'scenario', 'first_mes', 'mes_example'].every(
    (k) => typeof o[k as keyof TavernCardV1] === 'string',
  );
}

function mapToBooth(card: TavernCardV1 | TavernCardV2, avatarUrl: string): CharacterBoothModel {
  if (isV2Card(card)) {
    const d = card.data;
    return {
      name: d.name,
      avatarUrl,
      description: d.description ?? d.personality ?? '',
      scenario: d.scenario,
      greeting: d.first_mes,
      examples: d.mes_example,
      systemPrompt: d.system_prompt,
      postHistory: d.post_history_instructions,
      tags: d.tags,
      creator: d.creator,
      version: d.character_version,
      rawCard: card,
    };
  }
  return {
    name: card.name,
    avatarUrl,
    description: card.description ?? card.personality ?? '',
    scenario: card.scenario,
    greeting: card.first_mes,
    examples: card.mes_example,
    rawCard: card,
  };
}

export async function parseCharacterFile(file: File): Promise<CharacterBoothModel> {
  const blobUrl = URL.createObjectURL(file);

  // JSON files
  if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
    const txt = await file.text();
    const j = safeParseJson(txt);
    if (!j) throw new Error('Invalid JSON format in character file.');
    if (isV2Card(j) || isV1Card(j)) return mapToBooth(j, blobUrl);
    throw new Error('File does not contain a valid Tavern character card (V1 or V2 format).');
  }

  // PNG path
  const buf = await file.arrayBuffer();
  const entries = await extractPngText(buf);

  // Prefer keyword 'chara', else first JSON-looking entry
  const candidateTexts = [
    ...entries.filter((e) => e.keyword.toLowerCase() === 'chara'),
    ...entries.filter((e) => e.keyword.toLowerCase() !== 'chara'),
  ].map((e) => e.text);

  for (const text of candidateTexts) {
    const j = safeParseJson(text);
    if (!j) continue;
    if (isV2Card(j) || isV1Card(j)) return mapToBooth(j, blobUrl);
    if (j && typeof j === 'object') {
      for (const v of Object.values(j)) {
        if (isV2Card(v) || isV1Card(v)) return mapToBooth(v, blobUrl);
      }
    }
  }

  throw new Error('No valid Tavern character JSON found in PNG metadata.');
}
