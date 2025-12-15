export async function onRequestPost({ request, env }) {
  try {
    const order = await request.json();

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
        page,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      order.product_title,
      order.product_price,
      order.product_url,
      order.product_image,
      order.name || "",
      order.mobile,
      order.whatsapp,
      order.address,
      order.city,
      order.page,
      order.created_at
    ).run();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    console.error("ORDER SAVE ERROR:", err);

    return new Response(
      JSON.stringify({ success: false }),
      { status: 500 }
    );
  }
}
