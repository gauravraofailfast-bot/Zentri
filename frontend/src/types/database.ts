export interface Curriculum {
  id: string;
  course: string;
  subject: string;
  icon: string | null;
  sort_order: number | null;
}

export interface Chapter {
  id: string;
  curriculum_id: string;
  chapter_id: string;
  chapter_name: string;
  chapter_order: number | null;
  page_range: string | null;
}

export interface Concept {
  id: string;
  curriculum_id: string;
  language: string;
  chapter_id: string;
  topic_id: string | null;
  name: string;
  description: string | null;
  source_reference: string | null;
  prerequisites: string[] | null;
  mastery_criteria: Record<string, unknown> | null;
  common_misconceptions: Record<string, unknown> | null;
}

export interface Question {
  id: string;
  curriculum_id: string;
  chapter_id: string;
  concept_id: string | null;
  language: string;
  question_text: string;
  question_type: string | null;
  options: string[] | null;
  answer: string | null;
  answer_explanation: string | null;
  difficulty: string | null;
  source: string | null;
  year: number | null;
  marks: number | null;
  cognitive_skill: string | null;
  estimated_solve_time_sec: number | null;
  tags: string[] | null;
  topic_hint: string | null;
  question_number: string | null;
}

type TableDef<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
};

export interface Database {
  public: {
    Tables: {
      curricula: TableDef<Curriculum>;
      chapters: TableDef<Chapter>;
      concepts: TableDef<Concept>;
      questions: TableDef<Question>;
    };
  };
}
