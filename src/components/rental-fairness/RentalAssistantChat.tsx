
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface RentalAssistantChatProps {
  propertyId: string;
  propertyName: string;
  address: string;
}

const RentalAssistantChat: React.FC<RentalAssistantChatProps> = ({
  propertyId,
  propertyName,
  address
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your Rental Property Assistant. I can help answer questions about ${propertyName} located at ${address}. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call to backend API or Edge Function
      const response = await fetch('/api/rental-fairness-gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          propertyId,
          propertyName,
          address,
          history: messages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t generate a response at this time.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error",
        description: `Failed to get a response: ${(error as Error).message}`,
        variant: "destructive"
      });

      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-md">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-center mb-1">
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 mr-2" />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-2" />
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Ask a question about this property..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-12 min-h-[80px]"
          disabled={isLoading}
        />
        <Button 
          className="absolute right-2 bottom-2" 
          size="sm"
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default RentalAssistantChat;
