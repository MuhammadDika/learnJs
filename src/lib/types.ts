export interface Test {
  type: "function" | "dom" | "async";
  call?: string;
  expected?: string | number | boolean;
  url?: string;
  mockResponse?: Record<string, unknown>;
  expectedLog?: string;
}

export interface LessonStep {
  type: "concept" | "practice" | "quiz";
  title: string;
  content?: string;
  example?: string;
  explanation?: string;
  instruction?: string;
  starterCode?: string;
  solution?: string;
  hint?: string;
  test?: Test;
  question?: string;
  options?: string[];
  correct?: number;
}

export interface LessonData {
  title: string;
  subtitle: string;
  steps: LessonStep[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  isActive: boolean;
  progress?: number;
  lessons?: number;
  completedLessons?: number;
}

export interface ProgressData {
  [courseId: string]: {
    completedSteps: number[];
  };
} 