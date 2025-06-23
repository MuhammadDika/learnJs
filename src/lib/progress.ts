const PROGRESS_KEY = "learnjs_progress";
const LAST_ACTIVE_COURSE_KEY = "learnjs_last_active_course";

type ProgressData = {
  [courseId: string]: {
    completedSteps: number[];
  };
};

// Function to get all progress from localStorage
export const getProgress = (): ProgressData => {
  if (typeof window === "undefined") {
    return {};
  }
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
};

// Function to save progress to localStorage
const saveProgress = (progress: ProgressData) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

// Function to mark a step as complete
export const completeStep = (courseId: string, stepIndex: number) => {
  const progress = getProgress();
  if (!progress[courseId]) {
    progress[courseId] = { completedSteps: [] };
  }

  const completed = progress[courseId].completedSteps;
  if (!completed.includes(stepIndex)) {
    completed.push(stepIndex);
  }

  saveProgress(progress);
};

// --- New functions for last active course ---

// Function to get the last active course ID from localStorage
export const getLastActiveCourse = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(LAST_ACTIVE_COURSE_KEY);
};

// Function to set the last active course ID in localStorage
export const setLastActiveCourse = (courseId: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ACTIVE_COURSE_KEY, courseId);
}; 