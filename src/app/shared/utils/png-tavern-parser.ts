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
    try {
      const ds = new DecompressionStream('deflate');
      const stream = new Response(new Blob([data as BlobPart]).stream().pipeThrough(ds));
      return new Uint8Array(await stream.arrayBuffer());
    } catch (error) {
      console.warn('DecompressionStream failed, this may be due to browser compatibility:', error);
      throw new Error(
        'Failed to decompress PNG text data. This may be due to browser compatibility issues with DecompressionStream.',
      );
    }
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

  console.log('Extracting PNG text chunks from buffer of size:', buf.byteLength);

  while (offset + 12 <= u8.length) {
    const length = readU32BE(dv, offset);
    const type = utf8(u8.subarray(offset + 4, offset + 8));
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd > u8.length) break;

    console.log(`Found PNG chunk: type="${type}", length=${length}`);

    const data = u8.subarray(dataStart, dataEnd);

    try {
      if (type === 'tEXt') {
        const nul = data.indexOf(0);
        if (nul !== -1) {
          const keyword = utf8(data.subarray(0, nul));
          const text = utf8(data.subarray(nul + 1));
          console.log(`tEXt chunk: keyword="${keyword}", text length=${text.length}`);
          texts.push({ keyword, text });
        }
      } else if (type === 'zTXt') {
        const nul = data.indexOf(0);
        if (nul !== -1 && data.length > nul + 2) {
          const keyword = utf8(data.subarray(0, nul));
          const compMethod = data[nul + 1]; // 0=zlib/deflate
          const comp = data.subarray(nul + 2);
          console.log(
            `zTXt chunk: keyword="${keyword}", compression method=${compMethod}, compressed length=${comp.length}`,
          );
          if (compMethod === 0) {
            const inflated = await inflateDeflate(comp);
            console.log(`zTXt inflated text length: ${utf8(inflated).length}`);
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
        console.log(
          `iTXt chunk: keyword="${keyword}", compressed=${compFlag}, method=${compMethod}, remaining length=${remaining.length}`,
        );
        if (compFlag === 1 && compMethod === 0) {
          const inflated = await inflateDeflate(remaining);
          console.log(`iTXt inflated text length: ${utf8(inflated).length}`);
          texts.push({ keyword, text: utf8(inflated) });
        } else {
          texts.push({ keyword, text: utf8(remaining) });
        }
      }
    } catch (error) {
      console.warn(`Error processing PNG chunk type "${type}":`, error);
      // Continue processing other chunks even if one fails
    }

    offset = dataEnd + 4; // skip CRC
    if (type === 'IEND') break;
  }

  console.log(`Extracted ${texts.length} text entries from PNG`);
  return texts;
}

function safeParseJson<T = unknown>(s: string): T | null {
  try {
    const obj = JSON.parse(s);
    if (obj && typeof obj === 'object') {
      // shallow sanitize
      const o = obj as Record<string, unknown>;
      delete o['__proto__'];
      delete o['constructor'];
    }
    return obj;
  } catch {
    return null;
  }
}

function isBase64(str: string): boolean {
  // Check if string looks like base64 (mostly alphanumeric with + / = padding)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str) && str.length % 4 === 0 && str.length > 20;
}

function safeDecodeBase64(str: string): string | null {
  try {
    return atob(str);
  } catch {
    return null;
  }
}

function isV2Card(x: unknown): x is TavernCardV2 {
  const result =
    !!x &&
    typeof x === 'object' &&
    (x as TavernCardV2).spec === 'chara_card_v2' &&
    typeof (x as TavernCardV2).data === 'object';
  if (!result && x && typeof x === 'object') {
    const obj = x as Record<string, unknown>;
    console.log('V2 card validation failed:', {
      hasSpec: 'spec' in obj,
      specValue: obj['spec'],
      isCharaCardV2: obj['spec'] === 'chara_card_v2',
      hasData: 'data' in obj,
      dataType: typeof obj['data'],
    });
  }
  return result;
}

