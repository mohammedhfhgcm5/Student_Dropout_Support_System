import fs from "fs";
import path from "path";

const fontPath = path.resolve("assets/fonts/Amiri-Regular.ttf"); // change if you used Cairo
const outPath  = path.resolve("src/utils/arabicFont.ts");
const fontName = "Amiri"; // "Cairo" if you used Cairo

const data = fs.readFileSync(fontPath);
const b64  = data.toString("base64");

const ts = `// AUTO-GENERATED. Do not edit manually.
export const ARABIC_FONT = "${fontName}";
export const ARABIC_FONT_BASE64 = "${b64}";
`;

fs.writeFileSync(outPath, ts);
console.log("✅ Wrote", outPath);
