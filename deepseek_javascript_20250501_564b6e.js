// Add before </body>
<script>
async function mergePDFs(pdfFiles) {
  const { PDFDocument } = PDFLib;
  
  const mergedPdf = await PDFDocument.create();
  for (const file of pdfFiles) {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
}

document.querySelectorAll('.tool-card').forEach(card => {
  if (card.querySelector('h4').textContent.includes('Merge PDF')) {
    card.addEventListener('click', async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.multiple = true;
      
      input.onchange = async e => {
        const files = Array.from(e.target.files);
        if (files.length < 2) {
          alert('Please select at least 2 PDFs to merge');
          return;
        }
        
        try {
          const mergedPdf = await mergePDFs(files);
          download(mergedPdf, 'merged.pdf', 'application/pdf');
        } catch (error) {
          console.error('Error merging PDFs:', error);
          alert('Error merging PDFs. Please try again.');
        }
      };
      
      input.click();
    });
  }
});
</script>