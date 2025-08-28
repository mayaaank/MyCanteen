// app/api/invoice/route.js - Debug version

import { NextResponse } from 'next/server';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    console.log('🚀 Invoice API called');
    
    const { userId, userName, startDate, endDate } = await request.json();
    console.log('📥 Received data:', { userId, userName, startDate, endDate });

    // Validate input
    if (!userId || !userName || !startDate || !endDate) {
      console.log('❌ Missing parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Mock data for now
    const mockInvoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN'),
      user: {
        name: userName,
        id: userId,
        department: 'Computer Science Engineering',
        contact: '+91 96379 12911'
      },
      dateRange: {
        start: startDate,
        end: endDate
      },
      meals: [
        {
          description: 'Half Plate',
          portionSize: '1 Plate',
          quantity: 12,
          unitPrice: 35,
          total: 420
        },
        {
          description: 'Full Plate',
          portionSize: '1 Plate', 
          quantity: 8,
          unitPrice: 50,
          total: 400
        }
      ],
      totalAmount: 820
    };

    console.log('🔄 Generating PDF...');

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(mockInvoiceData);
    
    console.log('✅ PDF generated successfully');
    console.log('📊 PDF buffer size:', pdfBuffer.length, 'bytes');

    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Generated PDF buffer is empty');
    }

    // Check PDF header
    const pdfHeader = pdfBuffer.slice(0, 5).toString();
    console.log('📄 PDF header:', pdfHeader);
    
    if (!pdfHeader.includes('%PDF')) {
      console.error('❌ Invalid PDF header! Header is:', pdfHeader);
      throw new Error('Generated buffer is not a valid PDF');
    }

    console.log('✅ PDF validation passed, returning response...');

    // Return PDF as response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${userName}_${new Date().getMonth() + 1}_${new Date().getFullYear()}.pdf"`,
        'Cache-Control': 'no-cache',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Detailed error generating invoice:', error);
    console.error('📍 Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Test routes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'test-template') {
      const templatePath = path.join(process.cwd(), 'public', 'MyCanteen_temp_invoice.pdf');
      
      console.log('🧪 Testing template file...');
      console.log('📁 Template path:', templatePath);
      console.log('📁 File exists:', fs.existsSync(templatePath));
      
      if (fs.existsSync(templatePath)) {
        const stats = fs.statSync(templatePath);
        const fileBuffer = fs.readFileSync(templatePath);
        const header = fileBuffer.slice(0, 10).toString();
        
        return NextResponse.json({
          exists: true,
          size: stats.size,
          header: header,
          isValidPDF: header.includes('%PDF')
        });
      } else {
        const publicPath = path.join(process.cwd(), 'public');
        const publicFiles = fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [];
        
        return NextResponse.json({
          exists: false,
          publicFolderExists: fs.existsSync(publicPath),
          filesInPublic: publicFiles
        });
      }
    }
    
    // New: Download original template directly
    if (action === 'download-original') {
      console.log('📥 Downloading original template...');
      const templatePath = path.join(process.cwd(), 'public', 'MyCanteen_temp_invoice.pdf');
      
      if (fs.existsSync(templatePath)) {
        const templateBuffer = fs.readFileSync(templatePath);
        console.log('✅ Original template read, size:', templateBuffer.length, 'bytes');
        
        return new Response(templateBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="original_template.pdf"',
          },
        });
      } else {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Error in GET route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}