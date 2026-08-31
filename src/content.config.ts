import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const news = defineCollection({
  loader: glob({ base: "./src/content/news", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["官方聲明", "產品新訊", "媒體報導", "近期活動"]),
    publishedAt: z.coerce.date(),
    excerpt: z.string(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  }),
});

const knowledge = defineCollection({
  loader: glob({ base: "./src/content/knowledge", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["保健新知", "飲食指南", "成分功效"]),
    publishedAt: z.coerce.date(),
    excerpt: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { news, knowledge };
