export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/admin/testimonials" className="flex items-center gap-1 text-gray-500 hover:text-navy text-sm mb-4">
              <ChevronLeft size={16} /> Retour aux témoignages
            </Link>
            <h1 className="font-heading text-2xl font-bold text-navy">Modifier : {testimonial.name}</h1>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-8">
            <TestimonialForm testimonial={{ ...testimonial, photo: testimonial.photo ?? "" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
