import PolicyLayout from "@/components/PolicyLayout";

export default function Returns() {
  return (
    <PolicyLayout eyebrow="Style & Glitz" title="Returns & Refunds">
      <h2>Returns</h2>
      <p>
        Items are not returnable unless the fault is ours. If a piece arrives damaged, wrong,
        or otherwise not as described, reach out to our concierge team and we'll make it right.
      </p>
      <h2>Refunds</h2>
      <p>
        We do not issue refunds except when we are unable to deliver what was ordered. Items
        that are delivered successfully and then mishandled by the customer are not eligible
        for any refund.
      </p>
      <h2>Exchanges</h2>
      <p>
        Exchanges are handled under their own separate terms and conditions, on a case-by-case
        basis. Message our concierge team with your order details and we'll walk you through
        what's possible.
      </p>
      <h2>Guarantee &amp; certification</h2>
      <ul>
        <li>Every wristwatch order comes with a 1-year guarantee.</li>
        <li>Every moissanite piece comes with the necessary GRA certification.</li>
        <li>
          Moissanite orders above ₦1,000,000 include a free diamond tester; below that, a
          tester can be purchased separately for ₦20,000.
        </li>
      </ul>
      <p>
        Questions about a specific order? Reach us on{" "}
        <a href="https://wa.me/2349036423694" target="_blank" rel="noreferrer">WhatsApp</a>,{" "}
        <a href="https://instagram.com/styleandglitzz" target="_blank" rel="noreferrer">Instagram</a>,
        {" "}or <a href="mailto:styleandglitz@gmail.com">email</a>.
      </p>
    </PolicyLayout>
  );
}
