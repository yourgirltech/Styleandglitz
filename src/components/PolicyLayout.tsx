import { type ReactNode } from "react";

export default function PolicyLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream px-6 md:px-10 pt-28 md:pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow text-gold mb-3">{eyebrow}</p>
        <h1 className="font-heading text-4xl md:text-5xl text-forest mb-4">{title}</h1>
        {updated && <p className="text-xs text-graphite/50 font-mono mb-10">Last updated {updated}</p>}
        <div className="hairline w-16 mb-10" />
        <div className="space-y-8 text-graphite/80 text-sm md:text-base leading-relaxed [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:text-forest [&_h2]:mb-3 [&_h2]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-gold-dark [&_a]:hover:text-forest">
          {children}
        </div>
      </div>
    </div>
  );
}
