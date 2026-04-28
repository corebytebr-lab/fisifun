import type { Metadata } from "next";
import { ProfessorClient } from "./ProfessorClient";

export const metadata: Metadata = {
  title: "Modo Professor — FisiFun",
  description: "Ensine os Lumers. Explique um tópico de Física e responda as perguntas dos alunos virtuais.",
};

export default function ProfessorPage() {
  return <ProfessorClient />;
}
