import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you build your form. Try asking me to "Create a text field called City in Personal Information".',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await response.json();
      let reply = data.message;
      if (!reply) {
        if (data.toolResults && data.toolResults.length > 0) {
          reply = 'Done! I have executed your request successfully.';
        } else {
          reply = "I'm sorry, I couldn't process that request.";
        }
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error connecting to the server.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      )}

      <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
        <SheetContent
          side="right"
          className="w-full sm:w-[380px] p-0 flex flex-col"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>

              <div>
                <SheetTitle>AI Form Assistant</SheetTitle>

                <p className="text-xs text-muted-foreground">
                  Online & ready
                </p>
              </div>
            </div>
          </SheetHeader>


          <Card className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <Card
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-brand-purple text-white rounded-br-none'
                    : 'bg-brand-border/40 text-brand-dark border border-brand-border rounded-bl-none'
                    }`}
                >
                  {msg.content}
                </Card>
              </div>
            ))}


            {isLoading && (
              <Card>
                <CardContent className="flex items-center gap-2 p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </CardContent>
              </Card>

            )}
            <div ref={messagesEndRef} />
          </Card>


          <Card className="rounded-none border-x-0 border-b-0">
            <CardDescription className="p-4">
              <CardContent className="flex items-center gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />

                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </CardContent>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                AI may make mistakes. Please verify critical actions.
              </p>
            </CardDescription>
          </Card>

        </SheetContent>
      </Sheet>
    </>
  );
};