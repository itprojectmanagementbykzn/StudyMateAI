import { Helmet } from "react-helmet-async";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Menu, BookOpen, Brain, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const CSoverallProgressValue = useSelector(
    (state: RootState) => state.csoverallprogress.computerScience
  );

  // State to handle mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      <Helmet>
        <title>AI Study Dashboard | Assistant AI</title>
        <meta
          name="description"
          content="Track learning progress and chat with an AI tutor on the Assistant AI study dashboard."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 h-full bg-gray-900 z-40 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Topbar />

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden fixed top-4 left-4 z-[60] bg-primary text-white p-2 rounded-md shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <main className="container py-6 space-y-8">
            {/* Header */}
            <section className="relative overflow-hidden rounded-2xl border shadow-md p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Study Mate AI
              </h1>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">
                Your personalized AI tutor to track progress and prepare smarter 📚
              </p>
            </section>

            {/* Progress + Upcoming Subjects */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress */}
<Card className="lg:col-span-2 shadow-md rounded-xl">
  <CardHeader>
    <CardTitle>📊 Learning Progress</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Computer Science", value: CSoverallProgressValue, available: true },
        { label: "Fashion Illustration", value: 0, available: false },
        { label: "Fashion Design", value: 0, available: false },
        { label: "Fashion Business", value: 0, available: false },
      ].map((s) => (
        <div
          key={s.label}
          className={`rounded-lg border p-4 shadow-sm ${
            s.available
              ? "bg-white"
              : "bg-muted/40 border-dashed opacity-60 cursor-not-allowed"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              {s.label}
              {!s.available && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-300 text-gray-600">
                  Coming Soon
                </span>
              )}
            </span>
            <span
              className={`text-sm ${
                s.available ? "text-muted-foreground" : "text-gray-400"
              }`}
            >
              {s.available ? `${s.value}%` : "--"}
            </span>
          </div>
          {s.available ? (
            <Progress value={s.value} />
          ) : (
            <div className="h-2 w-full bg-gray-200 rounded-full" />
          )}
        </div>
      ))}
    </div>
  </CardContent>
</Card>


              {/* Upcoming Subjects */}
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle>📖 Upcoming Subjects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Pattern Making", status: "Coming soon" },
                    { name: "Textile Science", status: "Coming soon" },
                    { name: "Fashion Marketing", status: "Coming soon" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Upcoming Quizzes */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-md rounded-xl bg-gradient-to-r from-indigo-50 to-white">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-indigo-700 text-xl">
      🚀 Welcome to Assistant AI (v1.0)
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
    <p>
      We’re excited to launch the <span className="font-semibold">first version</span> of our learning platform!  
      This website is designed to make your study journey easier, smarter, and more interactive.
    </p>

    <ul className="list-disc pl-6 space-y-2 text-sm">
      <li>
        📚 Learn <span className="font-medium text-indigo-600">basic Computer Science</span> and popular 
        <span className="font-medium text-indigo-600"> programming languages</span>.
      </li>
      <li>
        🤖 An <span className="font-medium">AI assistant</span> will be with you throughout your learning process, helping you whenever you need.
      </li>
      <li>
        📝 At the end of every chapter, take interactive quizzes to test your knowledge.
      </li>
      <li>
        🎯 Two types of quizzes available:  
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>✅ <span className="font-medium">Practice Quizzes</span> – Take as much time as you like after each chapter.</li>
          <li>🏆 <span className="font-medium">Test Quizzes</span> – Earn a score and level up your progress bar.</li>
        </ul>
      </li>
      <li>
        🔄 Quizzes are <span className="font-semibold">AI-generated</span>, meaning they’re fresh and unique every time.
      </li>
    </ul>

    <div className="pt-4">
      <Button className="rounded-lg shadow-md" onClick={() => navigate("/lessons")}>
        Start Learning Now
      </Button>
    </div>
  </CardContent>
</Card>
              {/* AI Assistant Placeholder */}
              <Card className="shadow-md rounded-xl bg-gradient-to-br from-secondary/20 via-background to-accent/10">
                <CardHeader>
                  <CardTitle>🤖 AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with your AI tutor for instant help with quizzes and study
                    plans.
                  </p>
                  <Button className="w-full" onClick={() => navigate("/aichat")}>
                    Open Chat
                  </Button>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
