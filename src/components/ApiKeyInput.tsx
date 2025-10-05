import { useState } from 'react';
import { Key, Save, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyInput = ({ onApiKeySet, hasApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(!hasApiKey);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey);
      setApiKey('');
      setIsVisible(false);
      toast.success('OpenAI API key saved');
    }
  };

  if (!isVisible || hasBeenDismissed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsVisible(true);
          setHasBeenDismissed(false);
        }}
        className="absolute top-4 right-4"
      >
        <Key className="h-4 w-4 mr-2" />
        {hasApiKey ? 'Update' : 'Set'} API Key
      </Button>
    );
  }

  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/90 backdrop-blur-sm border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>OpenAI API Key</CardTitle>
          </div>
          <CardDescription className="mt-2">
            Enter your OpenAI API key to enable AI responses. Get one from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI
            </a>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsVisible(false);
            setHasBeenDismissed(true);
          }}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="bg-background/50"
          />
          <Button type="submit" size="icon">
            <Save className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
