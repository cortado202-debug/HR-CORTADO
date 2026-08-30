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

    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const marginX = 8;
    const marginY = 8;
    const availableWidth = pdfWidth - marginX * 2;
    const availableHeight = pdfHeight - marginY * 2;

    // Calculate dimensions to fit completely on single page
    let imgWidth = availableWidth;
    let imgHeight = (canvas.height * availableWidth) / canvas.width;

    // If height exceeds available single page height, scale down proportionally to fit 1 single page
    if (imgHeight > availableHeight) {
      const ratio = availableHeight / imgHeight;
      imgHeight = availableHeight;
      imgWidth = imgWidth * ratio;
    }

    const posX = marginX + (availableWidth - imgWidth) / 2;
    const posY = marginY;

    // Render single high-quality page
    pdf.addImage(imgData, 'JPEG', posX, posY, imgWidth, imgHeight, undefined, 'FAST');

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
