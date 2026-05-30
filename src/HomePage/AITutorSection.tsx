import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Send, Sparkles, MessageCircle, Users, Brain } from 'lucide-react';

const AITutorSection = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hi! I'm your AI tutor. Ask me anything about your studies! 🤖" },
  ]);

  const sampleQuestions = [
    "Explain binary search algorithm",
    "What's the difference between stack and queue?",
    "How does recursion work?",
    "Best practices for OOP design?"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Great CS question! Let me explain that concept clearly. Based on computer science fundamentals..." 
      }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <section id="ai-tutor" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">CS Chatbot</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Personal <span className="text-gradient-hero">CS Expert Chatbot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant answers to Computer Science questions, algorithm explanations, and coding help 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* AI Chat Demo */}
          <Card className="bg-gradient-card border-0 shadow-strong">
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Live CS Chatbot Demo</span>
                </div>
                
                {/* Chat Messages */}
                <div className="space-y-3 h-40 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask any Computer Science question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="hero" size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Sample Questions */}
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Try asking:</div>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Algorithm Explanations</h3>
                  <p className="text-muted-foreground">Get complex CS concepts explained step-by-step</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Code Review</h3>
                  <p className="text-muted-foreground">Get help debugging and optimizing your code</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">24/7 CS Help</h3>
                  <p className="text-muted-foreground">Available anytime for programming and theory questions</p>
                </div>
              </div>
            </div>

            {/* Sample AI Response */}
            <Card className="bg-gradient-secondary text-white border-0">
              <CardContent className="p-4">
                <div className="text-sm opacity-90 mb-2">Sample CS Response:</div>
                <div className="font-medium">
                  "Binary search works by repeatedly dividing the search space in half. Time complexity: O(log n). 
                  Here's the algorithm: compare target with middle element, then search left or right half accordingly!"
                </div>
              </CardContent>
            </Card>

            <Button variant="hero" size="lg" className="w-full">
              Try CS Chatbot Now - Free!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITutorSection;