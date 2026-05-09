import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { chapterDisplayName, chapterOrder } from "@/lib/chapterMeta";
import type { Curriculum, Chapter, Concept, Question } from "@/types/database";

export const dynamic = "force-dynamic";

const TRIG_CHAPTERS = new Set([
  "introduction_trigonometry",
  "applications_trigonometry",
]);

interface Props {
  params: Promise<{ curriculumId: string; chapterId: string }>;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

const TYPE_LABELS: Record<string, string> = {
  MCQ: "MCQ",
  VSA: "Very Short",
  SA: "Short",
  LA: "Long",
  CaseBased: "Case Study",
};

export default async function ChapterPage({ params }: Props) {
  const { curriculumId, chapterId } = await params;
  const supabase = await createServerSupabaseClient();

  const [
    { data: curriculumRaw },
    { data: chapterRaw },
    { data: conceptsRaw },
    { data: questionsRaw },
  ] = await Promise.all([
    supabase.from("curricula").select("*").eq("id", curriculumId).single(),
    supabase
      .from("chapters")
      .select("*")
      .eq("curriculum_id", curriculumId)
      .eq("chapter_id", chapterId)
      .single(),
    supabase
      .from("concepts")
      .select("*")
      .eq("curriculum_id", curriculumId)
      .eq("chapter_id", chapterId),
    supabase
      .from("questions")
      .select("*")
      .eq("curriculum_id", curriculumId)
      .eq("chapter_id", chapterId)
      .order("year", { ascending: false }),
  ]);

  const curriculum = curriculumRaw as Curriculum | null;
  const concepts = (conceptsRaw ?? []) as Concept[];
  const questions = (questionsRaw ?? []) as Question[];

  if (!curriculum) notFound();

  // Fallback if chapters table has RLS blocking anon reads
  const chapterRawTyped = chapterRaw as Chapter | null;
  const chapterName = chapterRawTyped?.chapter_name ?? chapterDisplayName(chapterId);
  const chapterNum = chapterRawTyped?.chapter_order ?? chapterOrder(chapterId);

  const isTrig = TRIG_CHAPTERS.has(chapterId);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-white/70 transition-colors">
            {curriculum.course}
          </Link>
          <span>/</span>
          <Link
            href={`/explore/${curriculumId}`}
            className="hover:text-white/70 transition-colors"
          >
            {curriculum.subject}
          </Link>
          <span>/</span>
          <span className="text-white/70">{chapterName}</span>
        </nav>

        {/* Chapter header */}
        <div className="mb-10">
          <span className="text-xs font-mono text-white/30 mb-2 block">
            Chapter {chapterNum}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {chapterName}
          </h1>

          {isTrig && (
            <Link
              href="/trigquest"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent/90 text-sm font-medium text-white transition-all duration-300 mt-2"
            >
              🎮 Play TrigQuest
            </Link>
          )}
        </div>

        {/* Topics */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">
            Topics{" "}
            <span className="text-sm font-normal text-white/40">
              ({concepts.length})
            </span>
          </h2>

          {concepts.length > 0 ? (
            <div className="space-y-3">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="p-4 rounded-xl bg-[#1a1a2e] border border-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {concept.name}
                      </p>
                      {concept.description && (
                        <p className="text-xs text-white/40 leading-relaxed">
                          {concept.description}
                        </p>
                      )}
                    </div>
                    {!isTrig && (
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 border border-white/[0.06]">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No topics found for this chapter.</p>
          )}
        </section>

        {/* PYQs */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Past Year Questions{" "}
            <span className="text-sm font-normal text-white/40">
              ({questions.length})
            </span>
          </h2>

          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-[#1a1a2e] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {q.year && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent-light border border-accent/20">
                        {q.year}
                      </span>
                    )}
                    {q.question_type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.06]">
                        {TYPE_LABELS[q.question_type] ?? q.question_type}
                      </span>
                    )}
                    {q.marks && (
                      <span className="text-xs text-white/30">{q.marks}M</span>
                    )}
                    {q.difficulty && (
                      <span
                        className={`text-xs font-medium ${DIFFICULTY_COLORS[q.difficulty] ?? "text-white/40"}`}
                      >
                        {q.difficulty}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed mb-3">
                    {q.question_text}
                  </p>

                  {q.options && q.options.length > 0 && (
                    <ol className="list-[upper-alpha] list-inside space-y-1 pl-1">
                      {q.options.map((opt, idx) => {
                        // options can be plain strings or {id, text} objects
                        const label =
                          typeof opt === "string"
                            ? opt
                            : (opt as { id?: string; text?: string }).text ?? String(opt);
                        return (
                          <li key={idx} className="text-xs text-white/50">
                            {label}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No PYQs found for this chapter.</p>
          )}
        </section>
      </div>
    </main>
  );
}
