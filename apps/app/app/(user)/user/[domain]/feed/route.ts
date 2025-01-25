import { getArticlesByAuthor } from "@/actions/articles";
import { getBookmarksByAuthor } from "@/actions/bookmarks";
import { getProjectsByAuthor } from "@/actions/projects";
import { getUserByDomain } from "@repo/backend/auth/utils";
import { getSearchParams } from "@/helper/utils";
import { Article, Project } from "@/helper/utils";
import { Feed } from "feed";
import { getUserName } from "@repo/backend/auth/format";

type Post = Article | Omit<Project, "password">;

function isPostArticle(post: Post): post is Article {
  return (post as Article).publishedAt !== undefined;
}

export async function GET(
  req: Request,
  context: { params: { domain: string } },
) {
  const { type = "rss" } = getSearchParams(req.url) as {
    type?: "rss" | "atom";
  };
  const user = await getUserByDomain(context.params.domain);
  if (!user) {
    return new Response(null, { status: 404 });
  }
  const id = `https://${user.user_metadata.domain ?? `${user.user_metadata.username}.${process.env.NEXT_PUBLIC_USER_DOMAIN}`}`;
  const name = getUserName(user) || user.user_metadata.username;
  const author = {
    name,
    link: id,
  };
  const feed = new Feed({
    id,
    title: name,
    link: id,
    description: user.user_metadata.about ?? "",
    image: user.user_metadata.ogImage ?? "",
    favicon: user.user_metadata.image ?? "",
    copyright: `All rights reserved ${new Date().getFullYear()}, ${name}`,
    feedLinks: {
      atom: `${id}/feed?type=atom`,
    },
    author,
  });

  const [articles, projects, bookmarks] = await Promise.all([
    getArticlesByAuthor(user.id),
    getProjectsByAuthor(user.id),
    getBookmarksByAuthor(user.id),
  ]);

  const posts = [...articles, ...projects];
  posts.forEach((post) => {
    const isArticle = isPostArticle(post);
    const postId = `${id}/${isArticle ? "articles" : "projects"}/${post.slug}`;
    const publishedAt = isArticle ? post.publishedAt : post.createdAt;
    feed.addItem({
      id: postId,
      title: post.title,
      link: postId,
      description: post.seoDescription!,
      author: [author],
      contributor: [author],
      date: publishedAt,
      published: publishedAt,
      image: post.ogImage!,
      category: [
        {
          name: isArticle ? "Articles" : "Projects",
        },
      ],
    });
  });
  bookmarks.forEach((bookmark) => {
    const [url, updatedAt] = [
      `https://go.openstudio.co.in/${bookmark.id}`,
      bookmark.updatedAt,
    ];
    feed.addItem({
      id: url,
      title: bookmark.title,
      link: url,
      author: [author],
      contributor: [author],
      date: updatedAt,
      published: updatedAt,
      category: [
        {
          name: "Bookmarks",
        },
      ],
    });
  });

  return new Response(type === "atom" ? feed.atom1() : feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
