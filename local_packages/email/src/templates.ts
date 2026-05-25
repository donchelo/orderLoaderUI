/** Wrap content in a branded Tamaprint email shell */
export function tamaEmailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #F1F5F9; color: #0F172A; }
    .wrapper { max-width: 640px; margin: 32px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .header { background: #171717; padding: 20px 32px; }
    .header span { color: #00ADEF; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
    .body { padding: 28px 32px; }
    .footer { padding: 16px 32px; background: #F8FAFC; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #F8FAFC; text-align: left; padding: 8px 12px; font-size: 12px; color: #64748B; border-bottom: 1px solid #E2E8F0; }
    td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #F1F5F9; }
    tr:last-child td { border-bottom: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><span>Tamaprint</span></div>
    <div class="body">${body}</div>
    <div class="footer">Tamaprint S.A. de C.V. — correo automático generado por el sistema</div>
  </div>
</body>
</html>`
}

/** Format a number as MXN currency */
export function formatMXN(amount: number): string {
  return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
}

/** Simple key-value summary table */
export function summaryTable(rows: Array<[string, string | number]>): string {
  const trs = rows
    .map(([label, value]) => `<tr><td style="color:#64748B;width:40%">${label}</td><td><strong>${value}</strong></td></tr>`)
    .join("")
  return `<table>${trs}</table>`
}
