import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Bot, BookOpen, TrendingUp } from 'lucide-react';
import dashboardImage from '@/assets/assets/dashboard-screenshot.png';
import subjectsImage from '@/assets/assets/subjects-screenshot.png';
import aiAssistantImage from '@/assets/assets/ai-assistant-screenshot.png';
import aiQuizzesImage from '@/assets/assets/ai-quizzes-screenshot.png';
const PlatformShowcase = () => {
  const features = [{
    icon: BarChart3,
    title: 'Smart Dashboard',
    description: 'Track your study streak, total time, and achievements in one place',
    image: dashboardImage,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  }, {
    icon: BookOpen,
    title: 'Subject Progress',
    description: 'Monitor your learning progress across all CS subjects with detailed analytics',
    image: subjectsImage,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },

  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Get instant help with your Computer Science questions and access study tools',
    image: aiAssistantImage,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },

  {
      icon: Bot,
      title: 'AI Quizzes',
      description: 'Get instant help with your Computer Science Quizzes and access practice tools',
      image: aiQuizzesImage,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }



  ];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Success</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in your Computer Science studies
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Button variant="outline" size="lg">
                    Learn More
                    <TrendingUp className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <Card className="p-2 bg-gradient-card border-none shadow-strong">
                    <img src={feature.image} alt={feature.title} className="w-full h-auto rounded-lg" />
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default PlatformShowcase;