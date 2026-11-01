"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, ShieldCheck, Film } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discover Architectural Spaces",
    description: "Browse curated daylight lofts, LED soundstages, and audio suites with authentic photography and verified dimensions.",
    icon: Search,
  },
  {
    step: "02",
    title: "Check Live Availability",
    description: "Select production dates and hourly time blocks with instantaneous real-time schedule conflict prevention.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Instant Protected Booking",
    description: "Confirm instantly with transparent pricing, zero hidden fees, and verified host communication channels.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Produce Without Compromise",
    description: "Arrive on set with studio gear staged, load-in ready, and full access to hair, makeup, and client hospitality suites.",
    icon: Film,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-brand">
            Apple-Inspired Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            How StudioSpace Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Booking professional production environments has never been this seamless, elegant, and predictable.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between hover:border-orange-brand/50 transition-all hover:shadow-cinematic group"
              >
                {/* Large Background Step Number */}
                <div className="font-display text-6xl font-black text-muted/30 absolute top-4 right-4 select-none group-hover:text-orange-brand/20 transition-colors">
                  {item.step}
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-orange-brand/10 border border-orange-brand/30 text-orange-brand flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-brand group-hover:text-white transition-all">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-orange-brand transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-mono uppercase tracking-wider">Step {item.step} of 04</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
