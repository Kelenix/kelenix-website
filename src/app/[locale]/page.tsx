import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ProcessSection from "@/components/home/ProcessSection";
import PromoPopup from "@/components/home/PromoPopup";
import ProofNotifications from "@/components/home/ProofNotifications";
import ServicesSection from "@/components/home/ServicesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import StatsSection from "@/components/home/StatsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import CtaSection from "@/components/home/CtaSection";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: {
      absolute: isEn
        ? "Kelenix Tech - Technology & Digital Transformation"
        : "Kelenix Tech - Technologie & Transformation Numérique",
    },
    description: isEn
      ? "Custom software development, AI solutions, web & mobile applications. Kelenix Tech - your digital transformation partner."
      : "Développement logiciel sur mesure, solutions IA, applications web & mobile. Kelenix Tech - votre partenaire en transformation numérique.",
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [projects, testimonials, blogPosts, settingsRows] = await Promise.all([
    prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        slug: true,
        titleFr: true,
        titleEn: true,
        category: true,
        coverImage: true,
        client: true,
      },
    }).catch(() => []),
    prisma.testimonial.findMany({
      where: { published: true, showOnHome: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        titleFr: true,
        titleEn: true,
        excerptFr: true,
        excerptEn: true,
        coverImage: true,
        authorName: true,
        category: true,
        publishedAt: true,
      },
    }).catch(() => []),
    prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            "hero_stat1_value", "hero_stat2_value", "hero_stat3_value", "hero_stat4_value",
            "home_stat1_value", "home_stat2_value", "home_stat3_value", "home_stat4_value", "home_stat5_value",
          ],
        },
      },
      select: { key: true, value: true },
    }).catch(() => [] as { key: string; value: string }[]),
  ]);

  const smap = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]));
  const heroStatValues = [
    smap["hero_stat1_value"] ?? "150+",
    smap["hero_stat2_value"] ?? "80+",
    smap["hero_stat3_value"] ?? "5+",
    smap["hero_stat4_value"] ?? "15+",
  ];
  const homeStatValues = [
    smap["home_stat1_value"] ?? "150+",
    smap["home_stat2_value"] ?? "80+",
    smap["home_stat3_value"] ?? "5+",
    smap["home_stat4_value"] ?? "15+",
    smap["home_stat5_value"] ?? "97%",
  ];

  return (
    <>
      <HeroSection statValues={heroStatValues} />
      <ServicesSection />
      <ProcessSection />
      <WhyUsSection />
      <StatsSection statValues={homeStatValues} />
      <PortfolioSection projects={projects} locale={locale} />
      <TestimonialsSection testimonials={testimonials} locale={locale} />
      <BlogSection posts={blogPosts} locale={locale} />
      <CtaSection />

      {/* Intégrations Chariow */}
      <PromoPopup />
      <ProofNotifications />
    </>
  );
}
