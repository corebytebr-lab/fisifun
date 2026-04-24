import { CHAPTERS } from "@/content/index";
import ChapterClient from "./ChapterClient";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapterId: c.id }));
}

export default function ChapterPage() {
  return <ChapterClient />;
}
