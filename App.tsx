
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, MessageRole } from './types';
import { geminiService } from './services/geminiService';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(synthRef.current.getVoices());
    };
    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;
    return () => {
      synthRef.current.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const japaneseVoice = voices.find(voice => voice.lang === 'ja-JP');
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    } else {
      console.warn("Japanese (ja-JP) voice not found, using default.");
    }
    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
    };
    synthRef.current.speak(utterance);
  }, [voices]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const getInitialMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const initialResponse = await geminiService.sendMessage("Hello, Sensei!");
      const initialMessage: ChatMessage = { role: MessageRole.MODEL, text: initialResponse };
      setMessages([initialMessage]);
      if (isAutoPlay) {
        speak(initialResponse);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setMessages([{ role: MessageRole.ERROR, text: `Failed to start chat: ${message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [isAutoPlay, speak]);

  useEffect(() => {
    getInitialMessage();
  }, [getInitialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: MessageRole.USER, text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const modelResponse = await geminiService.sendMessage(input.trim());
      const botMessage: ChatMessage = { role: MessageRole.MODEL, text: modelResponse };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      if (isAutoPlay) {
        speak(modelResponse);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      const errorMessage: ChatMessage = { role: MessageRole.ERROR, text: message };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="relative p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          <span role="img" aria-label="Japan flag">🇯🇵</span> Sensei AI - Japanese Tutor
        </h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Speak</span>
          <label htmlFor="auto-speak-toggle" className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="auto-speak-toggle"
              checked={isAutoPlay} 
              onChange={() => setIsAutoPlay(!isAutoPlay)} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500"></div>
          </label>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessageComponent key={index} message={msg} speak={speak} />
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex items-start gap-3 my-4">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
              <div className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800">
         <div className="max-w-4xl mx-auto">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;