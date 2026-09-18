// Utility to generate and download a clean, high-fashion HADAB PDF invoice / bill
export interface OrderInvoiceData {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: string;
  destinationArabic?: string;
  address?: string;
  notes?: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  shippingFee?: number;
  status: string;
  paymentStatus?: string;
  items: Array<{
    name?: string;
    product?: { name?: string; image?: string; price?: number; category?: string };
    price?: number;
    quantity?: number;
    image?: string;
  }>;
}

export const downloadOrderInvoicePdf = (
  order: OrderInvoiceData,
  currencyCode: string = 'KD',
  storePhone: string = '+965 9900 0000',
  storeEmail: string = 'Byhadab@gmail.com'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download or print the PDF invoice.');
    return;
  }

  const itemsHtml = order.items
    .map((item, idx) => {
      const name = item.name || item.product?.name || 'Handmade Crochet Piece';
      const price = Number(item.price ?? item.product?.price ?? 0);
      const qty = Number(item.quantity || 1);
      const rowTotal = (price * qty).toFixed(2);

      return `
        <tr style="border-bottom: 1px solid #F0E9DF;">
          <td style="padding: 12px 16px; color: #8A7A6D; font-size: 13px;">${idx + 1}</td>
          <td style="padding: 12px 16px; font-weight: 600; color: #2D2421; font-size: 14px;">
            ${name}
          </td>
          <td style="padding: 12px 16px; text-align: center; color: #5C4A3E; font-size: 13px;">${qty}</td>
          <td style="padding: 12px 16px; text-align: right; color: #5C4A3E; font-size: 13px;">${price.toFixed(2)} ${currencyCode}</td>
          <td style="padding: 12px 16px; text-align: right; font-weight: 700; color: #2D2421; font-size: 14px;">${rowTotal} ${currencyCode}</td>
        </tr>
      `;
    })
    .join('');

  const itemsSubtotal = order.items.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const qty = Number(item.quantity || 1);
    return sum + (price * qty);
  }, 0);

  const rawDelivery = typeof order.deliveryFee === 'number'
    ? order.deliveryFee
    : typeof order.shippingFee === 'number'
    ? order.shippingFee
    : Number(order.total) - itemsSubtotal;
  const deliveryFee = Math.max(0, Number(rawDelivery || 0));

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <title>Invoice - ${order.orderNumber} - HADAB</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #FAF7F2;
            color: #2D2421;
            padding: 40px 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .invoice-card {
            max-width: 800px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 1px solid #EADDCF;
            border-radius: 20px;
            padding: 48px;
            box-shadow: 0 10px 30px rgba(92, 74, 62, 0.05);
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #F3EAE0;
            padding-bottom: 32px;
            margin-bottom: 32px;
          }

          .brand-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #2D2421;
            text-transform: uppercase;
          }

          .brand-tagline {
            font-size: 12px;
            color: #8A7A6D;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-top: 4px;
          }

          .invoice-meta {
            text-align: right;
          }

          .invoice-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 26px;
            color: #5C4A3E;
            font-weight: 600;
          }

          .order-number {
            font-family: monospace;
            font-size: 14px;
            font-weight: 700;
            color: #8A7A6D;
            margin-top: 4px;
          }

          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 8px;
          }

          .badge-paid {
            background: #ECFDF5;
            color: #065F46;
            border: 1px solid #A7F3D0;
          }

          .badge-unpaid {
            background: #FFFBEB;
            color: #92400E;
            border: 1px solid #FDE68A;
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 36px;
          }

          .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #8A7A6D;
            margin-bottom: 12px;
          }

          .info-block {
            background: #FCFAF8;
            border: 1px solid #F0E7DE;
            border-radius: 12px;
            padding: 16px 20px;
            font-size: 13px;
            line-height: 1.6;
          }

          .info-row {
            display: flex;
            margin-bottom: 6px;
          }

          .info-row:last-child {
            margin-bottom: 0;
          }

          .info-label {
            width: 100px;
            color: #8A7A6D;
            flex-shrink: 0;
          }

          .info-value {
            font-weight: 600;
            color: #2D2421;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }

          .table th {
            background: #FAF7F2;
            padding: 12px 16px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5C4A3E;
            font-weight: 700;
            border-top: 1px solid #EADDCF;
            border-bottom: 1px solid #EADDCF;
          }

          .totals-wrap {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 36px;
          }

          .totals-table {
            width: 320px;
            font-size: 14px;
          }

          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #5C4A3E;
          }

          .totals-grand {
            border-top: 2px solid #2D2421;
            padding-top: 12px;
            margin-top: 8px;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 20px;
            font-weight: 700;
            color: #2D2421;
          }

          .footer {
            border-top: 1px solid #F0E7DE;
            padding-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #8A7A6D;
            line-height: 1.6;
          }

          @media print {
            body {
              background-color: #FFFFFF;
              padding: 0;
            }
            .invoice-card {
              border: none;
              box-shadow: none;
              padding: 24px;
            }
            .no-print {
              display: none !important;
            }
          }

          .action-bar {
            max-width: 800px;
            margin: 0 auto 20px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .btn {
            background: #2D2421;
            color: #FFFFFF;
            border: none;
            padding: 10px 24px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(45, 36, 33, 0.15);
          }

          .btn:hover {
            background: #423430;
          }
        </style>
      </head>
      <body>
        <div class="action-bar no-print">
          <button class="btn" onclick="window.print()">
            🖨️ Print or Save as PDF
          </button>
        </div>

        <div class="invoice-card">
          <!-- Header -->
          <div class="header">
            <div>
              <div class="brand-title">HADAB</div>
              <div class="brand-tagline">Artisanal Handmade Crochet · صُنع بحب</div>
            </div>
            <div class="invoice-meta">
              <div class="invoice-title">OFFICIAL INVOICE</div>
              <div class="order-number">ORDER #${order.orderNumber}</div>
              <div style="font-size: 12px; color: #8A7A6D; margin-top: 4px;">
                Date: ${order.createdAt}
              </div>
              <div class="badge ${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
                ${order.paymentStatus === 'paid' ? 'PAID / تم الدفع' : 'PENDING PAYMENT'}
              </div>
            </div>
          </div>

          <!-- Customer & Order Information -->
          <div class="details-grid">
            <div>
              <div class="section-title">Billed To / Customer Information</div>
              <div class="info-block">
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${order.customerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${order.customerPhone || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${order.customerEmail || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Destination:</span>
                  <span class="info-value">${order.destination || 'Kuwait'}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="section-title">Delivery Address & Notes</div>
              <div class="info-block">
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  <span class="info-value" style="word-break: break-word;">
                    ${order.address || 'Full address details not provided'}
                  </span>
                </div>
                ${
                  order.notes
                    ? `
                  <div class="info-row" style="margin-top: 8px;">
                    <span class="info-label">Notes:</span>
                    <span class="info-value" style="font-style: italic; color: #5C4A3E;">
                      ${order.notes}
                    </span>
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="section-title">Order Items</div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: left;">#</th>
                <th style="text-align: left;">Item Description</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                <th style="width: 130px; text-align: right;">Unit Price</th>
                <th style="width: 140px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals-wrap">
            <div class="totals-table">
              <div class="totals-row">
                <span style="color: #8A7A6D;">Items Subtotal:</span>
                <span style="font-weight: 600; color: #2D2421;">${itemsSubtotal.toFixed(2)} ${currencyCode}</span>
              </div>
              <div class="totals-row">
                <span style="color: #8A7A6D;">Delivery Fee${order.destination ? ` (${order.destination})` : ''}:</span>
                <span style="font-weight: 600; color: ${deliveryFee > 0 ? '#2D2421' : '#065F46'};">
                  ${deliveryFee > 0 ? `${deliveryFee.toFixed(2)} ${currencyCode}` : 'FREE / مجاني'}
                </span>
              </div>
              <div class="totals-row totals-grand">
                <span>Total Amount:</span>
                <span>${Number(order.total).toFixed(2)} ${currencyCode}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: 600; color: #2D2421; margin-bottom: 4px;">
              Thank you for supporting authentic artisanal crochet craft.
            </p>
            <p>
              HADAB Atelier · WhatsApp: ${storePhone} · Email: ${storeEmail}
            </p>
          </div>
        </div>

        <script>
          // Automatically prompt print dialog after page renders
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
