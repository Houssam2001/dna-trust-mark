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
  doc.rect(0, 92, pageWidth, pageHeight - 130, "F");

  // Establishment name with decorative underline
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const estName = data.establishmentName.toUpperCase();
  doc.text(estName, pageWidth / 2, 112, { align: "center" });
  
  // Decorative line under name
  const nameWidth = doc.getTextWidth(estName);
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - nameWidth / 2 - 10, 117, pageWidth / 2 + nameWidth / 2 + 10, 117);

  // Type badge with pill shape
  const typeText = data.establishmentType.toUpperCase();
  const typeBadgeWidth = Math.max(doc.getTextWidth(typeText) + 20, 50);
  doc.setFillColor(26, 61, 61);
  doc.roundedRect(pageWidth / 2 - typeBadgeWidth / 2, 122, typeBadgeWidth, 10, 5, 5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(typeText, pageWidth / 2, 128.5, { align: "center" });

  // Address
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.address, pageWidth / 2, 142, { align: "center" });
  doc.setFontSize(10);
  doc.text(data.city, pageWidth / 2, 149, { align: "center" });

  // ===== CERTIFICATION DETAILS BOX =====
  
  const boxY = 160;
  const boxHeight = 45;
  
  // Details container with border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, boxY, pageWidth - 40, boxHeight, 3, 3, "S");
  
  // Vertical divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2, boxY + 8, pageWidth / 2, boxY + boxHeight - 8);

  // Left column - Code ADNGUARD
  const leftColCenter = 20 + (pageWidth - 40) / 4;
  
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CODE ADNGUARD", leftColCenter, boxY + 12, { align: "center" });
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.adnguardCode, leftColCenter, boxY + 24, { align: "center" });

  // Status badge - centered below code
  doc.setFillColor(34, 139, 34);
  const statusWidth = 55;
  doc.roundedRect(leftColCenter - statusWidth / 2, boxY + 29, statusWidth, 9, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CONFORME", leftColCenter, boxY + 35.5, { align: "center" });

  // Right column - Validity dates
  const rightColCenter = pageWidth / 2 + (pageWidth - 40) / 4;
  
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PÉRIODE DE VALIDITÉ", rightColCenter, boxY + 12, { align: "center" });
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Du ${data.validFrom}`, rightColCenter, boxY + 24, { align: "center" });
  doc.text(`Au ${data.validUntil}`, rightColCenter, boxY + 33, { align: "center" });

  if (data.certifiedSince) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text(`Certifié depuis ${data.certifiedSince}`, rightColCenter, boxY + 41, { align: "center" });
  }

  // ===== QR CODE SECTION =====
  
  const qrY = 215;
  const qrSize = 45;
  const qrFrameSize = qrSize + 16;
  
  // QR Code decorative frame
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth / 2 - qrFrameSize / 2, qrY, qrFrameSize, qrFrameSize + 25, 4, 4, "F");
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(1.2);
  doc.roundedRect(pageWidth / 2 - qrFrameSize / 2, qrY, qrFrameSize, qrFrameSize + 25, 4, 4, "S");
  
  // Corner accents on QR frame
  doc.setFillColor(213, 157, 83);
  const cornerSize = 10;
  const cornerThick = 2.5;
  // Top-left
  doc.rect(pageWidth / 2 - qrFrameSize / 2, qrY, cornerSize, cornerThick, "F");
  doc.rect(pageWidth / 2 - qrFrameSize / 2, qrY, cornerThick, cornerSize, "F");
  // Top-right
  doc.rect(pageWidth / 2 + qrFrameSize / 2 - cornerSize, qrY, cornerSize, cornerThick, "F");
  doc.rect(pageWidth / 2 + qrFrameSize / 2 - cornerThick, qrY, cornerThick, cornerSize, "F");
  // Bottom-left
  doc.rect(pageWidth / 2 - qrFrameSize / 2, qrY + qrFrameSize + 25 - cornerThick, cornerSize, cornerThick, "F");
  doc.rect(pageWidth / 2 - qrFrameSize / 2, qrY + qrFrameSize + 25 - cornerSize, cornerThick, cornerSize, "F");
  // Bottom-right
  doc.rect(pageWidth / 2 + qrFrameSize / 2 - cornerSize, qrY + qrFrameSize + 25 - cornerThick, cornerSize, cornerThick, "F");
  doc.rect(pageWidth / 2 + qrFrameSize / 2 - cornerThick, qrY + qrFrameSize + 25 - cornerSize, cornerThick, cornerSize, "F");

  // Add QR code image
  try {
    doc.addImage(data.qrCodeDataUrl, "PNG", pageWidth / 2 - qrSize / 2, qrY + 8, qrSize, qrSize);
  } catch {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("QR Code", pageWidth / 2, qrY + 30, { align: "center" });
  }

  // QR instruction text
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Scannez pour vérifier", pageWidth / 2, qrY + qrSize + 16, { align: "center" });
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("la certification en ligne", pageWidth / 2, qrY + qrSize + 22, { align: "center" });

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
