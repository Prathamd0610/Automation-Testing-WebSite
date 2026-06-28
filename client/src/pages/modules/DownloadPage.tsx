import { useState } from 'react';
import { Download, FileJson, FileText, Sheet } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ROWS = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'Editor' },
  { id: 3, name: 'Carol', role: 'Viewer' },
];

/** Trigger a real browser download from an in-memory Blob. */
function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * File download — generate CSV, JSON and plain-text files on the fly and
 * download them. Pairs with the file-download verification techniques in the
 * Selenium and Playwright tracks (set a download dir, then assert on disk).
 */
export default function DownloadPage() {
  const [last, setLast] = useState('');

  const csv = () => {
    const body = ['id,name,role', ...ROWS.map((r) => `${r.id},${r.name},${r.role}`)].join('\n');
    downloadBlob('users.csv', body, 'text/csv');
    setLast('users.csv');
  };
  const json = () => {
    downloadBlob('users.json', JSON.stringify(ROWS, null, 2), 'application/json');
    setLast('users.json');
  };
  const txt = () => {
    downloadBlob('report.txt', `Generated ${new Date().toISOString()}\nRows: ${ROWS.length}`, 'text/plain');
    setLast('report.txt');
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Download className="h-5 w-5" />}
        title="File Download"
        description="Generate and download files entirely in the browser. Configure your driver's download directory, click, then verify the file landed on disk."
      />

      <Section title="Export data" id="export">
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button data-testid="download-csv" onClick={csv}>
              <Sheet className="h-4 w-4" aria-hidden="true" /> Download CSV
            </Button>
            <Button variant="outline" data-testid="download-json" onClick={json}>
              <FileJson className="h-4 w-4" aria-hidden="true" /> Download JSON
            </Button>
            <Button variant="outline" data-testid="download-txt" onClick={txt}>
              <FileText className="h-4 w-4" aria-hidden="true" /> Download TXT
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel label="Last download" value={last} testId="download-last" tone={last ? 'success' : 'default'} />
      </Section>
    </PageContainer>
  );
}
