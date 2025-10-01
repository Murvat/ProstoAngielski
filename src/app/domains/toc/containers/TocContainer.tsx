"use client";

import { useExtractHeadings } from "../features/useExtractHeadings";
import Toc from "../components/Toc";

export default function TocContainer() {
  const { toc, activeId } = useExtractHeadings("#htmlContent");

  return <Toc toc={toc} activeId={activeId} />;
}
