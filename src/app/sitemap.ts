import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://kelenix.com";
const locales = ["fr", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let services: { slug: string; updatedAt: Date }[] = [];
  let projects: { slug: string; updatedAt: Date }[] = [];
  let blogPosts: { slug: string; updatedAt: Date }[] = [];
  try {
    [services, projects, blogPosts] = await Promise.all([
      prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB not available during build; return static pages only
  }

  const staticPages = [
    "/",
    "/a-propos",
    "/services",
    "/portfolio",
    "/blog",
    "/temoignages",
    "/contact",
    "/devis",
    "/faq",
    "/carrieres",
    "/partenaires",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/cgu",
    "/cookies",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
        lastModified: new Date(),
        changeFrequency: page === "/" ? "daily" : "weekly",
        priority: page === "/" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${BASE_URL}/${l}${page === "/" ? "" : page}`])
          ),
        },
      });
    }

    for (const service of services) {
      entries.push({
        url: `${BASE_URL}/${locale}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${BASE_URL}/${locale}/portfolio/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
