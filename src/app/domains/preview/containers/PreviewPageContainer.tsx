// src/domains/landing/containers/PreviewPageContainer.tsx

import Hero from "../components/Hero";
import Description from "../components/Description";
// import Frame from "../components/Frame";
import Prices from "../components/Prices";
import Compare from "../components/Compare";
import Difference from "../components/Difference";
import Footer from "../components/Footer";
import NavbarContainer from "../../navbar/containers/NavbarContainer";

import FramePreview from "../components/Frame";
export default function PreviewPageContainer() {
  return (
    <>
      <NavbarContainer initialUser={null} />
      <PromoBanner />
      <Hero />
      <FramePreview />
      <Description />
      <Prices />
      <Compare />
      <Difference />
      <Footer />
    </>
  );
}
