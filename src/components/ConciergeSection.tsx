export default function ConciergeSection() {
  return (
    <section id="concierge" className="py-28 px-6 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <p className="eyebrow text-gold mb-6">Need Help Choosing?</p>
        <h2 className="font-heading text-4xl md:text-5xl text-forest mb-6">
          Personal Shopping Concierge
        </h2>
        <p className="text-graphite/60 max-w-xl mx-auto mb-14 leading-relaxed">
          Speak with a stylist, not a support ticket. Our concierge team responds within one hour
          to help with sizing, custom builds, and gifting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ConciergeChannel label="WhatsApp" detail="Fastest response" href="https://wa.me/2349036423694" />
          <ConciergeChannel label="Instagram DM" detail="@styleandglitzz" href="https://instagram.com/styleandglitzz" />
          <ConciergeChannel label="Email" detail="styleandglitz@gmail.com" href="mailto:styleandglitz@gmail.com" />
        </div>

        <p className="eyebrow text-graphite/40 mt-10">Expected response within one hour</p>
      </div>
    </section>
  );
}

function ConciergeChannel({ label, detail, href }: { label: string; detail: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group border border-stone-dark px-6 py-10 hover:border-forest transition-colors duration-700 ease-luxury">
      <p className="font-heading text-2xl text-forest mb-2 group-hover:text-gold transition-colors duration-500">
        {label}
      </p>
      <p className="text-xs text-graphite/50">{detail}</p>
    </a>
  );
}