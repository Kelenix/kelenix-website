import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ProcessSection from "@/components/home/ProcessSection";
import ShopSection from "@/components/home/ShopSection";
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
    title: isEn
      ? "Kelenix - Technology & Digital Transformation"
      : "Kelenix - Technologie & Transformation Numérique",
    description: isEn
      ? "Custom software development, AI solutions, web & mobile applications. Kelenix - your digital transformation partner."
      : "Développement logiciel sur mesure, solutions IA, applications web & mobile. Kelenix - votre partenaire en transformation numérique.",
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [projects, testimonials, blogPosts] = await Promise.all([
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
  ]);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <ShopSection />
      <WhyUsSection />
      <StatsSection />
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
