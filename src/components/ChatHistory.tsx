import { useState } from 'react';
import { X, MessageSquare, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
  aiName: string;
  onClearHistory: () => void;
}

export const ChatHistory = ({ messages, aiName, onClearHistory }: ChatHistoryProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (messages.length === 0) return null;

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="absolute bottom-32 left-4 bg-card/90 backdrop-blur-sm border border-primary/30 hover:bg-card"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="absolute bottom-32 left-4 w-80 bg-card/90 backdrop-blur-sm border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-mono">CONVERSATION LOG</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearHistory}
            className="h-6 w-6 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === 'user'
                    ? 'text-accent text-right'
                    : 'text-primary'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {message.role === 'user' ? 'You' : aiName}
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
