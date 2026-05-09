// Display names and ordering for known NCERT Class 10 chapters
// Used as fallback when the chapters table has RLS blocking anon access.
// Fix: run this SQL in Supabase to grant anon read on chapters:
//   CREATE POLICY "Public read" ON public.chapters FOR SELECT USING (true);

export const CHAPTER_META: Record<
  string,
  { name: string; order: number }
> = {
  real_numbers: { name: "Real Numbers", order: 1 },
  polynomials: { name: "Polynomials", order: 2 },
  pair_of_linear_equations: { name: "Pair of Linear Equations in Two Variables", order: 3 },
  quadratic_equations: { name: "Quadratic Equations", order: 4 },
  arithmetic_progressions: { name: "Arithmetic Progressions", order: 5 },
  triangles: { name: "Triangles", order: 6 },
  coordinate_geometry: { name: "Coordinate Geometry", order: 7 },
  introduction_trigonometry: { name: "Introduction to Trigonometry", order: 8 },
  applications_trigonometry: { name: "Some Applications of Trigonometry", order: 9 },
  circles: { name: "Circles", order: 10 },
  areas_related_circles: { name: "Areas Related to Circles", order: 11 },
  surface_areas_volumes: { name: "Surface Areas and Volumes", order: 12 },
  statistics: { name: "Statistics", order: 13 },
  probability: { name: "Probability", order: 14 },
};

export function chapterDisplayName(chapterId: string): string {
  return (
    CHAPTER_META[chapterId]?.name ??
    chapterId
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function chapterOrder(chapterId: string): number {
  return CHAPTER_META[chapterId]?.order ?? 99;
}
