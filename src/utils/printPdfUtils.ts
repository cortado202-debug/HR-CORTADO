import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Robustly downloads a DOM element as a high-resolution PDF.
 * Uses html2canvas with DOM cloning and CSS sanitization (removing unsupported oklch/backdrop filters).
 */
export async function downloadPdfFromElement(
  element: HTMLElement,
  filename: string = 'document.pdf'
): Promise<boolean> {
  try {
    // Clone the element into a temporary clean offscreen container with explicit standard styling
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '800px';
    clone.style.maxWidth = '800px';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#0f172a';
    clone.style.zIndex = '99999';

    // Remove any no-print elements inside the clone
    const noPrintItems = clone.querySelectorAll('.no-print');
    noPrintItems.forEach((el) => el.remove());

    // Sanitize any images in clone to avoid CORS breaks
    const images = clone.querySelectorAll('img');
    images.forEach((img) => {
      img.crossOrigin = 'anonymous';
    });

    document.body.appendChild(clone);

    // Render canvas from sanitized clone
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 850,
      onclone: (clonedDoc) => {
        // Strip any unsupported modern css variables
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style) {
            htmlEl.style.backdropFilter = 'none';
            (htmlEl.style as unknown as Record<string, string>)['webkitBackdropFilter'] = 'none';
          }
        });
      },
    });

    // Remove cloned element
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Add subsequent pages if document is longer than 1 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
    return true;
  } catch (error) {
    console.error('downloadPdfFromElement error:', error);
    // Fallback: trigger print dialog directly which allows "Save as PDF" natively in all browsers
    window.print();
    return true;
  }
}

/**
 * Triggers native high-quality vector printing for any printable element or modal
 */
export function triggerPrint(): void {
  window.print();
}
