import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  disabled?: boolean;
}

export const CommandInput = ({ onSubmit, disabled }: CommandInputProps) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Type your command..."
        disabled={disabled}
        className="bg-card/50 backdrop-blur-sm border-primary/30 focus:border-primary"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !command.trim()}
        className="shadow-lg shadow-primary/50"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
