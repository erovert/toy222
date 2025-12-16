export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const {
      product_title,
      product_price,
      product_url,
      product_image,
      customer_name,
      mobile,
      whatsapp,
      address,
      city,
      order_notes,
      page,
      created_at
    } = data;

    // Basic server-side validation
    if (!product_title || !mobile || !address) {
      return new Response("Invalid order data", { status: 400 });
    }

    await env.DB.prepare(`
      INSERT INTO orders (
        product_title,
        product_price,
        product_url,
        product_image,
        customer_name,
        mobile,
        whatsapp,
        address,
        city,
        order_notes,
        page,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product_title,
      product_price,
      product_url,
      product_image,
      customer_name,
      mobile,
      whatsapp,
      address,
      city,
      order_notes,
      page,
      created_at
    ).run();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("ORDER ERROR:", err);
    return new Response("Server error", { status: 500 });
  }
}
