import type { JSX } from "react";
import { allLessons } from "@/lib/lessons";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const awaitedParams = await params;
  const lessonData = allLessons[awaitedParams.id];

  if (!lessonData) {
    notFound();
  }

  return <LessonView lessonData={lessonData} courseId={awaitedParams.id} />;
}
