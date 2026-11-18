// Every <Image> goes through this instead of Vercel's image service, so the site uses none of Vercel's image quota
// (owner, 2026-11-18). Photos in our media folder are WebP with a 480 px copy next to them (name.sm.webp, made by the
// API): small slots get the copy, big ones the full photo (max 1600 px). Anything else (Icecat links, old PNGs) is
// used as it is. The ?w= only tells Next that the width was handled; servers ignore it.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const small = width <= 640 && /\/media\/[^/?]+(?<!\.sm)\.webp$/.test(src);
  return `${small ? src.replace(/\.webp$/, ".sm.webp") : src}?w=${width}`;
}
