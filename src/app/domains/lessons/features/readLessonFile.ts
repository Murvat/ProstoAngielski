// import fs from "fs";
// import path from "path";

// export function readLessonFile(lessonPath: string) {
//   const base = path.join(process.cwd(), "src", "content", lessonPath);

//   const mdPath = `${base}.md`;
//   const mdxPath = `${base}.mdx`;

//   if (fs.existsSync(mdPath)) {
//     return fs.readFileSync(mdPath, "utf8");
//   }

//   if (fs.existsSync(mdxPath)) {
//     return fs.readFileSync(mdxPath, "utf8");
//   }

//   console.error(`Lesson file not found. Tried:\n${mdPath}\n${mdxPath}`);
//   return null;
// }
