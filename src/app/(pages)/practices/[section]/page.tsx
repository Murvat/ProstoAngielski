import { notFound } from "next/navigation";
import PracticeSectionPageContainer from "@/app/domains/practices/containers/PracticeSectionPageContainer";
import { isPracticeSectionKey } from "@/app/domains/practices/constants";

export default function PracticeSectionPage({
  params,
}: {
  params: { section: string };
}) {
  if (!isPracticeSectionKey(params.section)) {
    notFound();
  }

  return <PracticeSectionPageContainer section={params.section} />;
}
