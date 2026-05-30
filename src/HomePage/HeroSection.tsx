import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Target } from 'lucide-react';
import heroImage from '@/assets/assets/hero-students-ai.jpg';
const HeroSection = () => {
  return <section id="home" className="min-h-screen pt-16 bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-primary font-semibold">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block animate-fade-in text-3xl font-semibold">Level Up with our AI 🏆</span>
                <span className="block animate-fade-in animation-delay-300 text-gradient-hero">Be Top 3 Student</span>
                <span className="inline-block animate-bounce animation-delay-600 ml-4"></span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">Be Top 3 Student of your class with AI-powered quizzes, unlock achievements, and climb the leaderboard! Get instant answers, track your progress, and level up your Computer Science skills — faster than ever.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                <Zap className="h-5 w-5 mr-2" />
                Start Quiz Practice
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <Target className="h-5 w-5 mr-2" />
                Try AI Study Chat
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5,000+</div>
                <div className="text-sm text-muted-foreground">Computer Science Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">25,000+</div>
                <div className="text-sm text-muted-foreground">AI Quiz Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img src={heroImage} alt="Students learning with AI technology" className="w-full h-auto rounded-2xl shadow-strong" />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-warning text-white p-3 rounded-xl shadow-medium float">
                <div className="text-lg font-bold">💻 Beginner to Professional Level!</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-gradient-card p-4 rounded-xl shadow-medium float-delayed">
                <div className="text-sm text-muted-foreground">Let's Learn Together</div>
                <div className="text-lg font-bold text-primary">🏆 Expert AI Chatbot</div>
                <div className="text-xs text-muted-foreground">Quizzes to Practice</div>
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-2xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;