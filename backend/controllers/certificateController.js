
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = (req,res)=>{
  const doc = new PDFDocument({ size: 'A4' });
  const outPath = path.join(__dirname, '..', 'certs');
  if(!fs.existsSync(outPath)) fs.mkdirSync(outPath);
  const filename = `cert-${Date.now()}.pdf`;
  const filePath = path.join(outPath, filename);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(28).text('Certificate of Completion', { align: 'center' });
  doc.fontSize(16).text('User has completed the course.', { align:'center' });
  doc.end();

  stream.on('finish', ()=> res.json({ url: `/certs/${filename}` }));
};
