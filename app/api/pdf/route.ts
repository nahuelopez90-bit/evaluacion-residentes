export const runtime = "nodejs";

import { PDFDocument, StandardFonts, rgb, PDFPage } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      resident,
      evaluator,
      origin,
      resYear,
      date,
      total,
      avg,
      scores = {},
      comments = {},
      competencies = [],
    } = body;

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const blue = rgb(0.11, 0.30, 0.85);
    const black = rgb(0.07, 0.09, 0.12);
    const gray = rgb(0.45, 0.47, 0.50);
    const border = rgb(0.82, 0.84, 0.86);

    const A4: [number, number] = [595.28, 841.89];

    let page: PDFPage = pdf.addPage(A4);
    let { width, height } = page.getSize();
    let y = height - 48;

    const drawWrapped = (
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      size = 10,
      lineH = 12
    ) => {
      const words = (text || "").split(/\s+/);
      let lineText = "";
      let yy = startY;

      for (const w of words) {
        const test = lineText ? `${lineText} ${w}` : w;
        const wWidth = font.widthOfTextAtSize(test, size);
        if (wWidth > maxWidth) {
          page.drawText(lineText, { x, y: yy, size, font, color: black });
          yy -= lineH;
          lineText = w;
        } else {
          lineText = test;
        }
      }

      if (lineText) {
        page.drawText(lineText, { x, y: yy, size, font, color: black });
        yy -= lineH;
      }

      return yy;
    };

    const drawHeader = () => {
      page.drawText("Evaluación de Competencias — Residentes", {
        x: 48,
        y,
        size: 16,
        font: bold,
        color: blue,
      });

      y -= 24;

      // Caja datos generales
      const boxX = 48;
      const boxW = width - 96;
      const boxH = 92;

      page.drawRectangle({
        x: boxX,
        y: y - boxH,
        width: boxW,
        height: boxH,
        borderColor: border,
        borderWidth: 1,
      });

      const line = (label: string, value: string, xx: number, yy: number) => {
        page.drawText(label, { x: xx, y: yy, size: 10, font: bold, color: gray });
        page.drawText(value || "—", { x: xx + 120, y: yy, size: 11, font, color: black });
      };

      const topY = y - 22;

      line("Residente:", resident, 60, topY);
      line("Evaluador:", evaluator, 60, topY - 18);
      line("Hospital:", origin, 60, topY - 36);

      line("Año:", resYear, 330, topY);
      line("Fecha:", date, 330, topY - 18);

      y -= boxH + 16;

      // Resumen
      page.drawText("Resumen", { x: 48, y, size: 12, font: bold, color: blue });
      y -= 18;

      const avgText = avg !== undefined && avg !== null ? Number(avg).toFixed(2) : "—";
      const totalText = total !== undefined && total !== null ? String(total) : "—";

      page.drawText(`Total: ${totalText}     Promedio: ${avgText}     Escala: 1–9`, {
        x: 48,
        y,
        size: 11,
        font,
        color: black,
      });

      y -= 22;

      page.drawText("Competencias y subcompetencias", {
        x: 48,
        y,
        size: 12,
        font: bold,
        color: blue,
      });

      y -= 14;
    };

    const newPage = () => {
      page = pdf.addPage(A4);
      ({ width, height } = page.getSize());
      y = height - 48;
      drawHeader();
    };

    const ensureSpace = (minY: number) => {
      if (y < minY) newPage();
    };

    // primera página
    drawHeader();

    for (const comp of competencies) {
      ensureSpace(120);

      page.drawText(`${comp.id}) ${comp.title}`, {
        x: 48,
        y,
        size: 11,
        font: bold,
        color: blue,
      });

      y -= 14;

      for (const it of comp.items || []) {
        ensureSpace(120);

        const key = it.key;
        const score = scores?.[key] ?? "—";
        const comment = comments?.[key] ?? "";

        page.drawText(`${key} — ${it.title}  (Puntaje: ${score})`, {
          x: 56,
          y,
          size: 10,
          font: bold,
          color: black,
        });

        y -= 12;

        if (it.description) {
          page.drawText("Guía:", { x: 56, y, size: 9, font: bold, color: gray });
          y = drawWrapped(it.description, 92, y, 455, 9, 11);
        }

        if (comment) {
          page.drawText("Comentario:", { x: 56, y, size: 9, font: bold, color: gray });
          y = drawWrapped(comment, 120, y, 430, 9, 11);
        }

        y -= 8;
      }

      y -= 8;
    }

    const bytes = await pdf.save();

    // Uint8Array -> ArrayBuffer (compatible con Response BodyInit en build)
    const arrayBuffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    );

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="evaluacion-residente.pdf"',
      },
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "Error PDF" }, { status: 500 });
  }
}