import { notFound } from "next/navigation";
import PracticeSectionPageContainer from "@/app/domains/practices/containers/PracticeSectionPageContainer";
import { isPracticeSectionKey } from "@/app/domains/practices/constants";

export default async function PracticeSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isPracticeSectionKey(section)) {
    notFound();
  }

  return <PracticeSectionPageContainer section={section} />;
}
