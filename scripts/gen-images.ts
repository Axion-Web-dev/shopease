import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "products");
const HERO_PATH = path.join(process.cwd(), "public", "hero.png");

type Job = { slug: string; prompt: string };

const jobs: Job[] = [
  // Fashion
  { slug: "classic-denim-jacket", prompt: "Professional e-commerce product photography of a classic blue denim jacket on a wooden hanger, neutral beige background, soft studio lighting, centered, high quality, detailed" },
  { slug: "wool-blend-overcoat", prompt: "Professional e-commerce product photography of a camel wool blend overcoat on a minimalist mannequin, soft neutral background, studio lighting, centered, high quality" },
  { slug: "minimalist-white-sneakers", prompt: "Professional e-commerce product photography of minimalist white leather sneakers, clean light gray gradient background, studio lighting, centered, high quality" },
  { slug: "cotton-crewneck-tshirt", prompt: "Professional e-commerce product photography of a neatly folded cotton crewneck t-shirt in sage green, neutral background, studio lighting, high quality" },
  { slug: "tailored-chino-pants", prompt: "Professional e-commerce product photography of tailored beige chino pants neatly folded, neutral background, studio lighting, high quality" },
  // Electronics
  { slug: "wireless-headphones", prompt: "Professional e-commerce product photography of premium over-ear wireless headphones in matte black, clean white background, studio lighting, centered, high quality" },
  { slug: "smart-fitness-watch", prompt: "Professional e-commerce product photography of a modern smart fitness watch with black silicone band and vibrant screen, clean white background, studio lighting, high quality" },
  { slug: "bluetooth-speaker", prompt: "Professional e-commerce product photography of a portable cylindrical bluetooth speaker in charcoal fabric, clean white background, studio lighting, high quality" },
  { slug: "mechanical-keyboard", prompt: "Professional e-commerce product photography of a compact mechanical keyboard with brown switches, clean white background, studio lighting, high quality" },
  { slug: "wireless-charging-pad", prompt: "Professional e-commerce product photography of a sleek round wireless charging pad in matte white, clean white background, studio lighting, high quality" },
  // Accessories
  { slug: "leather-travel-backpack", prompt: "Professional e-commerce product photography of a brown leather travel backpack, clean neutral beige background, studio lighting, centered, high quality" },
  { slug: "aviator-sunglasses", prompt: "Professional e-commerce product photography of aviator sunglasses with gold metal frame and green lenses, clean white background, studio lighting, high quality" },
  { slug: "stainless-steel-watch", prompt: "Professional e-commerce product photography of a minimalist stainless steel wristwatch with white dial and silver bracelet, clean light background, studio lighting, high quality" },
  { slug: "leather-wallet", prompt: "Professional e-commerce product photography of a minimalist brown leather bifold wallet, clean neutral background, studio lighting, high quality" },
  { slug: "silk-scarf", prompt: "Professional e-commerce product photography of an elegantly folded silk scarf with floral pattern in warm tones, clean neutral background, studio lighting, high quality" },
  // Home
  { slug: "ceramic-coffee-mug-set", prompt: "Professional e-commerce product photography of a set of two matte ceramic coffee mugs in terracotta and cream, clean neutral background, studio lighting, high quality" },
  { slug: "scented-soy-candle", prompt: "Professional e-commerce product photography of a scented soy candle in a glass jar with wooden lid, clean neutral background, studio lighting, high quality" },
  { slug: "linen-throw-blanket", prompt: "Professional e-commerce product photography of a neatly folded linen throw blanket in warm beige, clean neutral background, studio lighting, high quality" },
  { slug: "modern-desk-lamp", prompt: "Professional e-commerce product photography of a modern minimalist LED desk lamp in matte white, clean light background, studio lighting, high quality" },
  { slug: "indoor-plant-pot-set", prompt: "Professional e-commerce product photography of a set of three ceramic indoor plant pots with small green plants, clean neutral background, studio lighting, high quality" },
];

async function generateOne(zai: any, prompt: string, size: string, outPath: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await zai.images.generations.create({ prompt, size });
      const b64 = response.data[0].base64;
      fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
      return true;
    } catch (e: any) {
      console.error(`  attempt ${attempt} failed for ${path.basename(outPath)}: ${e.message}`);
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  return false;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  // Hero
  if (!fs.existsSync(HERO_PATH)) {
    console.log("Generating hero...");
    const ok = await generateOne(
      zai,
      "Wide e-commerce lifestyle hero banner, stylish modern living space with fashion accessories, headphones and home decor elegantly arranged, warm natural lighting, premium minimal aesthetic, soft shadows, high quality, no text",
      "1344x768",
      HERO_PATH
    );
    console.log(ok ? "  hero done" : "  hero FAILED");
  } else {
    console.log("hero exists, skipping");
  }

  let done = 0;
  let failed = 0;
  for (const job of jobs) {
    const out = path.join(OUT_DIR, `${job.slug}.png`);
    if (fs.existsSync(out)) {
      console.log(`exists: ${job.slug}`);
      done++;
      continue;
    }
    console.log(`generating: ${job.slug}`);
    const ok = await generateOne(zai, job.prompt, "1024x1024", out);
    if (ok) { done++; console.log(`  done (${done}/${jobs.length})`); }
    else { failed++; console.log(`  FAILED: ${job.slug}`); }
  }
  console.log(`\nFINISHED. success=${done} failed=${failed}`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
