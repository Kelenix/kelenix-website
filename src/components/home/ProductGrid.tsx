"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Star } from "lucide-react";
import { productUrl, type Product } from "@/data/chariow";
import { useReveal } from "@/lib/gsap";

export default function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations("shop");
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {products.map((p) => {
        const hasSale = p.sale < p.price;
        const off = Math.round(((p.price - p.sale) / p.price) * 100);
        return (
          <div key={p.slug} data-reveal className="flex">
            <a
              href={productUrl(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-colors hover:border-sky/60"
            >
              {/* Visuel */}
              <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-navy">{p.category}</span>
                  {p.popular && (
                    <span className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-navy">
                      <Star size={11} className="fill-navy" /> {t("popular")}
                    </span>
                  )}
                </div>
                {hasSale && <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">-{off}%</span>}
              </div>

              {/* Contenu */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="mb-5 line-clamp-2 text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-azure">{p.name}</h3>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-medium tracking-[-0.02em] tabular-nums text-navy">${p.sale}</span>
                    {hasSale && <span className="text-sm text-muted line-through">${p.price}</span>}
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-azure">
                    {t("buy")}
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
