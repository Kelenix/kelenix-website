import { requireAuth } from "@/lib/require-auth";
import AppForm from "../AppForm";

export default async function NewAppPage() {
  await requireAuth("MODERATOR");
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-[1.85rem] font-medium leading-[1.1] tracking-[-0.025em] text-navy sm:text-[2.25rem] mb-8">Nouvelle application</h1>
      <AppForm />
    </div>
  );
}
