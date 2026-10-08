import Image from "next/image";
import Link from "next/link";

import { BLOG_AUTHORS } from "@/config/blog";

export default async function Author({
  username,
  imageOnly,
}: {
  username: string;
  imageOnly?: boolean;
}) {
  // Fall back gracefully for author slugs missing from BLOG_AUTHORS.
  // An unknown author must never crash the whole static build.
  const author = BLOG_AUTHORS[username] ?? {
    name: username,
    image: "/_static/avatars/mickasmt.png",
    twitter: "",
  };

  if (imageOnly) {
    return (
      <Image
        src={author.image}
        alt={author.name}
        width={32}
        height={32}
        className="size-8 rounded-full transition-all group-hover:brightness-90"
      />
    );
  }

  const inner = (
    <>
      <Image
        src={author.image}
        alt={author.name}
        width={40}
        height={40}
        className="size-8 rounded-full transition-all group-hover:brightness-90 md:size-10"
      />
      <div className="flex flex-col -space-y-0.5">
        <p className="font-semibold text-foreground max-md:text-sm">
          {author.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {author.twitter ? `@${author.twitter}` : `@${username}`}
        </p>
      </div>
    </>
  );

  return author.twitter ? (
    <Link
      href={`https://twitter.com/${author.twitter}`}
      className="group flex w-max items-center space-x-2.5"
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </Link>
  ) : (
    <div className="group flex w-max items-center space-x-2.5">{inner}</div>
  );
}
