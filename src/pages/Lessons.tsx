import { Helmet } from "react-helmet-async";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, BookOpen } from "lucide-react";
/* Lesson Progress Card */
import ComputerScienceProgressComponent from "@/components/LessonProgress/ComputerScience.progress";

const Lessons = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Helmet>
        <title>Lessons & Chapters | Assistant AI</title>
        <meta
          name="description"
          content="Browse chapters, sections, and lessons with progress circles. Start related quizzes from any lesson."
        />
        <link rel="canonical" href="/lessons" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
          })}
        </script>
      </Helmet>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 h-full bg-gray-900 text-white shadow-xl z-40 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Topbar />

          {/* Hamburger Button */}
          <button
            className="lg:hidden fixed top-4 left-4 z-[60] bg-primary text-white p-2 rounded-lg shadow-md"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <main className="container py-8 space-y-10">
            {/* Header Section */}
            <Card className="bg-gradient-to-r from-primary/10 via-background to-primary/10 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                  <BookOpen className="w-7 h-7 text-primary" />
                  Chapters & Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Track your progress, explore structured lessons, and take
                  quizzes to strengthen your knowledge.
                </p>
              </CardContent>
            </Card>

            {/* Lessons Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Computer Science Lessons */}
              <Card className="shadow-lg hover:shadow-xl transition rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Computer Science
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ComputerScienceProgressComponent />
                  <Button
                    className="mt-4 w-full"
                    onClick={() => navigate("/subject/computerscience")}
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>

              {/* Placeholder for Future Subjects */}
              <Card className="shadow-lg hover:shadow-xl transition rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    More Subjects Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay tuned for Fashion Illustration, Fashion Design, and
                    more.
                  </p>
                  <Button variant="outline" className="mt-4 w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
