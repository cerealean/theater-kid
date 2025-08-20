import { CharacterCardImportService } from './character-card-import.service';

// Minimal CRC32 for PNG chunk building in tests
function crc32(u8: Uint8Array) {
  let c = ~0;
  for (const byte of u8) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}
function u32(n: number) {
  return new Uint8Array([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
}
function ascii(s: string) {
  return new TextEncoder().encode(s);
}

// Build a tiny PNG with one tEXt chunk "chara" containing JSON V2
function buildPngWithText(keyword: string, text: string): Uint8Array {
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const type = ascii('tEXt');
  const data = new Uint8Array([...ascii(keyword), 0, ...ascii(text)]);
  const len = u32(data.length);
  const crc = u32(crc32(new Uint8Array([...type, ...data])));
  // IHDR (minimal 1x1 rgba)
  const ihdrType = ascii('IHDR');
  const ihdrData = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]);
  const ihdrCrc = u32(crc32(new Uint8Array([...ihdrType, ...ihdrData])));
  const idatType = ascii('IDAT');
  const idatData = new Uint8Array([120, 1, 1, 2, 0, 253, 255, 0, 0, 0, 255, 0, 3, 0, 0, 0]); // tiny zlib stream
  const idatCrc = u32(crc32(new Uint8Array([...idatType, ...idatData])));
  const iendType = ascii('IEND');
  const iendCrc = u32(crc32(iendType));

  return new Uint8Array([
    ...sig,
    ...u32(ihdrData.length),
    ...ihdrType,
    ...ihdrData,
    ...ihdrCrc,
    ...u32(idatData.length),
    ...idatType,
    ...idatData,
    ...idatCrc,
    ...len,
    ...type,
    ...data,
    ...crc,
    ...u32(0),
    ...iendType,
    ...iendCrc,
  ]);
}

describe('CharacterCardImportService', () => {
  let svc: CharacterCardImportService;

  beforeEach(() => {
    svc = new CharacterCardImportService();
  });

  it('parses V2 JSON directly', async () => {
    const v2 = {
      spec: 'chara_card_v2',
      data: {
        name: 'Test',
        description: 'desc',
        scenario: '',
        first_mes: 'hello',
        mes_example: '',
      },
    };
    const file = new File([JSON.stringify(v2)], 'card.json', { type: 'application/json' });
    const model = await svc.import(file);
    expect(model.name).toBe('Test');
    expect(model.description).toBe('desc');
    expect(model.rawCard && !model.systemPrompt).toBe(true);
  });

  it('parses PNG tEXt with keyword "chara"', async () => {
    const v2 = {
      spec: 'chara_card_v2',
      data: {
        name: 'Pngy',
        description: 'from png',
        scenario: '',
        first_mes: 'hi',
        mes_example: '',
      },
    };
    const bytes = buildPngWithText('chara', JSON.stringify(v2));
    const file = new File([bytes], 'card.png', { type: 'image/png' });
    const model = await svc.import(file);
    expect(model.name).toBe('Pngy');
    expect(model.description).toContain('png');
  });
});
