import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import { SAMPLE_PDF_DATA } from '@/lib/pdf/sampleData';

export default function PreviewReportPage() {
  return (
    <PdfViewerClient
      {...SAMPLE_PDF_DATA}
      createdAt={SAMPLE_PDF_DATA.createdAt ?? '2026-05-14'}
    />
  );
}
