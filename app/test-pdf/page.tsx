import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import { SAMPLE_PDF_DATA } from '@/lib/pdf/sampleData';

export default function TestPdfPage() {
  return <PdfViewerClient {...SAMPLE_PDF_DATA} />;
}
