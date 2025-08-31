import axios from "axios";

interface StripeRedirectResponse {
  data: string;
}

export async function redirectToStripe(
  orgId: string,
  token: string
): Promise<void> {
  const res = await axios.post<StripeRedirectResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/stripe/redirect`,
    { orgId },
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );

  const url = res.data.data;
  if (!url) throw new Error("No Stripe URL returned");
  window.location.href = url;
}
