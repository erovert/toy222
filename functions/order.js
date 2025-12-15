export async function onRequestPost({ request }) {
  try {
    const order = await request.json();

    // 🔍 For now, log the order (visible in Cloudflare logs)
    console.log("🛒 NEW ORDER RECEIVED:", order);

    // Later you can:
    // - save to database (D1)
    // - send email
    // - forward to WhatsApp / Telegram

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    );
  }
}
