import { constructMetadata } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";
import { Pager, getBlogPage } from "@/components/content/pagination";

export const metadata = constructMetadata({
  title: "Blog – Next Template",
  description: "Latest news and updates from Next Auth Roles Template.",
});

export default async function BlogPage() {
  const { curr, total, posts } = await getBlogPage(1);

  return (
    <>
      <BlogPosts posts={posts} />
      <Pager curr={curr} total={total} />
    </>
  );
}
