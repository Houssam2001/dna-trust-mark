import { jsPDF } from "jspdf";
const adnguardLogo = "/imgcertif.jpeg";

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
  doc.rect(0, 0, pageWidth, 55, "F");

  // Gradient overlay effect
  doc.setFillColor(26, 61, 61);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Decorative corner accents
  doc.setFillColor(213, 157, 83);
  doc.triangle(0, 0, 25, 0, 0, 25, "F");
  doc.triangle(pageWidth, 0, pageWidth - 25, 0, pageWidth, 25, "F");

  // Gold accent bar
  doc.setFillColor(213, 157, 83);
  doc.rect(0, 55, pageWidth, 3, "F");

  // Thin decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(40, 52, pageWidth - 40, 52);

  // ===== LOGO =====
  try {
    const logoBase64 = await getBase64FromUrl(adnguardLogo);
    doc.addImage(logoBase64, "PNG", pageWidth / 2 - 10, 5, 20, 20);
  } catch {
    // Fallback circle if logo fails
    doc.setFillColor(213, 157, 83);
    doc.circle(pageWidth / 2, 15, 8, "F");
  }

  // Main title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICAT", pageWidth / 2, 32, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DE CONFORMITÉ ADNGUARD", pageWidth / 2, 39, { align: "center" });

  // Tagline with gold color
  doc.setTextColor(213, 157, 83);
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text("Analyse ADN • Traçabilité • Authenticité Garantie", pageWidth / 2, 47, { align: "center" });

  // ===== MAIN CONTENT AREA =====

  // Subtle background for content area
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 60, pageWidth, pageHeight - 98, "F");

  // Establishment name with decorative underline
  doc.setTextColor(26, 61, 61);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  const estName = data.establishmentName.toUpperCase();
  doc.text(estName, pageWidth / 2, 75, { align: "center" });

  // Decorative line under name
  const nameWidth = doc.getTextWidth(estName);
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - nameWidth / 2 - 10, 80, pageWidth / 2 + nameWidth / 2 + 10, 80);

  // Type badge with pill shape
  const typeText = data.establishmentType.toUpperCase();
  const typeBadgeWidth = Math.max(doc.getTextWidth(typeText) + 20, 40);
  doc.setFillColor(26, 61, 61);
  doc.roundedRect(pageWidth / 2 - typeBadgeWidth / 2, 85, typeBadgeWidth, 9, 4.5, 4.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(typeText, pageWidth / 2, 91, { align: "center" });

  // Address
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(data.address, pageWidth / 2, 102, { align: "center" });
  doc.text(data.city, pageWidth / 2, 107, { align: "center" });

  // ===== CERTIFICATION DETAILS BOX =====

  const boxY = 118;
  const boxHeight = 40;

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

  const qrY = 170;
  const qrSize = 40;
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
  doc.rect(0, pageHeight - 45, pageWidth, 45, "F");

  // Gold accent line at top of footer
  doc.setFillColor(213, 157, 83);
  doc.rect(0, pageHeight - 45, pageWidth, 2, "F");

  // Footer text - attestation
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Ce certificat atteste que l'établissement respecte les normes ADNGUARD",
    pageWidth / 2,
    pageHeight - 36,
    { align: "center" }
  );
  doc.text(
    "en matière de traçabilité et d'authenticité des viandes certifiées.",
    pageWidth / 2,
    pageHeight - 32,
    { align: "center" }
  );

  // Company Information
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);

  // Left column - Company address
  doc.text("HV GLOBAL CONSULTING", 20, pageHeight - 24);
  doc.text("86 rue voltaire 93100 Montreuil France", 20, pageHeight - 20);
  doc.text("Siret 94475466200012 - TVA : FR46944754662", 20, pageHeight - 16);

  // Right column - Contact
  doc.text("Mail adnguard@gmail.com", pageWidth - 20, pageHeight - 24, { align: "right" });
  doc.text("What's up : +33 6 66 82 08 08", pageWidth - 20, pageHeight - 20, { align: "right" });

  // Brand text at the very bottom
  doc.setTextColor(213, 157, 83);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ADNGUARD", pageWidth / 2 - 25, pageHeight - 6, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text("Certification ADN pour la traçabilité alimentaire", pageWidth / 2 + 20, pageHeight - 6, { align: "center" });

  // ===== SAVE =====
  doc.save(`certificat-adnguard-${data.adnguardCode}.pdf`);
};
