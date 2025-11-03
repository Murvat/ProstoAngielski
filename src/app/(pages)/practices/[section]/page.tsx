import { notFound } from "next/navigation";
import PracticeSectionPageContainer from "@/app/domains/practices/containers/PracticeSectionPageContainer";
import { isPracticeSectionKey } from "@/app/domains/practices/constants";

type Props = {
  params: { section: string };
};

export default function PracticeSectionPage({ params }: Props) {
  if (!isPracticeSectionKey(params.section)) {
    notFound();
  }

  return <PracticeSectionPageContainer section={params.section} />;
}
