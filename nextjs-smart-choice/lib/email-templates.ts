interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
    image?: string;
}

interface OrderDetails {
    orderId: string;
    customerName: string;
    phoneNumber: string;
    email?: string;
    address: string;
    totalAmount: number;
    items: OrderItem[];
    paymentReference: string;
    createdAt: Date;
}

/**
 * Generate admin notification email HTML template
 * Mongolian language template for new order notifications
 */
export function generateAdminOrderNotificationHTML(order: OrderDetails): string {
    const itemsHTML = order.items.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 8px;">
                <div style="font-weight: 500; color: #111827;">${item.productName}</div>
            </td>
            <td style="padding: 12px 8px; text-align: center; color: #6b7280;">${item.quantity}</td>
            <td style="padding: 12px 8px; text-align: right; color: #111827;">$${item.price}</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: 500; color: #111827;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="mn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Шинэ захиалга - Smart Choice</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #000000 0%, #1f2937 100%); padding: 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Шинэ захиалга ирлээ!</h1>
                            <p style="margin: 8px 0 0 0; color: #d1d5db; font-size: 14px;">Smart Choice - ${new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                        </td>
                    </tr>

                    <!-- Order Reference -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                            <div style="text-align: center;">
                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Захиалгын дугаар</p>
                                <p style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; font-family: monospace;">${order.paymentReference}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Customer Information -->
                    <tr>
                        <td style="padding: 24px 32px;">
                            <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">👤 Хэрэглэгчийн мэдээлэл</h2>
                            <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                    <td style="color: #6b7280; font-size: 14px; width: 120px;">Нэр:</td>
                                    <td style="color: #111827; font-size: 14px; font-weight: 500;">${order.customerName}</td>
                                </tr>
                                <tr>
                                    <td style="color: #6b7280; font-size: 14px;">Утас:</td>
                                    <td style="color: #111827; font-size: 14px; font-weight: 500;">${order.phoneNumber}</td>
                                </tr>
                                ${order.email ? `
                                <tr>
                                    <td style="color: #6b7280; font-size: 14px;">Имэйл:</td>
                                    <td style="color: #111827; font-size: 14px; font-weight: 500;">${order.email}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Хаяг:</td>
                                    <td style="color: #111827; font-size: 14px; font-weight: 500;">${order.address}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #f9fafb;">
                            <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #000000; padding-bottom: 8px;">🛒 Захиалсан бараа</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                                <thead>
                                    <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                                        <th style="padding: 12px 8px; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Бараа</th>
                                        <th style="padding: 12px 8px; text-align: center; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Тоо</th>
                                        <th style="padding: 12px 8px; text-align: right; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Үнэ</th>
                                        <th style="padding: 12px 8px; text-align: right; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">Нийт</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHTML}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Total Amount -->
                    <tr>
                        <td style="padding: 24px 32px;">
                            <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                    <td style="text-align: right; color: #6b7280; font-size: 16px; padding-right: 16px;">Нийт дүн:</td>
                                    <td style="text-align: right; color: #111827; font-size: 28px; font-weight: 700; width: 150px;">$${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Action Required -->
                    <tr>
                        <td style="padding: 24px 32px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-top: 2px dashed #f59e0b;">
                            <div style="text-align: center;">
                                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">⚠️ Анхаарна уу!</p>
                                <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
                                    Хэрэглэгчтэй холбогдож захиалгыг баталгаажуулна уу.<br>
                                    Төлбөр төлөгдсөний дараа хүргэлтийг зохион байгуулна уу.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 14px;">Smart Choice</p>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">Монгол улсын тэргүүлэгч электрон бараа борлуулалтын платформ</p>
                            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">© 2026 Smart Choice. Бүх эрх хуулиар хамгаалагдсан.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Generate plain text version of admin notification email
 */
export function generateAdminOrderNotificationText(order: OrderDetails): string {
    const itemsText = order.items.map(item =>
        `- ${item.productName} x${item.quantity} - $${item.price} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return `
🎉 ШИНЭ ЗАХИАЛГА ИРЛЭЭ!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Захиалгын дугаар: ${order.paymentReference}
Огноо: ${new Date(order.createdAt).toLocaleString('mn-MN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ХЭРЭГЛЭГЧИЙН МЭДЭЭЛЭЛ:

Нэр: ${order.customerName}
Утас: ${order.phoneNumber}
${order.email ? `Имэйл: ${order.email}` : ''}
Хаяг: ${order.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ЗАХИАЛСАН БАРАА:

${itemsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

НИЙТ ДҮН: $${order.totalAmount.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ АНХААРНА УУ!
Хэрэглэгчтэй холбогдож захиалгыг баталгаажуулна уу.
Төлбөр төлөгдсөний дараа хүргэлтийг зохион байгуулна уу.

--
Smart Choice
Монгол улсын тэргүүлэгч электрон бараа борлуулалтын платформ
    `.trim();
}
