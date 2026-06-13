// Gera ícones PNG do PWA sem dependências externas (apenas zlib nativo).
// Fundo azul #1E40AF com um bloco laranja #F97316 centralizado.
// Execução: node scripts/generate-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = resolve(__dirname, "../public/icons");

const BG = [0x1e, 0x40, 0xaf]; // azul primário
const FG = [0xf9, 0x73, 0x16]; // laranja accent

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size, { maskable = false } = {}) {
  // Margem de segurança maior para ícones maskable.
  const margin = maskable ? Math.round(size * 0.3) : Math.round(size * 0.22);
  const inner = size - margin * 2;
  const radius = Math.round(inner * 0.18);

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filtro: none
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      const inX = x >= margin && x < margin + inner;
      const inY = y >= margin && y < margin + inner;
      let color = BG;
      if (inX && inY) {
        // cantos arredondados do bloco interno
        const lx = x - margin;
        const ly = y - margin;
        const nearCornerX = Math.min(lx, inner - 1 - lx);
        const nearCornerY = Math.min(ly, inner - 1 - ly);
        const inCorner = nearCornerX < radius && nearCornerY < radius;
        const dx = radius - nearCornerX;
        const dy = radius - nearCornerY;
        if (!inCorner || dx * dx + dy * dy <= radius * radius) {
          color = FG;
        }
      }
      raw[px] = color[0];
      raw[px + 1] = color[1];
      raw[px + 2] = color[2];
      raw[px + 3] = 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(ICONS_DIR, { recursive: true });

const outputs = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const o of outputs) {
  const png = makePng(o.size, { maskable: o.maskable });
  writeFileSync(resolve(ICONS_DIR, o.name), png);
  console.log(`gerado: public/icons/${o.name} (${png.length} bytes)`);
}
