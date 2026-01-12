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

  // Background gradient effect (simulated with rectangles)
  doc.setFillColor(26, 61, 61); // dark teal
  doc.rect(0, 0, pageWidth, 80, "F");

  // Decorative accent bar
  doc.setFillColor(213, 157, 83); // gold accent
  doc.rect(0, 75, pageWidth, 8, "F");

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICAT", pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("DE CONFORMITÉ ADNGUARD", pageWidth / 2, 48, { align: "center" });

  doc.setFontSize(11);
  doc.text("Analyse ADN • Traçabilité • Authenticité", pageWidth / 2, 60, { align: "center" });

  // Main content area
  doc.setTextColor(30, 30, 30);

  // Establishment name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.establishmentName, pageWidth / 2, 105, { align: "center" });

  // Type badge
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(data.establishmentType.toUpperCase(), pageWidth / 2, 115, { align: "center" });

  // Address
  doc.setFontSize(11);
  doc.text(`${data.address}, ${data.city}`, pageWidth / 2, 125, { align: "center" });

  // Divider
  doc.setDrawColor(213, 157, 83);
  doc.setLineWidth(0.5);
  doc.line(40, 135, pageWidth - 40, 135);

  // Certification details in two columns
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  const leftCol = 45;
  const rightCol = pageWidth / 2 + 15;
  let y = 150;

  doc.text("CODE ADNGUARD", leftCol, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(26, 61, 61);
  doc.text(data.adnguardCode, leftCol, y + 8);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("STATUT", rightCol, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(46, 125, 50);
  doc.text("CONFORME ✓", rightCol, y + 8);

  y = 175;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("VALIDE DU", leftCol, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(data.validFrom, leftCol, y + 7);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("VALIDE JUSQU'AU", rightCol, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(data.validUntil, rightCol, y + 7);

  if (data.certifiedSince) {
    y = 195;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFIÉ DEPUIS", leftCol, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(data.certifiedSince, leftCol, y + 7);
  }

  // QR Code section
  y = 220;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth / 2 - 35, y, 70, 75, 3, 3, "S");

  // Add QR code image
  try {
    doc.addImage(data.qrCodeDataUrl, "PNG", pageWidth / 2 - 25, y + 5, 50, 50);
  } catch {
    // Fallback if QR code fails
    doc.setFontSize(8);
    doc.text("QR Code", pageWidth / 2, y + 30, { align: "center" });
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Scannez pour vérifier", pageWidth / 2, y + 63, { align: "center" });
  doc.setFontSize(7);
  doc.text("la certification en ligne", pageWidth / 2, y + 68, { align: "center" });

  // Footer
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageHeight - 35, pageWidth, 35, "F");

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(
    "Ce certificat atteste que l'établissement respecte les normes ADNGUARD en matière de traçabilité et d'authenticité des viandes.",
    pageWidth / 2,
    pageHeight - 22,
    { align: "center", maxWidth: pageWidth - 40 }
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 61, 61);
  doc.text("ADNGUARD - Certification ADN pour la traçabilité alimentaire", pageWidth / 2, pageHeight - 10, {
    align: "center",
  });

  // Save
  doc.save(`certificat-adnguard-${data.adnguardCode}.pdf`);
};
