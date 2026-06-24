import { useState } from 'react';
import { Webhook, Send } from 'lucide-react';
import { AxiosError, type Method } from 'axios';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/services/apiClient';

type Endpoint = 'echo' | 'status' | 'delay' | 'random' | 'flaky';

interface ResponseState {
  status: number;
  ok: boolean;
  durationMs: number;
  body: unknown;
}

const ENDPOINT_LABELS: Record<Endpoint, string> = {
  echo: 'Echo (reflects your request)',
  status: 'Status code',
  delay: 'Delayed response',
  random: 'Random payload (~20% errors)',
  flaky: 'Flaky (fails then succeeds)',
};

const METHODS: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function statusTone(status: number): 'success' | 'warning' | 'destructive' {
  if (status >= 500 || status === 0) return 'destructive';
  if (status >= 400) return 'warning';
  return 'success';
}

export default function ApiTestingPage() {
  const [endpoint, setEndpoint] = useState<Endpoint>('echo');
  const [method, setMethod] = useState<Method>('GET');
  const [statusCode, setStatusCode] = useState('200');
  const [delayMs, setDelayMs] = useState('1000');
  const [flakyThreshold, setFlakyThreshold] = useState('3');
  const [body, setBody] = useState('{\n  "hello": "world"\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);

  const supportsBody = endpoint === 'echo' && method !== 'GET' && method !== 'DELETE';

  const buildRequest = (): { url: string; method: Method; data?: unknown; params?: Record<string, string> } => {
    switch (endpoint) {
      case 'status':
        return { url: `/playground/status/${statusCode}`, method: 'GET' };
      case 'delay':
        return { url: `/playground/delay/${delayMs}`, method: 'GET' };
      case 'random':
        return { url: '/playground/random', method: 'GET' };
      case 'flaky':
        return { url: '/playground/flaky', method: 'GET', params: { threshold: flakyThreshold, key: 'console' } };
      case 'echo':
      default:
        return { url: '/playground/echo', method, data: supportsBody ? JSON.parse(body) : undefined };
    }
  };

  const send = async () => {
    setBodyError(null);
    let request: ReturnType<typeof buildRequest>;
    try {
      request = buildRequest();
    } catch {
      setBodyError('Request body is not valid JSON');
      return;
    }

    setLoading(true);
    const started = performance.now();
    try {
      const res = await apiClient.request({
        url: request.url,
        method: request.method,
        data: request.data,
        params: request.params,
      });
      setResponse({
        status: res.status,
        ok: true,
        durationMs: Math.round(performance.now() - started),
        body: res.data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      setResponse({
        status: axiosError.response?.status ?? 0,
        ok: false,
        durationMs: Math.round(performance.now() - started),
        body: axiosError.response?.data ?? { message: axiosError.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Webhook className="h-5 w-5" />}
        title="API Console"
        description="Send live requests to the playground API and inspect status, timing and payloads."
      />

      <Section title="Request builder" id="request">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint-trigger">Endpoint</Label>
                <Select value={endpoint} onValueChange={(value) => setEndpoint(value as Endpoint)}>
                  <SelectTrigger id="api-endpoint-trigger" data-testid="api-endpoint">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ENDPOINT_LABELS) as Endpoint[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {ENDPOINT_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-method-trigger">Method</Label>
                <Select
                  value={method}
                  onValueChange={(value) => setMethod(value as Method)}
                  disabled={endpoint !== 'echo'}
                >
                  <SelectTrigger id="api-method-trigger" data-testid="api-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((verb) => (
                      <SelectItem key={verb} value={verb}>
                        {verb}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {endpoint === 'status' ? (
              <div className="space-y-2">
                <Label htmlFor="api-status-code">Status code (100–599)</Label>
                <Input
                  id="api-status-code"
                  data-testid="api-status-code"
                  value={statusCode}
                  onChange={(event) => setStatusCode(event.target.value)}
                  inputMode="numeric"
                />
              </div>
            ) : null}

            {endpoint === 'delay' ? (
              <div className="space-y-2">
                <Label htmlFor="api-delay-ms">Delay (milliseconds, max 10000)</Label>
                <Input
                  id="api-delay-ms"
                  data-testid="api-delay-ms"
                  value={delayMs}
                  onChange={(event) => setDelayMs(event.target.value)}
                  inputMode="numeric"
                />
              </div>
            ) : null}

            {endpoint === 'flaky' ? (
              <div className="space-y-2">
                <Label htmlFor="api-flaky-threshold">Succeed on attempt #</Label>
                <Input
                  id="api-flaky-threshold"
                  data-testid="api-flaky-threshold"
                  value={flakyThreshold}
                  onChange={(event) => setFlakyThreshold(event.target.value)}
                  inputMode="numeric"
                />
              </div>
            ) : null}

            {supportsBody ? (
              <div className="space-y-2">
                <Label htmlFor="api-body">Request body (JSON)</Label>
                <Textarea
                  id="api-body"
                  data-testid="api-body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
                {bodyError ? (
                  <p role="alert" className="text-xs text-destructive">
                    {bodyError}
                  </p>
                ) : null}
              </div>
            ) : null}

            <Button onClick={send} disabled={loading} data-testid="api-send">
              {loading ? <Spinner label="Sending" /> : <Send className="h-4 w-4" />}
              Send request
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Response" id="response">
        <Card>
          <CardContent className="space-y-4 pt-6">
            {response ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={statusTone(response.status)} data-testid="api-response-status">
                    {response.status === 0 ? 'Network error' : `HTTP ${response.status}`}
                  </Badge>
                  <span className="text-sm text-muted-foreground" data-testid="api-response-time">
                    {response.durationMs} ms
                  </span>
                </div>
                <pre
                  data-testid="api-response-body"
                  className="max-h-96 overflow-auto rounded-lg bg-muted/60 p-4 text-xs leading-relaxed"
                >
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Send a request to see the response here.</p>
            )}
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
