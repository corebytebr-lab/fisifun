import { CHAPTERS } from "@/content/index";
import LessonClient from "./LessonClient";

export function generateStaticParams() {
  const params: { chapterId: string; lessonId: string }[] = [];
  for (const c of CHAPTERS) {
    for (const l of c.lessons) {
      params.push({ chapterId: c.id, lessonId: l.id });
    }
  }
  return params;
}

export default function LessonPage() {
  return <LessonClient />;
}
