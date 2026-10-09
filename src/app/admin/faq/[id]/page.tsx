export const dynamic = "force-dynamic";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/prisma";
import FaqForm from "../FaqForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditFaqPage({ params }: Props) {
  await requireAuth("MODERATOR");
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/faq" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-navy">
          <ChevronLeft size={16} /> Retour à la FAQ
        </Link>
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">Modifier la question</h1>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}