function isV1Card(x: unknown): x is TavernCardV1 {
  if (!x || typeof x !== 'object') return false;
  const o = x as TavernCardV1;
  const requiredFields = ['name', 'description', 'scenario', 'first_mes', 'mes_example'];
  const fieldCheck = requiredFields.map((k) => ({
    field: k,
    exists: k in o,
    type: typeof o[k as keyof TavernCardV1],
    isString: typeof o[k as keyof TavernCardV1] === 'string',
  }));
  const isValid = requiredFields.every((k) => typeof o[k as keyof TavernCardV1] === 'string');

  if (!isValid) {
    console.log('V1 card validation failed:', fieldCheck);
  }
  return isValid;
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
  console.log('Parsing character file:', file.name, 'Type:', file.type, 'Size:', file.size);
  const blobUrl = URL.createObjectURL(file);

  // JSON files
  if (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')) {
    try {
      console.log('Processing as JSON file');
      const txt = await file.text();
      const j = safeParseJson(txt);
      if (!j) throw new Error('Invalid JSON format in character file.');
      if (isV2Card(j) || isV1Card(j)) return mapToBooth(j, blobUrl);
      throw new Error('File does not contain a valid Tavern character card (V1 or V2 format).');
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw error;
    }
  }

  // PNG path
  try {
    console.log('Processing as PNG file');
    const buf = await file.arrayBuffer();
    console.log('File buffer size:', buf.byteLength);

    const entries = await extractPngText(buf);
    console.log('Found PNG text entries:', entries.length);
    entries.forEach((entry, i) => {
      console.log(`Entry ${i}: keyword="${entry.keyword}", text length=${entry.text.length}`);
    });

    // Prefer keyword 'chara', else first JSON-looking entry
    const candidateTexts = [
      ...entries.filter((e) => e.keyword.toLowerCase() === 'chara'),
      ...entries.filter((e) => e.keyword.toLowerCase() !== 'chara'),
    ].map((e) => e.text);

    console.log('Candidate texts to parse:', candidateTexts.length);

    for (const text of candidateTexts) {
      console.log('Trying to parse text of length:', text.length);

      // First try parsing as direct JSON
      let j = safeParseJson(text);
      if (!j) {
        console.log('Failed to parse JSON from text directly');

        // Try decoding as Base64 first
        if (isBase64(text)) {
          console.log('Text appears to be Base64 encoded, attempting to decode...');
          const decoded = safeDecodeBase64(text);
          if (decoded) {
            console.log('Successfully decoded Base64, trying to parse as JSON...');
            j = safeParseJson(decoded);
            if (j) {
              console.log('Successfully parsed JSON from decoded Base64!');
            } else {
              console.log('Failed to parse JSON from decoded Base64');
              console.log('First 200 chars of decoded:', decoded.substring(0, 200));
            }
          } else {
            console.log('Failed to decode Base64');
          }
        } else {
          console.log('Text does not appear to be Base64');
          console.log('First 200 chars:', text.substring(0, 200));
        }

        if (!j) continue;
      }

      console.log('Successfully parsed JSON object, checking card format...');
      console.log('Object keys:', Object.keys(j));
      console.log('Is V2 card?', isV2Card(j));
      console.log('Is V1 card?', isV1Card(j));

      if (isV2Card(j) || isV1Card(j)) {
        console.log('Successfully parsed character card');
        return mapToBooth(j, blobUrl);
      }
      if (j && typeof j === 'object') {
        console.log('Checking nested objects for character cards...');
        for (const [key, v] of Object.entries(j)) {
          console.log(`Checking key "${key}":`, typeof v, isV2Card(v), isV1Card(v));
          if (isV2Card(v) || isV1Card(v)) {
            console.log('Successfully parsed character card from nested object');
            return mapToBooth(v, blobUrl);
          }
        }
      }
    }

    throw new Error('No valid Tavern character JSON found in PNG metadata.');
  } catch (error) {
    console.error('PNG parsing error:', error);
    throw error;
  }
}
