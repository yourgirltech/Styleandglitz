import PolicyLayout from "@/components/PolicyLayout";

export default function Privacy() {
  return (
    <PolicyLayout eyebrow="Style & Glitz" title="Privacy Policy">
      <p>
        This policy explains what information Style & Glitz collects when you shop with us,
        and how it's used.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details you provide: name, email, phone number, and shipping address.</li>
        <li>Order information: items purchased, order status, and payment confirmation.</li>
        <li>
          Messages you send our shopping assistant, to help answer questions about products,
          orders, and policies.
        </li>
        <li>Your email address, if you subscribe to our newsletter.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To create and manage your account, and to process and deliver your orders.</li>
        <li>To answer questions about your own orders when you're signed in.</li>
        <li>To send newsletter updates, only if you've opted in.</li>
        <li>To keep the site secure and prevent fraud.</li>
      </ul>
      <h2>Payments</h2>
      <p>
        Payments are processed securely by Paystack. We do not store your card details — that
        information is handled entirely by Paystack's own secure systems.
      </p>
      <h2>Who can see your data</h2>
      <p>
        Your account and order data is private to you. Our shopping assistant can only look up
        order, profile, or item information for the customer who is currently signed in and
        asking — never another customer's data.
      </p>
      <h2>Your choices</h2>
      <p>
        You can update your account details at any time under{" "}
        <a href="/account">My Account</a>, and unsubscribe from the newsletter using the link in
        any newsletter email. To request that we delete your account data, contact us using the
        details below.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us on{" "}
        <a href="https://wa.me/2349036423694" target="_blank" rel="noreferrer">WhatsApp</a>,{" "}
        <a href="https://instagram.com/styleandglitzz" target="_blank" rel="noreferrer">Instagram</a>,
        {" "}or <a href="mailto:styleandglitz@gmail.com">email</a>.
      </p>
    </PolicyLayout>
  );
}
