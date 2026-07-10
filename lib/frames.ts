/** Frame-sequence manifest for scroll-scrubbed scenes. Counts match extraction. */
export const SEQUENCES = {
  hero: { count: 111, dir: "/media/frames/hero" },
  orbit: { count: 101, dir: "/media/frames/orbit" },
  exploded: { count: 101, dir: "/media/frames/exploded" },
} as const;

export function framePaths(name: keyof typeof SEQUENCES): string[] {
  const { count, dir } = SEQUENCES[name];
  return Array.from(
    { length: count },
    (_, i) => `${dir}/f_${String(i + 1).padStart(4, "0")}.webp`
  );
}
