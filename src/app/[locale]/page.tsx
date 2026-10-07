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
import PainSection from "@/components/home/PainSection";
import FaqSection from "@/components/home/FaqSection";
import { prisma } from "@/lib/prisma";
import { getSiteStats } from "@/lib/site-stats";

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

  const [projects, testimonials, blogPosts, stats, homeServices, faqs] = await Promise.all([
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
    getSiteStats(),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, titleFr: true, titleEn: true, shortDescFr: true, shortDescEn: true, icon: true },
    }).catch(() => []),
    prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 5,
      select: { questionFr: true, questionEn: true, answerFr: true, answerEn: true },
    }).catch(() => []),
  ]);
  const faqItems = faqs.map((f) => (locale === "en" ? { q: f.questionEn, a: f.answerEn } : { q: f.questionFr, a: f.answerFr }));

  const heroStatValues = [stats.projects, stats.clients, stats.years, stats.technologies];
  const homeStatValues = [stats.projects, stats.clients, stats.years, stats.technologies, stats.satisfaction];

  return (
    <>
      <HeroSection statValues={heroStatValues} />
      <PainSection />
      <ServicesSection services={homeServices} locale={locale} />
      <ProcessSection />
      <WhyUsSection />
      <StatsSection statValues={homeStatValues} />
      <PortfolioSection projects={projects} locale={locale} />
      <TestimonialsSection testimonials={testimonials} locale={locale} />
      <BlogSection posts={blogPosts} locale={locale} />
      <FaqSection items={faqItems} />
      <CtaSection />

      {/* Intégrations Chariow */}
      <PromoPopup />
      <ProofNotifications />
    </>
  );
}
