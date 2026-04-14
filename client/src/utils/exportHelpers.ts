import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportPng(flow: unknown, fileName: string) {
  if (!flow) return;
  const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null;
  if (!viewport) return;
  const dataUrl = await toPng(viewport, { backgroundColor: '#0a0a0a' });
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportPdf(flow: unknown, fileName: string) {
  if (!flow) return;
  const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null;
  if (!viewport) return;
  const dataUrl = await toPng(viewport, { backgroundColor: '#0a0a0a' });
  const pdf = new jsPDF('landscape', 'pt', 'a4');
  pdf.addImage(dataUrl, 'PNG', 20, 20, 800, 450);
  pdf.save(`${fileName}.pdf`);
}
