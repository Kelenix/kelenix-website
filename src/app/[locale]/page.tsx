import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ProofStrip from "@/components/home/ProofStrip";
import PainSection from "@/components/home/PainSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import FaqSection from "@/components/home/FaqSection";
import CtaSection from "@/components/home/CtaSection";
import PromoPopup from "@/components/home/PromoPopup";
import { prisma } from "@/lib/prisma";
import { setRequestLocale } from "next-intl/server";
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
  setRequestLocale(locale);

  // Base injoignable : chaque requête renvoie null, et la section concernée se masque.
  const offline = () => null;

  const [dbProjects, dbTestimonials, dbPosts, stats, dbServices, dbFaqs] = await Promise.all([
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
    }).catch(offline),
    prisma.testimonial.findMany({
      where: { published: true, showOnHome: true },
      orderBy: { createdAt: "desc" },
    }).catch(offline),
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
    }).catch(offline),
    getSiteStats(),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { slug: true, titleFr: true, titleEn: true, shortDescFr: true, shortDescEn: true, icon: true },
    }).catch(offline),
    prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 5,
      select: { questionFr: true, questionEn: true, answerFr: true, answerEn: true },
    }).catch(offline),
  ]);

  // En développement sans base de données : contenu d'exemple, pour voir toutes les sections en local.
  const dbDown = [dbProjects, dbTestimonials, dbPosts, dbServices, dbFaqs].some((rows) => rows === null);
  const preview = dbDown && process.env.NODE_ENV === "development" ? await import("@/data/home-preview") : null;

  const projects = dbProjects ?? (preview?.previewProjects as NonNullable<typeof dbProjects> | undefined) ?? [];
  const testimonials = dbTestimonials ?? (preview?.previewTestimonials as unknown as NonNullable<typeof dbTestimonials> | undefined) ?? [];
  const blogPosts = dbPosts ?? (preview?.previewPosts as unknown as NonNullable<typeof dbPosts> | undefined) ?? [];
  const homeServices = dbServices ?? preview?.previewServices ?? [];
  const faqs = dbFaqs ?? preview?.previewFaqs ?? [];

  const faqItems = faqs.map((f) => (locale === "en" ? { q: f.questionEn, a: f.answerEn } : { q: f.questionFr, a: f.answerFr }));

  return (
    <>
      <HeroSection />
      <ProofStrip stats={stats} />
      <PainSection />
      <ServicesSection services={homeServices} locale={locale} />
      <ProcessSection />
      <WhyUsSection rating={stats.rating} />
      <PortfolioSection projects={projects} locale={locale} />
      <TestimonialsSection testimonials={testimonials} locale={locale} rating={stats.rating} />
      <BlogSection posts={blogPosts} locale={locale} />
      <FaqSection items={faqItems} />
      <CtaSection />

      {/* Intégration Chariow */}
      <PromoPopup />
    </>
  );
}
