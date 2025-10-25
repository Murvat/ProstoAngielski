import BlogDetailContainer from "@/app/domains/blog/containers/BlogDetailContainer";

interface BlogDetailPageProps {
  params: { id: string };
}

export default function BlogDetailPage(_props: BlogDetailPageProps) {
  return <BlogDetailContainer />;
}
