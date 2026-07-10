export interface InstagramMedia {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// Add to .env.local:
// VITE_IG_USER_ID=your-business-account-id
// VITE_IG_ACCESS_TOKEN=your-long-lived-token
const IG_USER_ID = import.meta.env.VITE_IG_USER_ID as string | undefined;
const IG_ACCESS_TOKEN = import.meta.env.VITE_IG_ACCESS_TOKEN as string | undefined;

export async function fetchRecentInstagramMedia(limit = 8): Promise<InstagramMedia[]> {
  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    // Not configured yet — caller should fall back to the product-based placeholder grid.
    return [];
  }

  const url = `https://graph.instagram.com/${IG_USER_ID}/media?fields=id,caption,media_url,permalink,media_type&limit=${limit}&access_token=${IG_ACCESS_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram Graph API error: ${res.status}`);
  const data = await res.json();
  return data.data as InstagramMedia[];
}
