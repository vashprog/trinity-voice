import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Volume2 } from 'lucide-react';

export interface VoiceOption {
  id: string;
  name: string;
  label: string;
  pitch: number;
  rate: number;
}

export const voiceOptions: VoiceOption[] = [
  { id: 'jarvis', name: 'J.A.R.V.I.S', label: 'J.A.R.V.I.S', pitch: 0.8, rate: 0.95 },
  { id: 'friday', name: 'F.R.I.D.A.Y', label: 'F.R.I.D.A.Y', pitch: 1.3, rate: 1.0 },
  { id: 'edith', name: 'E.D.I.T.H', label: 'E.D.I.T.H', pitch: 1.1, rate: 0.9 },
];

interface VoiceSelectorProps {
  selectedVoice: VoiceOption;
  onVoiceChange: (voice: VoiceOption) => void;
}

export const VoiceSelector = ({ selectedVoice, onVoiceChange }: VoiceSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-12 rounded-full border-2 border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]"
        >
          <Volume2 className="h-5 w-5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-background/95 backdrop-blur-md border-primary/30">
        <div className="space-y-2">
          <h4 className="font-mono text-sm font-semibold text-primary mb-3">
            SELECT VOICE
          </h4>
          {voiceOptions.map((voice) => (
            <Button
              key={voice.id}
              variant={selectedVoice.id === voice.id ? 'default' : 'ghost'}
              className="w-full justify-start font-mono text-xs"
              onClick={() => {
                onVoiceChange(voice);
                setOpen(false);
              }}
            >
              {voice.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
