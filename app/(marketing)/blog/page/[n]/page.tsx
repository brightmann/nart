import { constructMetadata } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";
import {
  Pager,
  getBlogPage,
  getBlogPosts,
  totalPages,
} from "@/components/content/pagination";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const total = totalPages(posts.length);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    n: `${i + 2}`,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { n: string };
}) {
  return constructMetadata({
    title: `Blog – Page ${params.n} – Next Template`,
    description: "Latest news and updates from Next Auth Roles Template.",
  });
}

export default async function BlogPageNumber({
  params,
}: {
  params: { n: string };
}) {
  const { curr, total, posts } = await getBlogPage(parseInt(params.n, 10));

  return (
    <>
      <BlogPosts posts={posts} />
      <Pager curr={curr} total={total} />
    </>
  );
}
