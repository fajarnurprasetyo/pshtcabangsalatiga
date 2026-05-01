import type {
  ArticleQueryResult,
  ArticleTitleQueryResult,
} from "@/generated/types/sanity";
import { groq } from "next-sanity";
import client from "./client";

export const ArticleTitleQuery = groq`*[_type == "article" && slug.current == $slug][0].title`;

export async function fetchArticleTitle(slug: string) {
  return await client.fetch<ArticleTitleQueryResult>(ArticleTitleQuery, {
    slug,
  });
}

const ArticleQuery = groq`
*[_type == "article" && defined(slug.current)][0]
{
  _id,
  title,
  slug,
  date,
  thumbnail,
  content
}
`;

export async function fetchArticle(slug: string) {
  return await client.fetch<ArticleQueryResult>(ArticleQuery, { slug });
}
