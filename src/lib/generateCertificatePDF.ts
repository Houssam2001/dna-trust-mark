import { jsPDF } from "jspdf";

interface CertificateData {
  establishmentName: string;
  establishmentType: string;
  adnguardCode: string;
  address: string;
  city: string;
  certifiedSince?: string;
  validFrom: string;
  validUntil: string;
  qrCodeDataUrl: string;
}

export const generateCertificatePDF = (data: CertificateData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== PREMIUM BACKGROUND DESIGN =====
  
  // Main dark teal header with gradient effect (simulated with overlapping rectangles)
  doc.setFillColor(18, 45, 45); // Very dark teal base
  doc.rect(0, 0, pageWidth, 95, "F");
  
  // Gradient overlay effect
  doc.setFillColor(26, 61, 61);
  doc.rect(0, 0, pageWidth, 70, "F");
  
  // Decorative corner accents
  doc.setFillColor(213, 157, 83); // Gold
  doc.triangle(0, 0, 35, 0, 0, 35, "F");
  doc.triangle(pageWidth, 0, pageWidth - 35, 0, pageWidth, 35, "F");
  
  // Elegant gold accent bars
  doc.setFillColor(213, 157, 83);
  doc.rect(0, 88, pageWidth, 4, "F");
  
  // Thin white line accent
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(30, 85, pageWidth - 30, 85);

  // ===== HEADER CONTENT =====
  
  // Shield/Logo placeholder circle
  doc.setFillColor(213, 157, 83);
  doc.circle(pageWidth / 2, 28, 12, "F");
  doc.setFillColor(26, 61, 61);
  doc.circle(pageWidth / 2, 28, 9, "F");
  doc.setFillColor(213, 157, 83);
  doc.circle(pageWidth / 2, 28, 6, "F");

  // Main title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICAT", pageWidth / 2, 52, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("DE CONFORMITÉ ADNGUARD", pageWidth / 2, 62, { align: "center" });

  // Tagline with gold color
  doc.setTextColor(213, 157, 83);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Analyse ADN • Traçabilité • Authenticité Garantie", pageWidth / 2, 75, { align: "center" });

  // ===== MAIN CONTENT AREA =====
  
  // Subtle background for content area
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 92, pageWidth, pageHeight - 127, "F");

  // Establishment name with decorative underline
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(data.establishmentName, pageWidth / 2, 115, { align: "center" });
  
  // Decorative line under name
  const nameWidth = doc.getTextWidth(data.establishmentName);
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - nameWidth / 2 - 5, 119, pageWidth / 2 + nameWidth / 2 + 5, 119);

  // Type badge with pill shape
  const typeText = data.establishmentType.toUpperCase();
  const typeWidth = 50;
  doc.setFillColor(26, 61, 61);
  doc.roundedRect(pageWidth / 2 - typeWidth / 2, 125, typeWidth, 10, 5, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(typeText, pageWidth / 2, 131.5, { align: "center" });

  // Address
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.address}`, pageWidth / 2, 145, { align: "center" });
  doc.text(data.city, pageWidth / 2, 152, { align: "center" });

  // ===== CERTIFICATION DETAILS BOX =====
  
  // Details container with border
  const boxY = 165;
  const boxHeight = 50;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, boxY, pageWidth - 50, boxHeight, 4, 4, "S");
  
  // Divider lines inside box
  doc.setDrawColor(235, 235, 235);
  doc.line(pageWidth / 2, boxY + 5, pageWidth / 2, boxY + boxHeight - 5);

  // Left column - Code & Status
  const leftX = 45;
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CODE ADNGUARD", leftX, boxY + 12);
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.adnguardCode, leftX, boxY + 23);

  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("STATUT", leftX, boxY + 35);
  
  // Status badge
  doc.setFillColor(34, 139, 34);
  doc.roundedRect(leftX - 2, boxY + 37, 42, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("✓ CONFORME", leftX + 18, boxY + 42.5, { align: "center" });

  // Right column - Validity dates
  const rightX = pageWidth / 2 + 25;
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PÉRIODE DE VALIDITÉ", rightX, boxY + 12);
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Du ${data.validFrom}`, rightX, boxY + 23);
  doc.text(`Au ${data.validUntil}`, rightX, boxY + 32);

  if (data.certifiedSince) {
    doc.setTextColor(130, 130, 130);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFIÉ DEPUIS", rightX, boxY + 42);
    doc.setTextColor(26, 61, 61);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(data.certifiedSince, rightX + 38, boxY + 42);
  }

  // ===== QR CODE SECTION =====
  
  const qrY = 225;
  
  // QR Code decorative frame
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth / 2 - 38, qrY - 5, 76, 80, 4, 4, "F");
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(1.5);
  doc.roundedRect(pageWidth / 2 - 38, qrY - 5, 76, 80, 4, 4, "S");
  
  // Corner accents on QR frame
  doc.setFillColor(213, 157, 83);
  doc.rect(pageWidth / 2 - 38, qrY - 5, 12, 3, "F");
  doc.rect(pageWidth / 2 - 38, qrY - 5, 3, 12, "F");
  doc.rect(pageWidth / 2 + 26, qrY - 5, 12, 3, "F");
  doc.rect(pageWidth / 2 + 35, qrY - 5, 3, 12, "F");
  doc.rect(pageWidth / 2 - 38, qrY + 72, 12, 3, "F");
  doc.rect(pageWidth / 2 - 38, qrY + 63, 3, 12, "F");
  doc.rect(pageWidth / 2 + 26, qrY + 72, 12, 3, "F");
  doc.rect(pageWidth / 2 + 35, qrY + 63, 3, 12, "F");

  // Add QR code image
  try {
    doc.addImage(data.qrCodeDataUrl, "PNG", pageWidth / 2 - 27, qrY + 3, 54, 54);
  } catch {
    // Fallback if QR code fails
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("QR Code", pageWidth / 2, qrY + 30, { align: "center" });
  }

  // QR instruction text
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Scannez pour vérifier", pageWidth / 2, qrY + 65, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("la certification en ligne", pageWidth / 2, qrY + 70, { align: "center" });

  // ===== FOOTER =====
  
  // Footer background with gradient effect
  doc.setFillColor(26, 61, 61);
  doc.rect(0, pageHeight - 38, pageWidth, 38, "F");
  
  // Gold accent line at top of footer
  doc.setFillColor(213, 157, 83);
  doc.rect(0, pageHeight - 38, pageWidth, 2, "F");

  // Footer text
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Ce certificat atteste que l'établissement respecte les normes ADNGUARD",
    pageWidth / 2,
    pageHeight - 26,
    { align: "center" }
  );
  doc.text(
    "en matière de traçabilité et d'authenticité des viandes certifiées.",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  // Brand text with gold color
  doc.setTextColor(213, 157, 83);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ADNGUARD", pageWidth / 2 - 25, pageHeight - 8, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Certification ADN pour la traçabilité alimentaire", pageWidth / 2 + 20, pageHeight - 8, { align: "center" });

  // ===== SAVE =====
  doc.save(`certificat-adnguard-${data.adnguardCode}.pdf`);
};
