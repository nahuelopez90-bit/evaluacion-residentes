import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Evaluaciones";
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

    if (!spreadsheetId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { ok: false, error: "Faltan variables en .env.local (SPREADSHEET_ID / EMAIL / PRIVATE_KEY)" },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 1 fila = 1 evaluación
    const row = [
      new Date().toISOString(),
      body.resident ?? "",
      body.evaluator ?? "",
      body.origin ?? "",
      body.resYear ?? "",
      body.date ?? "",
      body.total ?? "",
      body.avg ?? "",
      JSON.stringify(body.scores ?? {}),
      JSON.stringify(body.comments ?? {}),
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ ok: true, updatedRange: result.data.updates?.updatedRange });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Error guardando en Sheets" },
      { status: 500 }
    );
  }
}