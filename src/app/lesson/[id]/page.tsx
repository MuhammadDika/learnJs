import { allLessons } from "@/lib/lessons";
import { notFound } from "next/navigation";
import LessonView from "./lesson-view";

type LessonPageProps = {
  params: {
    id: string;
  };
};

export default async function LessonPage({ params }: LessonPageProps) {
  const lessonData = allLessons[params.id];

  if (!lessonData) {
    notFound();
  }

  return <LessonView lessonData={lessonData} courseId={params.id} />;
}
