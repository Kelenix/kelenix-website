import { requireAuth } from "@/lib/require-auth";
import BlogForm from "../BlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewBlogPostPage() {
  await requireAuth("MODERATOR");
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-navy">
          <ChevronLeft size={16} /> Retour au blog
        </Link>
        <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem]">Nouvel article</h1>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-8">
        <BlogForm />
      </div>
    </div>
  );
}
