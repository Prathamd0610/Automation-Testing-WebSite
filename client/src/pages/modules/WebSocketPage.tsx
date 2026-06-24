import { useEffect, useRef, useState } from 'react';
import { Radio, Send, Wifi, WifiOff } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ResultPanel } from '@/components/common/ResultPanel';
import { getSocket } from '@/services/socket';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface CounterTick {
  value: number;
  timestamp: string;
}

export default function WebSocketPage() {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [online, setOnline] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState('Tester');
  const [draft, setDraft] = useState('');
  const [counter, setCounter] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      setSocketId(socket.id ?? null);
    };
    const onDisconnect = () => {
      setConnected(false);
      setSocketId(null);
      setSubscribed(false);
    };
    const onAck = (payload: { id: string }) => setSocketId(payload.id);
    const onPresence = (payload: { online: number }) => setOnline(payload.online);
    const onMessage = (message: ChatMessage) => setMessages((prev) => [...prev, message].slice(-100));
    const onTick = (tick: CounterTick) => setCounter(tick.value);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connection:ack', onAck);
    socket.on('presence:count', onPresence);
    socket.on('chat:message', onMessage);
    socket.on('counter:tick', onTick);

    socket.connect();

    return () => {
      socket.emit('counter:unsubscribe');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connection:ack', onAck);
      socket.off('presence:count', onPresence);
      socket.off('chat:message', onMessage);
      socket.off('counter:tick', onTick);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    getSocket().emit('chat:send', { user: username || 'Anonymous', text });
    setDraft('');
  };

  const toggleCounter = () => {
    const socket = getSocket();
    if (subscribed) {
      socket.emit('counter:unsubscribe');
      setSubscribed(false);
    } else {
      socket.emit('counter:subscribe');
      setSubscribed(true);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Radio className="h-5 w-5" />}
        title="WebSocket Live"
        description="Real-time chat, a server-pushed counter and presence over Socket.IO."
        actions={
          <Badge variant={connected ? 'success' : 'destructive'} data-testid="ws-status">
            {connected ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
            {connected ? 'Connected' : 'Disconnected'}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel
          label="Socket id"
          value={socketId}
          testId="ws-socket-id"
          tone={connected ? 'success' : 'default'}
        />
        <ResultPanel label="Clients online" value={online} testId="ws-online-count" />
      </div>

      <Section title="Live chat" id="chat" description="Messages broadcast to every connected client.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ul
              className="h-64 space-y-2 overflow-y-auto rounded-lg border bg-muted/30 p-3"
              data-testid="ws-messages"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <li className="py-10 text-center text-sm text-muted-foreground">No messages yet.</li>
              ) : (
                messages.map((message, index) => (
                  <li key={message.id} data-testid={`ws-message-${index}`} className="text-sm">
                    <span className="font-semibold text-foreground">{message.user}</span>{' '}
                    <span className="text-muted-foreground">{message.text}</span>
                  </li>
                ))
              )}
              <div ref={listEndRef} />
            </ul>

            <form onSubmit={sendMessage} className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
              <div className="space-y-1">
                <Label htmlFor="ws-username" className="sr-only">
                  Username
                </Label>
                <Input
                  id="ws-username"
                  data-testid="ws-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ws-message" className="sr-only">
                  Message
                </Label>
                <Input
                  id="ws-message"
                  data-testid="ws-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message…"
                  disabled={!connected}
                />
              </div>
              <Button type="submit" disabled={!connected} data-testid="ws-send">
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </Section>

      <Section title="Server-pushed counter" id="counter" description="The server emits a tick every second while subscribed.">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <Button onClick={toggleCounter} disabled={!connected} data-testid="ws-counter-toggle">
              {subscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
            <ResultPanel
              label="Latest tick"
              value={counter}
              testId="ws-counter-value"
              tone={subscribed ? 'success' : 'default'}
              className="min-w-[160px]"
            />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
