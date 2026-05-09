import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { chapterDisplayName, chapterOrder } from "@/lib/chapterMeta";
import type { Curriculum, Chapter } from "@/types/database";

export const dynamic = "force-dynamic";

const TRIG_CHAPTERS = new Set([
  "introduction_trigonometry",
  "applications_trigonometry",
]);

interface Props {
  params: Promise<{ curriculumId: string }>;
}

interface DerivedChapter {
  chapter_id: string;
  chapter_name: string;
  chapter_order: number;
}

export default async function CurriculumPage({ params }: Props) {
  const { curriculumId } = await params;
  const supabase = await createServerSupabaseClient();

  const [
    { data: curriculumRaw },
    { data: chaptersRaw },
    { data: conceptCountsRaw },
    { data: questionCountsRaw },
  ] = await Promise.all([
    supabase.from("curricula").select("*").eq("id", curriculumId).single(),
    supabase
      .from("chapters")
      .select("*")
      .eq("curriculum_id", curriculumId)
      .order("chapter_order"),
    supabase
      .from("concepts")
      .select("chapter_id")
      .eq("curriculum_id", curriculumId),
    supabase
      .from("questions")
      .select("chapter_id")
      .eq("curriculum_id", curriculumId),
  ]);

  const curriculum = curriculumRaw as Curriculum | null;
  if (!curriculum) notFound();

  const conceptCounts = (conceptCountsRaw ?? []) as { chapter_id: string }[];
  const questionCounts = (questionCountsRaw ?? []) as { chapter_id: string }[];

  // Use chapters table if available; otherwise derive from concepts (RLS fallback)
  let chapters: DerivedChapter[];
  if (chaptersRaw && chaptersRaw.length > 0) {
    chapters = (chaptersRaw as Chapter[]).map((c) => ({
      chapter_id: c.chapter_id,
      chapter_name: c.chapter_name,
      chapter_order: c.chapter_order ?? 99,
    }));
  } else {
    const uniqueChapterIds = [...new Set(conceptCounts.map((c) => c.chapter_id))];
    chapters = uniqueChapterIds
      .map((id) => ({
        chapter_id: id,
        chapter_name: chapterDisplayName(id),
        chapter_order: chapterOrder(id),
      }))
      .sort((a, b) => a.chapter_order - b.chapter_order);
  }

  // Build count maps
  const topicsByChapter = new Map<string, number>();
  for (const c of conceptCounts) {
    topicsByChapter.set(c.chapter_id, (topicsByChapter.get(c.chapter_id) ?? 0) + 1);
  }

  const pyqsByChapter = new Map<string, number>();
  for (const q of questionCounts) {
    pyqsByChapter.set(q.chapter_id, (pyqsByChapter.get(q.chapter_id) ?? 0) + 1);
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-white/70 transition-colors">
            {curriculum.course}
          </Link>
          <span>/</span>
          <span className="text-white/70">{curriculum.subject}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {curriculum.subject}
          </h1>
          <p className="text-white/50">
            {chapters.length} chapters · {curriculum.course}
          </p>
        </div>

        {/* Chapters grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {chapters.map((chapter) => {
            const isTrig = TRIG_CHAPTERS.has(chapter.chapter_id);
            const topicCount = topicsByChapter.get(chapter.chapter_id) ?? 0;
            const pyqCount = pyqsByChapter.get(chapter.chapter_id) ?? 0;

            return (
              <Link
                key={chapter.chapter_id}
                href={`/explore/${curriculumId}/${chapter.chapter_id}`}
                className="group relative block p-6 rounded-2xl bg-[#1a1a2e] border border-white/[0.08] hover:border-accent/40 hover:bg-[#1e1e35] transition-all duration-300"
              >
                {isTrig && (
                  <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-light border border-accent/30">
                    Playable
                  </span>
                )}

                <div className="mb-3">
                  <span className="text-xs font-mono text-white/30">
                    Ch. {chapter.chapter_order}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground mb-3 group-hover:text-accent-light transition-colors pr-16">
                  {chapter.chapter_name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>{topicCount} topics</span>
                  <span>{pyqCount} PYQs</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
