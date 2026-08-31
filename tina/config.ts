import { defineConfig } from "tinacms";

const branch =
  process.env.TINA_BRANCH ||
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  process.env.CF_PAGES_BRANCH ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "news",
        label: "最新消息",
        path: "src/content/news",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => values?.title || "news-item",
          },
          router: ({ document }) => `/news/${document._sys.filename}`,
        },
        defaultItem: () => ({
          category: "產品新訊",
          publishedAt: new Date().toISOString(),
          featured: false,
          draft: true,
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "標題",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "分類",
            required: true,
            options: ["官方聲明", "產品新訊", "媒體報導", "近期活動"],
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "發布時間",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "摘要",
            ui: { component: "textarea" },
            required: true,
          },
          {
            type: "image",
            name: "cover",
            label: "封面圖片",
          },
          {
            type: "boolean",
            name: "featured",
            label: "首頁精選",
          },
          {
            type: "boolean",
            name: "draft",
            label: "草稿",
          },
          {
            type: "rich-text",
            name: "body",
            label: "內文",
            isBody: true,
            required: true,
          },
          {
            type: "object",
            name: "seo",
            label: "SEO",
            fields: [
              { type: "string", name: "title", label: "SEO 標題" },
              {
                type: "string",
                name: "description",
                label: "SEO 描述",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
      {
        name: "knowledge",
        label: "健康知識",
        path: "src/content/knowledge",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => values?.title || "knowledge-item",
          },
          router: ({ document }) => `/knowledge/${document._sys.filename}`,
        },
        defaultItem: () => ({
          category: "保健新知",
          publishedAt: new Date().toISOString(),
          draft: true,
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "標題",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "分類",
            required: true,
            options: ["保健新知", "飲食指南", "成分功效"],
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "發布時間",
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "摘要",
            ui: { component: "textarea" },
            required: true,
          },
          {
            type: "image",
            name: "cover",
            label: "封面圖片",
          },
          {
            type: "boolean",
            name: "draft",
            label: "草稿",
          },
          {
            type: "rich-text",
            name: "body",
            label: "內文",
            isBody: true,
            required: true,
          },
          {
            type: "object",
            name: "seo",
            label: "SEO",
            fields: [
              { type: "string", name: "title", label: "SEO 標題" },
              {
                type: "string",
                name: "description",
                label: "SEO 描述",
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
    ],
  },
});
