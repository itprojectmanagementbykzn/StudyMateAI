import { Helmet } from "react-helmet-async";
import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientSpotlight } from "@/components/visual/GradientSpotlight";
import StudyChat from "@/components/ai/StudyChat";
import ExplainInBurmese from "@/components/ai/ExplainInBurmese";
import { setLatestLesson } from "@/redux/latestlession.slice";
import { type LessonContext } from "@/lib/gemini";
/* Chapter content */
import ChapterOnePage from "@/components/ComputerScience/Chapter1";
import ChapterTwoPage from "@/components/ComputerScience/Chapter2";
import ChapterThreePage from "@/components/ComputerScience/Chapter3";
import ChapterFourPage from "@/components/ComputerScience/Chapter4";
import ChapterFivePage from "@/components/ComputerScience/Chapter5";
import ChapterSixPage from "@/components/ComputerScience/Chapter6";
import ChapterOnePageFE from "@/components/ComputerScience/FrontendDev/Chapter1FE";
import ChapterTwoPageFE from "@/components/ComputerScience/FrontendDev/Chapter2FE";
import ChapterThreePageFE from "@/components/ComputerScience/FrontendDev/Chapter3FE";
import ChapterFourPageFE from "@/components/ComputerScience/FrontendDev/Chapter4FE";

// Lesson content keyed by sub-subject slug (from the route) then chapter number.
// Backend chapters have no content yet, so they fall through to a placeholder.
const contentBySubsubject: Record<string, Record<string, ReactNode>> = {
  javascript: {
    "1": <ChapterOnePage />,
    "2": <ChapterTwoPage />,
    "3": <ChapterThreePage />,
    "4": <ChapterFourPage />,
    "5": <ChapterFivePage />,
    "6": <ChapterSixPage />,
  },
  "frontend-development": {
    "1": <ChapterOnePageFE />,
    "2": <ChapterTwoPageFE />,
    "3": <ChapterThreePageFE />,
    "4": <ChapterFourPageFE />,
  },
};

const parseTopics = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [String(raw)];
  } catch {
    return [raw];
  }
};

const CSChapterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subsubject, chapter } = useParams();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject");
  const chaptername = searchParams.get("chaptername");
  const topicParam = searchParams.get("topic");
  const option = searchParams.get("option");

  const chapterNo = chapter ?? "";
  const topics = parseTopics(topicParam);

  const lessonContext: LessonContext = {
    title: chaptername ?? "Lesson",
    chapter: chapterNo,
    subject: subject ?? "Computer Science",
  };

  // Keep the AI tutor's context in sync with the chapter being viewed.
  useEffect(() => {
    dispatch(
      setLatestLesson({
        subject: subject ?? "Computer Science",
        chapter: Number(chapterNo) || 0,
        title: chaptername ?? "Lesson",
        topic: topics.length ? topics : [chaptername ?? "Lesson"],
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, chaptername, topicParam, chapterNo]);

  const content = contentBySubsubject[subsubject ?? ""]?.[chapterNo] ?? (
    <p className="text-muted-foreground">Lesson content coming soon.</p>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${chaptername ?? "Chapter"} | StudyMateAI`}</title>
        <meta
          name="description"
          content="Learn with interactive lessons and a bilingual AI tutor on StudyMateAI."
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
                {chaptername ?? "Chapter"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Chapter {chapterNo} • {subject ?? "Computer Science"}
              </p>
              {topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topics.map((t, i) => (
                    <ExplainInBurmese key={i} topic={t} lesson={lessonContext} />
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {content}

                <Card>
                  <CardHeader>
                    <CardTitle>Chapter {chapterNo} Quiz</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{chaptername}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {topics.map((t, i) => (
                          <Badge key={i} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(
                          `/finalquiz?subject=${subject}&chapter=${chapterNo}&chaptername=${chaptername}&topic=${encodeURIComponent(
                            topicParam ?? ""
                          )}&option=${option}`
                        )
                      }
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
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

export default CSChapterPage;
