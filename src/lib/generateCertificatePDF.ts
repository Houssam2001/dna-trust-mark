import { jsPDF } from "jspdf";
import adnguardLogo from "@/assets/adnguard-logo.png";

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

// Helper to convert image URL to base64 for jsPDF
const getBase64FromUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== PREMIUM BACKGROUND DESIGN =====
  
  // Main dark teal header
  doc.setFillColor(20, 50, 50);
  doc.rect(0, 0, pageWidth, 85, "F");
  
  // Gradient overlay effect
  doc.setFillColor(26, 61, 61);
  doc.rect(0, 0, pageWidth, 60, "F");
  
  // Decorative corner accents
  doc.setFillColor(213, 157, 83);
  doc.triangle(0, 0, 30, 0, 0, 30, "F");
  doc.triangle(pageWidth, 0, pageWidth - 30, 0, pageWidth, 30, "F");
  
  // Gold accent bar
  doc.setFillColor(213, 157, 83);
  doc.rect(0, 85, pageWidth, 3, "F");
  
  // Thin decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(40, 82, pageWidth - 40, 82);

  // ===== LOGO =====
  try {
    const logoBase64 = await getBase64FromUrl(adnguardLogo);
    doc.addImage(logoBase64, "PNG", pageWidth / 2 - 12, 8, 24, 24);
  } catch {
    // Fallback circle if logo fails
    doc.setFillColor(213, 157, 83);
    doc.circle(pageWidth / 2, 20, 10, "F");
  }

  // Main title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICAT", pageWidth / 2, 45, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("DE CONFORMITÉ ADNGUARD", pageWidth / 2, 54, { align: "center" });

  // Tagline with gold color
  doc.setTextColor(213, 157, 83);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Analyse ADN • Traçabilité • Authenticité Garantie", pageWidth / 2, 65, { align: "center" });

  // ===== MAIN CONTENT AREA =====
  
  // Subtle background for content area
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 88, pageWidth, pageHeight - 125, "F");

  // Establishment name
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const estName = data.establishmentName.toUpperCase();
  doc.text(estName, pageWidth / 2, 105, { align: "center" });
  
  // Decorative line under name
  const nameWidth = Math.min(doc.getTextWidth(estName), 140);
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - nameWidth / 2 - 8, 109, pageWidth / 2 + nameWidth / 2 + 8, 109);

  // Type badge
  const typeText = data.establishmentType.toUpperCase();
  const typeBadgeWidth = Math.max(doc.getTextWidth(typeText) * 1.5 + 16, 45);
  doc.setFillColor(26, 61, 61);
  doc.roundedRect(pageWidth / 2 - typeBadgeWidth / 2, 113, typeBadgeWidth, 9, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(typeText, pageWidth / 2, 119, { align: "center" });

  // Address
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(data.address, pageWidth / 2, 131, { align: "center" });
  doc.text(data.city, pageWidth / 2, 137, { align: "center" });

  // ===== CERTIFICATION DETAILS BOX =====
  
  const boxY = 147;
  const boxHeight = 40;
  
  // Details container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(25, boxY, pageWidth - 50, boxHeight, 3, 3, "F");
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.roundedRect(25, boxY, pageWidth - 50, boxHeight, 3, 3, "S");
  
  // Vertical divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2, boxY + 6, pageWidth / 2, boxY + boxHeight - 6);

  // Left column - Code ADNGUARD
  const leftColCenter = 25 + (pageWidth - 50) / 4;
  
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CODE ADNGUARD", leftColCenter, boxY + 10, { align: "center" });
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.adnguardCode, leftColCenter, boxY + 20, { align: "center" });

  // Status badge
  doc.setFillColor(34, 139, 34);
  const statusWidth = 48;
  doc.roundedRect(leftColCenter - statusWidth / 2, boxY + 25, statusWidth, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CONFORME", leftColCenter, boxY + 30.5, { align: "center" });

  // Right column - Validity
  const rightColCenter = pageWidth / 2 + (pageWidth - 50) / 4;
  
  doc.setTextColor(130, 130, 130);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PÉRIODE DE VALIDITÉ", rightColCenter, boxY + 10, { align: "center" });
  
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Du ${data.validFrom}`, rightColCenter, boxY + 20, { align: "center" });
  doc.text(`Au ${data.validUntil}`, rightColCenter, boxY + 28, { align: "center" });

  if (data.certifiedSince) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(6);
    doc.text(`Certifié depuis ${data.certifiedSince}`, rightColCenter, boxY + 36, { align: "center" });
  }

  // ===== QR CODE SECTION =====
  
  const qrY = 192;
  const qrSize = 42;
  const qrFramePadding = 8;
  const qrFrameWidth = qrSize + qrFramePadding * 2;
  const qrFrameHeight = qrSize + qrFramePadding * 2 + 18;
  
  // QR Code frame
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth / 2 - qrFrameWidth / 2, qrY, qrFrameWidth, qrFrameHeight, 3, 3, "F");
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(1);
  doc.roundedRect(pageWidth / 2 - qrFrameWidth / 2, qrY, qrFrameWidth, qrFrameHeight, 3, 3, "S");
  
  // Corner accents
  doc.setFillColor(213, 157, 83);
  const cs = 8; // corner size
  const ct = 2; // corner thickness
  // Top-left
  doc.rect(pageWidth / 2 - qrFrameWidth / 2, qrY, cs, ct, "F");
  doc.rect(pageWidth / 2 - qrFrameWidth / 2, qrY, ct, cs, "F");
  // Top-right
  doc.rect(pageWidth / 2 + qrFrameWidth / 2 - cs, qrY, cs, ct, "F");
  doc.rect(pageWidth / 2 + qrFrameWidth / 2 - ct, qrY, ct, cs, "F");
  // Bottom-left
  doc.rect(pageWidth / 2 - qrFrameWidth / 2, qrY + qrFrameHeight - ct, cs, ct, "F");
  doc.rect(pageWidth / 2 - qrFrameWidth / 2, qrY + qrFrameHeight - cs, ct, cs, "F");
  // Bottom-right
  doc.rect(pageWidth / 2 + qrFrameWidth / 2 - cs, qrY + qrFrameHeight - ct, cs, ct, "F");
  doc.rect(pageWidth / 2 + qrFrameWidth / 2 - ct, qrY + qrFrameHeight - cs, ct, cs, "F");

  // QR code image
  try {
    doc.addImage(data.qrCodeDataUrl, "PNG", pageWidth / 2 - qrSize / 2, qrY + qrFramePadding, qrSize, qrSize);
  } catch {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("QR Code", pageWidth / 2, qrY + qrSize / 2 + qrFramePadding, { align: "center" });
  }

  // QR instruction
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Scannez pour vérifier", pageWidth / 2, qrY + qrSize + qrFramePadding + 8, { align: "center" });
  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  doc.text("la certification en ligne", pageWidth / 2, qrY + qrSize + qrFramePadding + 13, { align: "center" });

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
