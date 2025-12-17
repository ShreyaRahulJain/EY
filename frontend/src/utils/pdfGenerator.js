import jsPDF from 'jspdf';

export const generateLoanApprovalPDF = (loanData, approvalDetails) => {
  const doc = new jsPDF();
  
  // Set up colors and fonts
  const primaryColor = [0, 0, 0]; // Black
  const accentColor = [255, 193, 7]; // Yellow
  const textColor = [64, 64, 64]; // Dark gray
  
  // Header
  doc.setFillColor(...accentColor);
  doc.rect(0, 0, 210, 30, 'F');
  
  // Company logo area (yellow background)
  doc.setFillColor(...primaryColor);
  doc.rect(15, 8, 14, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OC', 22, 18);
  
  // Company name
  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('OpenCred', 35, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Digital Lending Platform', 35, 21);
  
  // Document title
  doc.setTextColor(...primaryColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LOAN APPROVAL CERTIFICATE', 105, 50, { align: 'center' });
  
  // Approval badge
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(85, 60, 40, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ APPROVED', 105, 68, { align: 'center' });
  
  // Main content
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 90;
  
  // Congratulations message
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dear ${loanData.name || 'Valued Customer'},`, 20, yPos);
  yPos += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Congratulations! Your loan application has been approved. Below are the details:', 20, yPos);
  yPos += 20;
  
  // Details (removed box)
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('LOAN DETAILS', 25, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  const details = [
    ['Applicant Name:', loanData.name || 'N/A'],
    ['PAN Number:', loanData.pan || 'N/A'],
    ['Approved Amount:', `Rs. ${Number(loanData.amount || 0).toLocaleString()}`],
    ['Interest Rate:', '8.5% per annum'],
    ['Tenure:', '36 months'],
    ['Monthly EMI:', `Rs. ${Math.round((Number(loanData.amount || 0) * 0.085 / 12) / (1 - Math.pow(1 + 0.085/12, -36)) * (1 + 0.085/12)).toLocaleString()}`],
    ['Processing Fee:', 'Rs. 2,500 + GST'],
    ['Approval Date:', new Date().toLocaleDateString('en-IN')],
    ['Loan ID:', approvalDetails.loanId || 'N/A']
  ];
  
  details.forEach(([label, value]) => {
    doc.text(label, 25, yPos);
    doc.text(value, 100, yPos);
    yPos += 8;
  });
  
  // Terms and conditions
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT TERMS:', 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const terms = [
    '• This approval is valid for 30 days from the date of issue',
    '• Final disbursement is subject to document verification',
    '• EMI will be auto-debited from your registered bank account',
    '• Prepayment charges: 2% of outstanding principal (after 12 months)',
    '• Late payment charges: 2% per month on overdue amount'
  ];
  
  terms.forEach(term => {
    doc.text(term, 20, yPos);
    yPos += 6;
  });
  
  // Footer
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Next Steps:', 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1. Our team will contact you within 24 hours for document verification', 20, yPos);
  yPos += 5;
  doc.text('2. Submit required documents at our nearest branch or via email', 20, yPos);
  yPos += 5;
  doc.text('3. Loan amount will be disbursed within 3-5 working days post verification', 20, yPos);
  
  // Contact info
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Information:', 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: +91-9876543210  |  Email: support@opencred.com  |  Website: www.opencred.com', 20, yPos);
  
  // Digital signature
  yPos += 15;
  doc.setFontSize(8);
  doc.text('This is a digitally generated document. No physical signature required.', 20, yPos);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, yPos + 5);
  
  // Save the PDF
  const fileName = `OpenCred_Loan_Approval_${loanData.name?.replace(/\s+/g, '_') || 'Certificate'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
};
