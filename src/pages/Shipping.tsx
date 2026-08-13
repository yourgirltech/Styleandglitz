import PolicyLayout from "@/components/PolicyLayout";

export default function Shipping() {
  return (
    <PolicyLayout eyebrow="Style & Glitz" title="Shipping">
      <p>
        Every order is packaged and dispatched with care. Delivery windows depend on where
        you're located:
      </p>
      <ul>
        <li><strong className="text-forest">Lagos:</strong> same-day delivery.</li>
        <li><strong className="text-forest">Rest of Nigeria:</strong> 3–7 business working days.</li>
        <li><strong className="text-forest">International:</strong> 10–15 working days.</li>
      </ul>
      <p>
        Occasionally a delivery may run up to 3 extra days past its scheduled window — this is
        uncommon, but we'd rather set that expectation upfront than have it catch you by
        surprise.
      </p>
      <h2>Tracking &amp; questions</h2>
      <p>
        Signed-in customers can check order status any time under{" "}
        <a href="/account">My Account</a>, or ask our assistant directly on the site. For
        anything else, our concierge team is reachable on{" "}
        <a href="https://wa.me/2349036423694" target="_blank" rel="noreferrer">WhatsApp</a>,{" "}
        <a href="https://instagram.com/styleandglitzz" target="_blank" rel="noreferrer">Instagram</a>,
        {" "}or <a href="mailto:styleandglitz@gmail.com">email</a>.
      </p>
    </PolicyLayout>
  );
}
