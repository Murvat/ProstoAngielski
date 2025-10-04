import PreviewPageContainer from "./domains/preview/containers/PreviewPageContainer";

export const metadata = {
  title: "ProstoAngielski – Ucz się angielskiego łatwo",
  description: "ProstoAngielski to interaktywna platforma do nauki języka angielskiego dla Polaków – kursy, ćwiczenia i AI-nauczyciel w jednym miejscu.",
  icons: {
    icon: "/logoweb2.svg", // replace with your logo path
  },
};

function page () {
  return <PreviewPageContainer/>
      }
      

export default page;
