import type { JSX } from "react";
import { allLessons } from "@/lib/lessons";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

export default async function LessonPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const lessonData = allLessons[params.id];

  if (!lessonData) {
    notFound();
  }

  return <LessonView lessonData={lessonData} courseId={params.id} />;
}
