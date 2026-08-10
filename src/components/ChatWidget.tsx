import { useEffect, useRef } from "react";
import { createChat } from "@n8n/chat";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import "@n8n/chat/style.css";
import "./ChatWidget.css";

export default function ChatWidget() {
  const initialized = useRef(false);
  const { session, loading } = useCustomerAuth();

  useEffect(() => {
    // Wait for auth to resolve so the chat isn't created with a stale
    // "logged out" snapshot for a customer who's actually signed in.
    if (loading) return;

    const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn(
        "ChatWidget: VITE_N8N_CHAT_WEBHOOK_URL is not set — chat widget will not mount."
      );
      return;
    }

    if (!initialized.current) {
      initialized.current = true;
      createChat({
        webhookUrl,
        mode: "window",
        showWelcomeScreen: true,
        showWindowCloseButton: true,
        // The n8n workflow uses accessToken as the real Supabase bearer
        // token when looking up orders/profile, so Postgres RLS enforces
        // the customer can only ever see their own data — never a value
        // the AI or the customer's own message can override.
        metadata: {
          customerId: session?.user?.id ?? null,
          accessToken: session?.access_token ?? null,
        },
        initialMessages: [
          "Welcome to Style & Glitz — ask me about our watches or moissanite pieces.",
        ],
        i18n: {
          en: {
            title: "Style & Glitz Assistant",
            subtitle: "Ask about our watches & moissanite jewelry",
            inputPlaceholder: "Ask about a product...",
            footer: "",
            getStarted: "New Conversation",
            closeButtonTooltip: "Close",
          },
        },
      });
    }

    // @n8n/chat's header close button only emits an event nothing listens
    // for — it's a no-op in the current version. The launcher bubble's own
    // click handler is what actually toggles the window, so forward clicks
    // on the header close button to it. Attached outside the `initialized`
    // guard so it re-attaches after React StrictMode's mount/cleanup/remount
    // cycle in dev (which would otherwise strip it on the second pass).
    const handleCloseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("#n8n-chat .chat-close-button")) {
        document.querySelector<HTMLElement>("#n8n-chat .chat-window-toggle")?.click();
      }
    };
    document.body.addEventListener("click", handleCloseClick);

    return () => {
      document.body.removeEventListener("click", handleCloseClick);
    };
  }, [loading]);

  return null;
}
