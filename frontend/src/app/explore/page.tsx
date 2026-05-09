import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Curriculum } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: curriculaRaw }, { data: questionCountsRaw }] = await Promise.all([
    supabase.from("curricula").select("*").order("sort_order"),
    supabase.from("questions").select("curriculum_id"),
  ]);

  const curricula = (curriculaRaw ?? []) as Curriculum[];
  const questionCounts = (questionCountsRaw ?? []) as { curriculum_id: string }[];

  // Group curricula by course
  const courseMap = new Map<string, Curriculum[]>();
  for (const c of curricula) {
    const list = courseMap.get(c.course) ?? [];
    list.push(c);
    courseMap.set(c.course, list);
  }

  // Count PYQs per curriculum
  const pyqByCurriculum = new Map<string, number>();
  for (const q of questionCounts) {
    pyqByCurriculum.set(
      q.curriculum_id,
      (pyqByCurriculum.get(q.curriculum_id) ?? 0) + 1
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link
          href="/"
          className="text-sm text-white/40 hover:text-white/70 transition-colors mb-6 inline-block"
        >
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Choose your course
        </h1>
        <p className="text-white/50 text-base">
          Pick a subject to explore chapters, topics, and practice questions.
        </p>
      </div>

      {/* Courses */}
      <div className="max-w-4xl mx-auto space-y-12">
        {Array.from(courseMap.entries()).map(([course, subjects]) => (
          <section key={course}>
            <h2 className="text-lg font-semibold text-white/60 uppercase tracking-widest mb-6">
              {course}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {subjects.map((curriculum) => {
                const pyqCount = pyqByCurriculum.get(curriculum.id) ?? 0;
                return (
                  <Link
                    key={curriculum.id}
                    href={`/explore/${curriculum.id}`}
                    className="group block p-6 rounded-2xl bg-[#1a1a2e] border border-white/[0.08] hover:border-accent/40 hover:bg-[#1e1e35] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl">
                        {curriculum.icon ?? "📚"}
                      </div>
                      <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                        Explore →
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-accent-light transition-colors">
                      {curriculum.subject}
                    </h3>
                    <p className="text-xs text-white/40">
                      {pyqCount} PYQs available
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {curricula.length === 0 && (
          <p className="text-white/40 text-center py-20">
            No courses available yet. Check back soon.
          </p>
        )}
      </div>
    </main>
  );
}
