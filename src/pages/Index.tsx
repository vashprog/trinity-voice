import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { JarvisCore } from '@/components/JarvisCore';
import { FridayCore } from '@/components/FridayCore';
import { EdithCore } from '@/components/EdithCore';
import { VoiceInput } from '@/components/VoiceInput';
import { CommandInput } from '@/components/CommandInput';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { ChatHistory } from '@/components/ChatHistory';
import { VoiceSelector, voiceOptions, VoiceOption } from '@/components/VoiceSelector';
import { useOpenAI } from '@/hooks/useOpenAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessagesByVoice {
  jarvis: Message[];
  friday: Message[];
  edith: Message[];
}

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messagesByVoice, setMessagesByVoice] = useState<MessagesByVoice>({
    jarvis: [],
    friday: [],
    edith: []
  });
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(voiceOptions[0]);
  const { apiKey, saveApiKey, sendMessage, isProcessing, hasApiKey } = useOpenAI();

  useEffect(() => {
    // Monitor speech synthesis
    const checkSpeaking = setInterval(() => {
      setIsSpeaking(window.speechSynthesis?.speaking || false);
    }, 100);

    return () => clearInterval(checkSpeaking);
  }, []);

  const handleCommand = async (command: string) => {
    const userMessage: Message = { role: 'user', content: command };
    const voiceKey = selectedVoice.id as keyof MessagesByVoice;
    const currentMessages = messagesByVoice[voiceKey];
    
    setMessagesByVoice(prev => ({
      ...prev,
      [voiceKey]: [...prev[voiceKey], userMessage]
    }));

    const response = await sendMessage(command, currentMessages, selectedVoice);
    
    if (response) {
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessagesByVoice(prev => ({
        ...prev,
        [voiceKey]: [...prev[voiceKey], assistantMessage]
      }));
    }
  };

  const handleClearHistory = () => {
    const voiceKey = selectedVoice.id as keyof MessagesByVoice;
    setMessagesByVoice(prev => ({
      ...prev,
      [voiceKey]: []
    }));
  };

  const getAIConfig = () => {
    switch (selectedVoice.id) {
      case 'friday':
        return {
          name: 'F.R.I.D.A.Y',
          displayName: 'Friday',
          subtitle: 'Female Replacement Intelligent Digital Assistant Youth',
          gradientFrom: 'from-pink-500',
          gradientVia: 'via-pink-400',
          gradientTo: 'to-pink-500',
        };
      case 'edith':
        return {
          name: 'E.D.I.T.H',
          displayName: 'Edith',
          subtitle: 'Even Dead, I\'m The Hero',
          gradientFrom: 'from-yellow-500',
          gradientVia: 'via-yellow-400',
          gradientTo: 'to-yellow-500',
        };
      default:
        return {
          name: 'J.A.R.V.I.S',
          displayName: 'Jarvis',
          subtitle: 'Just A Rather Very Intelligent System',
          gradientFrom: 'from-primary',
          gradientVia: 'via-accent',
          gradientTo: 'to-primary',
        };
    }
  };

  const aiConfig = getAIConfig();

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="absolute inset-0"
      >
        {selectedVoice.id === 'friday' ? (
          <FridayCore isListening={isListening} isSpeaking={isSpeaking} />
        ) : selectedVoice.id === 'edith' ? (
          <EdithCore isListening={isListening} isSpeaking={isSpeaking} />
        ) : (
          <JarvisCore isListening={isListening} isSpeaking={isSpeaking} />
        )}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Voice Selector */}
      <div className="absolute top-4 right-4">
        <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
      </div>

      {/* API Key Input */}
      <ApiKeyInput onApiKeySet={saveApiKey} hasApiKey={hasApiKey} />

      {/* Chat History */}
      <ChatHistory 
        messages={messagesByVoice[selectedVoice.id as keyof MessagesByVoice]} 
        aiName={aiConfig.displayName}
        onClearHistory={handleClearHistory}
      />

      {/* Status Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          isListening ? 'bg-accent animate-pulse' :
          isSpeaking ? 'bg-primary animate-pulse' :
          'bg-muted'
        }`} />
        <span className="text-sm text-muted-foreground font-mono">
          {isListening ? 'LISTENING...' :
           isSpeaking ? 'SPEAKING...' :
           isProcessing ? 'PROCESSING...' :
           'READY'}
        </span>
      </div>

      {/* Title */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
        <h1 className={`text-6xl font-bold bg-gradient-to-r ${aiConfig.gradientFrom} ${aiConfig.gradientVia} ${aiConfig.gradientTo} bg-clip-text text-transparent animate-pulse`}>
          {aiConfig.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 font-mono">
          {aiConfig.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <VoiceInput
          onTranscript={handleCommand}
          isListening={isListening}
          setIsListening={setIsListening}
        />
        <CommandInput
          onSubmit={handleCommand}
          disabled={isProcessing || !hasApiKey}
        />
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_50%)] pointer-events-none" />
    </div>
  );
};

export default Index;
