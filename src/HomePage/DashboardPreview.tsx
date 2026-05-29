import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, BookOpen, Clock, Target, ArrowRight, BarChart3 } from 'lucide-react';
const DashboardPreview = () => {
  const stats = [{
    label: 'Lessons Completed',
    value: '24',
    icon: BookOpen,
    color: 'text-primary'
  }, {
    label: 'Study Time',
    value: '12h 30m',
    icon: Clock,
    color: 'text-secondary'
  }, {
    label: 'Average Score',
    value: '87%',
    icon: Target,
    color: 'text-accent'
  }, {
    label: 'Improvement',
    value: '+25%',
    icon: TrendingUp,
    color: 'text-success'
  }];
  const subjects = [{
    name: 'Fashion Illustration',
    progress: 75,
    nextLesson: 'Figure Proportions',
    improvement: '+15%'
  }, {
    name: 'Fashion Design',
    progress: 60,
    nextLesson: 'Draping Basics',
    improvement: '+8%'
  }, {
    name: 'Fashion Business',
    progress: 90,
    nextLesson: 'Retail Merchandising',
    improvement: '+12%'
  }, {
    name: 'Textile Science',
    progress: 45,
    nextLesson: 'Fabric Types',
    improvement: '+20%'
  }];
  return <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Personal Learning Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your progress, track performance, and stay motivated with detailed insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return <Card key={index} className="p-6 text-center border-none shadow-elegant bg-card/60 backdrop-blur">
              <CardContent className="p-0 space-y-2">
                <IconComponent className={`h-8 w-8 mx-auto ${stat.color}`} />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>;
        })}
        </div>

        {/* Subject Progress */}
        <Card className="p-8 bg-gradient-subtle border-none shadow-elegant">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              Subject Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              {subjects.map((subject, index) => <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{subject.name}</h4>
                    <span className="text-sm text-success font-medium">{subject.improvement}</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{subject.progress}% Complete</span>
                    <span>Next: {subject.nextLesson}</span>
                  </div>
                </div>)}
            </div>
            <div className="mt-8 text-center">
              <Button variant="hero" size="lg">
                <Target className="h-5 w-5 mr-2" />
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default DashboardPreview;
