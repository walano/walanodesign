"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_OPTIONS = ["covers", "videos", "affiches", "branding", "miniatures", "banners"] as const;

export default function Estimate() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (key: string) => {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will hook to Django backend later
    setSubmitted(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(innerRef.current, {
        scrollTrigger: { trigger: innerRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="estimate"
      ref={sectionRef}
      className="relative w-full py-32 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 80%, rgba(183,153,200,0.08) 0%, transparent 70%)",
        }}
      />

      <div ref={innerRef} className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex-1 h-px bg-[#b799c8]/15" />
          <h2
            className="text-[clamp(2.5rem,5vw,4.5rem)] text-[#f5f3f7] whitespace-nowrap"
            style={{ fontFamily: "austin-pen, cursive" }}
          >
            {t("estimate.title")}
          </h2>
          <div className="flex-1 h-px bg-[#b799c8]/15" />
        </div>

        <p
          className="text-center text-[#f5f3f7]/45 text-sm mb-12"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {t("estimate.sub")}
        </p>

        {submitted ? (
          <div className="text-center py-16 flex flex-col gap-4 items-center">
            <span className="text-4xl text-[#b799c8]" aria-label="check">◈</span>
            <p
              className="text-[#f5f3f7]/70"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {t("lang") === "fr"
                ? "Message envoyé — je te reviens bientôt !"
                : "Message sent — I'll get back to you soon!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "name", type: "text",  key: "estimate.name" },
                { id: "email", type: "email", key: "estimate.email" },
              ].map(({ id, type, key }) => (
                <div key={id} className="flex flex-col gap-2">
                  <label
                    htmlFor={id}
                    className="text-xs lowercase text-[#f5f3f7]/40"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t(key)}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required
                    className="text-[#f5f3f7] text-sm px-4 py-3 outline-none transition-all duration-300 placeholder:text-[#f5f3f7]/20"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: "1px solid rgba(183, 153, 200, 0.2)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.55)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.2)";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Service selector */}
            <div className="flex flex-col gap-3">
              <label
                className="text-xs lowercase text-[#f5f3f7]/40"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t("estimate.services_label")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleService(key)}
                    className="text-xs lowercase transition-all duration-300"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      padding: "0.5rem 1rem",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      ...(selectedServices.includes(key)
                        ? {
                            backgroundColor: "rgba(183, 153, 200, 0.5)",
                            border: "1px solid rgba(183, 153, 200, 0.8)",
                            color: "#f5f3f7",
                          }
                        : {
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(183, 153, 200, 0.2)",
                            color: "rgba(245,243,247,0.5)",
                          }),
                    }}
                  >
                    {t(`services.${key}.label`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-xs lowercase text-[#f5f3f7]/40"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t("estimate.message")}
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="text-[#f5f3f7] text-sm px-4 py-3 outline-none transition-all duration-300 resize-none placeholder:text-[#f5f3f7]/20"
                style={{
                  fontFamily: "Inter, sans-serif",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(183, 153, 200, 0.2)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.55)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.2)";
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="self-end text-xs lowercase transition-all duration-300"
              style={{
                fontFamily: "Inter, sans-serif",
                padding: "0.75rem 2rem",
                backgroundColor: "rgba(183, 153, 200, 0.15)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(183, 153, 200, 0.4)",
                color: "#b799c8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(183, 153, 200, 0.3)";
                e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(183, 153, 200, 0.15)";
                e.currentTarget.style.borderColor = "rgba(183, 153, 200, 0.4)";
              }}
            >
              {t("estimate.submit")} →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
