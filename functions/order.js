async function sendOrderEmail(order, env) {
  const html = `
    <div style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px">
      <div style="max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px">
        
        <h2 style="color:#111">🛒 New Order Received</h2>
        <hr/>

        <p><strong>Product:</strong> ${order.product_title}</p>
        <p><strong>Price:</strong> ${order.product_price}</p>

        <img src="${order.product_image}" width="200" style="margin:10px 0"/>

        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${order.customer_name}</p>
        <p><strong>Mobile:</strong> ${order.mobile}</p>
        <p><strong>WhatsApp:</strong> ${order.whatsapp}</p>
        <p><strong>City:</strong> ${order.city}</p>
        <p><strong>Address:</strong> ${order.address}</p>

        ${order.order_notes ? `
        <h3>Order Notes</h3>
        <p>${order.order_notes}</p>
        ` : ""}

        <hr/>
        <p style="font-size:12px;color:#777">
          Order page: <a href="${order.page}">${order.page}</a>
        </p>

      </div>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "ToyWaly Orders <orders@toywaly.com>",
      to: [env.ADMIN_EMAIL],
      subject: "🛒 New Order — ToyWaly",
      html
    })
  });
}




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


    await sendOrderEmail({
      product_title,
      product_price,
      product_image,
      customer_name,
      mobile,
      whatsapp,
      city,
      address,
      order_notes,
      page
    }, env);


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
