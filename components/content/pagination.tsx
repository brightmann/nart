import Link from "next/link";
import { allPosts } from "contentlayer/generated";

import { cn, getBlurDataURL } from "@/lib/utils";

export const PER_PAGE = 5;

export function paginate<T>(items: T[], page: number) {
  const total = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const curr = Math.min(Math.max(Math.trunc(page) || 1, 1), total);
  return {
    curr,
    total,
    items: items.slice((curr - 1) * PER_PAGE, curr * PER_PAGE),
  };
}

export const totalPages = (count: number) =>
  Math.max(1, Math.ceil(count / PER_PAGE));

export async function getBlogPosts() {
  return allPosts
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPage(page: number) {
  const posts = await getBlogPosts();
  const { curr, total, items } = paginate(posts, page);
  const withBlur = await Promise.all(
    items.map(async (post) => ({
      ...post,
      blurDataURL: await getBlurDataURL(post.image),
    })),
  );
  return { curr, total, posts: withBlur };
}

const pageHref = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);

function pageNumbers(curr: number, total: number) {
  const set = new Set([1, total, curr - 1, curr, curr + 1]);
  return Array.from(set)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

const linkCls = cn(
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm",
  "transition-colors hover:bg-accent hover:text-accent-foreground",
);
const activeCls =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground";
const disabledCls =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm text-muted-foreground opacity-50";

export function Pager({ curr, total }: { curr: number; total: number }) {
  if (total <= 1) return null;
  const nums = pageNumbers(curr, total);
  const items: React.ReactNode[] = [];

  items.push(
    curr > 1 ? (
      <Link key="prev" href={pageHref(curr - 1)} className={linkCls}>
        Previous
      </Link>
    ) : (
      <span key="prev" className={disabledCls}>
        Previous
      </span>
    ),
  );

  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) {
      items.push(
        <span key={`gap-${n}`} className="px-1 text-sm text-muted-foreground">
          …
        </span>,
      );
    }
    items.push(
      n === curr ? (
        <span key={n} aria-current="page" className={activeCls}>
          {n}
        </span>
      ) : (
        <Link key={n} href={pageHref(n)} className={linkCls}>
          {n}
        </Link>
      ),
    );
    prev = n;
  }

  items.push(
    curr < total ? (
      <Link key="next" href={pageHref(curr + 1)} className={linkCls}>
        Next
      </Link>
    ) : (
      <span key="next" className={disabledCls}>
        Next
      </span>
    ),
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-12"
    >
      {items}
    </nav>
  );
}
