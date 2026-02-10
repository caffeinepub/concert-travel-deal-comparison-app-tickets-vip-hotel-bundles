import { useState, useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import type { Message } from '@/backend';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
}

export default function ChatPanel({ messages, onSendMessage, isSending }: ChatPanelProps) {
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || isSending) return;

    const content = messageInput.trim();
    setMessageInput('');
    await onSendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sortedMessages = [...messages].reverse();

  return (
    <CardContent className="p-0">
      <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
        <div className="space-y-4">
          {sortedMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            sortedMessages.map((message) => (
              <div key={message.id.toString()} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">
                    {message.author?.userName || 'Anonymous'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(Number(message.timestamp) / 1000000).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm bg-muted rounded-lg p-3">{message.content}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!messageInput.trim() || isSending}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
