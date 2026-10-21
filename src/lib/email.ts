export async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn(
      "Email skipped: RESEND_API_KEY or EMAIL_FROM is not configured.",
    );
    return { sent: false };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!response.ok) {
      const details = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      console.error(
        `Email delivery failed with status ${response.status}: ${details?.message ?? "Unknown provider error"}`,
      );
    }
    return { sent: response.ok };
  } catch (error) {
    console.error("Email delivery failed.", error);
    return { sent: false };
  }
}
