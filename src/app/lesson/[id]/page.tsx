import type { JSX } from "react";
import { allLessons } from "@/lib/lessons";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

export default async function LessonPage(props: any): Promise<JSX.Element> {
  const lessonData = allLessons[props.params.id];

  if (!lessonData) {
    notFound();
  }

  return <LessonView lessonData={lessonData} courseId={props.params.id} />;
}
