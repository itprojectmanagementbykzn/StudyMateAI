import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Star, Crown, Medal, Target } from 'lucide-react';
const GameifiedProgress = () => {
  const achievements = [{
    icon: Trophy,
    title: 'First Steps',
    description: 'Complete your first lesson',
    earned: true,
    color: 'text-warning'
  }, {
    icon: Star,
    title: 'Week Warrior',
    description: '7-day learning streak',
    earned: true,
    color: 'text-primary'
  }, {
    icon: Crown,
    title: 'Style Master',
    description: 'Score 90%+ in 5 fashion quizzes',
    earned: false,
    color: 'text-muted-foreground'
  }, {
    icon: Medal,
    title: 'Trend Spotter',
    description: 'Complete 3 design lessons in a day',
    earned: false,
    color: 'text-muted-foreground'
  }];
  const leaderboard = [{
    name: 'Alex Chen',
    avatar: '👨‍🎓',
    points: 2450,
    rank: 1
  }, {
    name: 'Maya Patel',
    avatar: '👩‍🎓',
    points: 2380,
    rank: 2
  }, {
    name: 'You',
    avatar: '🎯',
    points: 2120,
    rank: 3
  }];
  return <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn Achievements, Climb the Leaderboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay motivated with streaks, badges, and a bit of friendly competition.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-warning" /> Achievements
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return <Card key={index} className={`p-4 ${achievement.earned ? 'border-primary/40' : 'opacity-70'}`}>
                    <CardContent className="p-0 flex items-start gap-3">
                      <div className={`rounded-full p-2 bg-muted ${achievement.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {achievement.title}
                          {achievement.earned && <span className="text-xs text-success">Earned</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </CardContent>
                  </Card>;
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Flame className="h-5 w-5 mr-2 text-destructive" /> Leaderboard
            </h3>
            <Card className="p-4">
              <CardContent className="p-0 divide-y">
                {leaderboard.map(user => <div key={user.rank} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-6 text-center text-muted-foreground">#{user.rank}</span>
                      <span className="text-2xl">{user.avatar}</span>
                      <span className={`font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>{user.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <Target className="h-4 w-4 text-primary" /> {user.points}
                    </span>
                  </div>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default GameifiedProgress;
