// utils/pdfGenerator.js - Minimal test version

import fs from 'fs';
import path from 'path';

/**
 * Minimal test - just return the original template without modification
 */
export async function generateInvoicePDF(data) {
  try {
    console.log('🧪 MINIMAL TEST: Starting PDF generation...');
    
    const templatePath = path.join(process.cwd(), 'public', 'MyCanteen_temp_invoice.pdf');
    console.log('📁 Reading template from:', templatePath);
    
    // Test 1: Just return the original template
    console.log('🔍 Test 1: Returning original template...');
    const originalTemplate = fs.readFileSync(templatePath);
    console.log('✅ Original template size:', originalTemplate.length, 'bytes');
    
    // If this works, we know the issue is in PDF modification
    return originalTemplate;
    
  } catch (error) {
    console.error('❌ Error in minimal test:', error);
    
    // Fallback: Create completely new PDF
    return await createBrandNewPDF(data);
  }
}

/**
 * Create a completely new PDF from scratch
 */
async function createBrandNewPDF(data) {
  try {
    console.log('🆕 Creating brand new PDF...');
    
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    
    // Create new document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Simple layout
    page.drawText('MyCanteen Invoice', {
      x: 50, y: 750, size: 20, font: boldFont, color: rgb(0.1, 0.3, 0.8)
    });
    
    page.drawText(`Invoice #: ${data.invoiceNumber}`, {
      x: 50, y: 700, size: 12, font: font
    });
    
    page.drawText(`Date: ${data.date}`, {
      x: 50, y: 680, size: 12, font: font
    });
    
    page.drawText(`Customer: ${data.user.name}`, {
      x: 50, y: 650, size: 12, font: font
    });
    
    page.drawText(`Student ID: ${data.user.id}`, {
      x: 50, y: 630, size: 12, font: font
    });
    
    // Simple meals list
    let yPos = 580;
    page.drawText('Meals:', { x: 50, y: yPos, size: 12, font: boldFont });
    
    data.meals.forEach(meal => {
      yPos -= 20;
      page.drawText(`${meal.description} x ${meal.quantity} = ₹${meal.total}`, {
        x: 50, y: yPos, size: 10, font: font
      });
    });
    
    yPos -= 40;
    page.drawText(`Total: ₹${data.totalAmount}`, {
      x: 50, y: yPos, size: 14, font: boldFont, color: rgb(0.8, 0.1, 0.1)
    });
    
    page.drawText('Thank you!', {
      x: 50, y: yPos - 40, size: 12, font: font
    });
    
    const pdfBytes = await pdfDoc.save();
    console.log('✅ New PDF created, size:', pdfBytes.length, 'bytes');
    
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    console.error('❌ Error creating new PDF:', error);
    throw error;
  }
}