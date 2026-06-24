import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, File as FileIcon, Trash2, Download, UploadCloud } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { apiClient, getErrorMessage } from '@/services/apiClient';
import { apiOrigin } from '@/lib/env';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { ApiResponse, FileMeta } from '@/types/api';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadFiles = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await apiClient.get<ApiResponse<FileMeta[]>>('/files', { params: { limit: 50 } });
      setFiles(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load files'));
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const upload = useCallback(
    async (selected: FileList | null) => {
      if (!selected || selected.length === 0) return;
      const list = Array.from(selected);

      const tooBig = list.find((file) => file.size > MAX_BYTES);
      if (tooBig) {
        toast.error(`"${tooBig.name}" exceeds the 5 MB limit`);
        return;
      }

      const formData = new FormData();
      list.forEach((file) => formData.append('files', file));

      setUploading(true);
      setProgress(0);
      try {
        await apiClient.post<ApiResponse<FileMeta[]>>('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
          },
        });
        toast.success(`Uploaded ${list.length} file${list.length > 1 ? 's' : ''}`);
        await loadFiles();
      } catch (error) {
        toast.error(getErrorMessage(error, 'Upload failed'));
      } finally {
        setUploading(false);
        setProgress(0);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [loadFiles],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    void upload(event.dataTransfer.files);
  };

  const remove = async (id: string) => {
    try {
      await apiClient.delete(`/files/${id}`);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success('File deleted');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Delete failed'));
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Upload className="h-5 w-5" />}
        title="File Upload"
        description="Drag-and-drop or browse to upload files with live progress and server persistence."
      />

      <Section title="Upload" id="upload">
        <Card>
          <CardContent className="pt-6">
            <div
              role="button"
              tabIndex={0}
              data-testid="file-dropzone"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/40',
              )}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">Up to 10 files, max 5 MB each</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="sr-only"
                data-testid="file-input"
                aria-label="Choose files to upload"
                onChange={(event) => void upload(event.target.files)}
              />
            </div>

            {uploading ? (
              <div className="mt-4 space-y-2" aria-live="polite">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Spinner label="Uploading" /> Uploading…
                  </span>
                  <span data-testid="file-progress-value">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    data-testid="file-progress"
                  />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <Section title="Uploaded files" id="files" description="Stored on the server and listed from the API.">
        <Card>
          <CardContent className="pt-6">
            {loadingList ? (
              <div className="flex justify-center py-10">
                <Spinner label="Loading files" />
              </div>
            ) : files.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground" data-testid="file-empty">
                No files uploaded yet.
              </p>
            ) : (
              <ul className="divide-y" data-testid="file-list">
                {files.map((file) => (
                  <li
                    key={file.id}
                    data-testid={`file-item-${file.id}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{file.originalName}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {file.mimeType.split('/')[1] ?? file.mimeType}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild aria-label={`Download ${file.originalName}`}>
                      <a
                        href={`${apiOrigin}${file.url}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-testid={`file-download-${file.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void remove(file.id)}
                      aria-label={`Delete ${file.originalName}`}
                      data-testid={`file-delete-${file.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
