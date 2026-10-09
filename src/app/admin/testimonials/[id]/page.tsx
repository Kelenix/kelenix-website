export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "../TestimonialForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/testimonials" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-navy">
          <ChevronLeft size={16} /> Retour aux témoignages
        </Link>
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">Modifier : {testimonial.name}</h1>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
        <TestimonialForm testimonial={{ ...testimonial, photo: testimonial.photo ?? "" }} />
      </div>
    </div>
  );
}
