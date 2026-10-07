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
    <div ref={root} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => {
        const hasSale = p.sale < p.price;
        const off = Math.round(((p.price - p.sale) / p.price) * 100);
        return (
          <div key={p.slug} data-reveal className="flex">
          <a
            href={productUrl(p.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-light glass-hover rounded-2xl overflow-hidden flex flex-col w-full"
          >
            {/* Visuel */}
            <div className="relative h-44 overflow-hidden bg-navy/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-navy/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {p.category}
                </span>
                {p.popular && (
                  <span className="flex items-center gap-1 bg-gold text-navy text-[11px] font-bold px-2.5 py-1 rounded-full">
                    <Star size={11} className="fill-navy" /> {t("popular")}
                  </span>
                )}
              </div>
              {hasSale && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  -{off}%
                </span>
              )}
            </div>

            {/* Contenu */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-heading font-bold text-navy text-base leading-snug mb-4 line-clamp-2 group-hover:text-sky transition-colors">
                {p.name}
              </h3>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-navy">${p.sale}</span>
                  {hasSale && <span className="text-sm text-gray-400 line-through">${p.price}</span>}
                </div>
                <span className="flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-xl group-hover:bg-sky transition-colors">
                  {t("buy")}
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
