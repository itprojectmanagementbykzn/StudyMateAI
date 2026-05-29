import ChaptersComponents from "@/components/Subjects/ChapterPage";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { GradientSpotlight } from "@/components/visual/GradientSpotlight";
import StudyChat from "@/components/ai/StudyChat";

const ChaptersPage = () => {
  const { subjectname } = useParams();
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Chapters | StudyMateAI</title>
        <meta
          name="description"
          content="Browse chapters and learn with a bilingual AI tutor on StudyMateAI."
        />
      </Helmet>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="container py-6 space-y-6">
            <section className="relative overflow-hidden rounded-xl border p-6 bg-card">
              <GradientSpotlight />
              <h1 className="text-2xl md:text-3xl font-semibold">
                Chapters & Lessons
              </h1>
              <p className="text-muted-foreground mt-1">
                Pick a chapter to start learning, or ask the AI tutor for help.
              </p>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChaptersComponents subjectname={subjectname ?? ""} />
              </div>
              <div className="lg:col-span-1">
                <StudyChat className="h-[600px] sticky top-20" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;
