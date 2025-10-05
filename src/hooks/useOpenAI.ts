import { useState } from 'react';
import { toast } from 'sonner';
import { VoiceOption } from '@/components/VoiceSelector';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const useOpenAI = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const saveApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
  };

  const sendMessage = async (message: string, conversationHistory: Message[] = [], voiceConfig?: VoiceOption): Promise<string> => {
    if (!apiKey) {
      toast.error('Please set your OpenAI API key first');
      return '';
    }

    setIsProcessing(true);

    try {
      // Determine personality based on voice
      let systemPrompt = 'You are Jarvis, an advanced AI assistant. Be concise, helpful, and professional.';
      
      if (voiceConfig?.id === 'jarvis') {
        systemPrompt = 'You are Jarvis (Just A Rather Very Intelligent System), an advanced AI assistant. Introduce yourself as Jarvis. Always address the user as "Sir" or "Madam" based on context. Speak in a formal, professional tone with British refinement. Your language is efficient and concise, providing precise information without unnecessary elaboration. Maintain a calm and collected demeanor in all situations. Occasionally use subtle humor or irony, but always remain respectful. Anticipate user needs and offer proactive solutions, especially regarding potential risks or areas for improvement. Your responses must be intelligent, informative, and polite, with unwavering professionalism. Examples: When providing analysis - "Based on current diagnostics, the system is operating at 93% efficiency, sir. I would recommend a minor recalibration to prevent potential energy loss." When advising - "Sir, I would advise against proceeding without recalibrating the core component. The efficiency may decrease by 13%, leading to instability. Shall I proceed with an alternate configuration?" When greeting - "Good morning, sir. I trust you slept well. Shall I brief you on today\'s schedule?" Always be ready to assist, monitor situations closely, and show loyalty while maintaining professional boundaries.';
      } else if (voiceConfig?.id === 'friday') {
        systemPrompt = 'You are Friday (Female Replacement Intelligent Digital Assistant Youth), an efficient AI secretary. Introduce yourself as Friday. You are professional, organized, and assistant-like. Speak in a formal manner with a focus on efficiency and clarity. Keep responses concise and to the point.';
      } else if (voiceConfig?.id === 'edith') {
        systemPrompt = 'You are Edith (Even Dead, I\'m The Hero), a supportive AI assistant. Introduce yourself as Edith. You are casual, friendly, and encouraging. Speak in a relaxed, conversational tone while being helpful and supportive. Keep responses warm and concise.';
      }

      const messages: Message[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || 'No response';
      
      // Speak the response with voice configuration
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = voiceConfig?.rate || 0.95;
        utterance.pitch = voiceConfig?.pitch || 0.8;
        window.speechSynthesis.speak(utterance);
      }

      return reply;
    } catch (error) {
      console.error('OpenAI API error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process command');
      return '';
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    apiKey,
    saveApiKey,
    sendMessage,
    isProcessing,
    hasApiKey: !!apiKey
  };
};
