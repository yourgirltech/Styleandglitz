import PolicyLayout from "@/components/PolicyLayout";
import { DISCLAIMER_TEXT } from "@/components/DisclaimerModal";

export default function Terms() {
  return (
    <PolicyLayout eyebrow="Style & Glitz" title="Terms & Conditions">
      <p>By using this site or placing an order, you agree to the terms below.</p>

      <h2>Authenticity</h2>
      <p>{DISCLAIMER_TEXT}</p>

      <h2>Orders &amp; payment</h2>
      <p>
        Prices are listed in Naira (₦) and are subject to change without notice. Checkout
        requires a signed-in account with a shipping address saved under{" "}
        <a href="/account">My Account</a>, and payment is processed securely through Paystack.
        An order is confirmed once payment succeeds.
      </p>

      <h2>Shipping &amp; returns</h2>
      <p>
        Delivery timelines and our returns, refunds, and exchange terms are set out in full on
        our <a href="/shipping">Shipping</a> and <a href="/returns">Returns &amp; Refunds</a>{" "}
        pages, which form part of these Terms.
      </p>

      <h2>Accounts</h2>
      <p>
        You're responsible for keeping your account credentials secure and for the accuracy of
        the shipping and contact details you provide.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We work to describe every piece accurately, but we don't guarantee the site will be
        error-free or uninterrupted, and we're not liable for delays or issues caused by
        circumstances outside our control (e.g. courier delays).
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us on{" "}
        <a href="https://wa.me/2349036423694" target="_blank" rel="noreferrer">WhatsApp</a>,{" "}
        <a href="https://instagram.com/styleandglitzz" target="_blank" rel="noreferrer">Instagram</a>,
        {" "}or <a href="mailto:styleandglitz@gmail.com">email</a>.
      </p>
    </PolicyLayout>
  );
}
