import type {
  ArticleQueryFullResult,
  ArticleQueryResult,
} from "@/sanity/types";
import { groq } from "next-sanity";
import client from "./client";

const ArticleQuery = groq`
*[_type == "article" && defined(slug.current)][0]
{
  _id,
  title,
  slug,
  date,
  image
}
`;

const ArticleQueryFull = groq`
*[_type == "article" && defined(slug.current)][0]
{
  _id,
  title,
  slug,
  date,
  image,
  content
}
`;

export async function fetchArticle<
  F extends boolean = false,
  R = F extends true ? ArticleQueryFullResult : ArticleQueryResult,
>(slug: string, full?: F) {
  return await client.fetch<R>(full ? ArticleQueryFull : ArticleQuery, {
    slug,
  });
}
