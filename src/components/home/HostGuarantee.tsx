"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Clock, DollarSign, ArrowRight, Sparkles } from "lucide-react";

const guarantees = [
  {
    title: "$1,000,000 Host Protection",
    description: "Every booking is backed by comprehensive property damage and equipment liability protection.",
    icon: ShieldCheck,
  },
  {
    title: "Double-Booking Protection",
    description: "Automated schedule validation guarantees that your confirmed slot will never experience double-bookings.",
    icon: Clock,
  },
  {
    title: "Transparent Hourly Rates",
    description: "No hidden utility surcharges, no surprise cleanup markups. What you see is what you pay.",
    icon: DollarSign,
  },
  {
    title: "Curated & Verified Hosts",
    description: "Every studio undergoes rigorous gear audits and acoustic testing before joining the marketplace.",
    icon: Award,
  },
];

export function HostGuarantee() {
  return (
    <section className="py-24 bg-charcoal text-ivory relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 shadow-cinematic">
          {/* Top Header */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest/40 border border-forest/60 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>StudioSpace Host Guarantee</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              The Gold Standard in Creative Studio Bookings
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              We eliminate the friction and uncertainty of independent studio rentals with enterprise protection for both creators and hosts.
            </p>
          </div>

          {/* Guarantee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {guarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-brand/20 border border-orange-brand/40 text-orange-brand flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 text-center sm:text-left">
              Have a daylight studio or recording room? Join 1,200+ verified hosts.
            </div>
            <Link
              href="/studio/add"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105"
            >
              <span>List Your Studio Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
