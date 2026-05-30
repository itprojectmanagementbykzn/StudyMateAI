import { Helmet } from "react-helmet-async";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/redux/store";
import { fetchQuizQuestions, type QuizQuestion } from "@/lib/quiz";

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useSelector((s: RootState) => s.language.language);

  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");
  const topic = searchParams.get("topic");
  const option = searchParams.get("option");

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const hasContext = Boolean(topic);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    setUserAnswers({});
    try {
      const data = await fetchQuizQuestions({
        subject,
        chapter,
        topic,
        option,
        language,
      });
      setQuestions(data);
      if (data.length === 0) {
        setError(
          language === "my"
            ? "မေးခွန်းများ မရရှိပါ။ ထပ်မံကြိုးစားကြည့်ပါ။"
            : "No questions were returned. Please try again."
        );
      }
    } catch (err) {
      const description =
        err instanceof Error ? err.message : "Failed to load the quiz.";
      setError(description);
      toast({ title: "Quiz error", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex: number, choice: string) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: choice }));
  };

  const correctCount = questions.reduce(
    (count, q, idx) => (userAnswers[idx] === q.answer ? count + 1 : count),
    0
  );
  const scorePercent =
    questions.length > 0
      ? ((correctCount / questions.length) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Quiz | StudyMateAI</title>
      </Helmet>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="container py-6 space-y-6">
            <section className="rounded-xl border p-6 bg-card shadow-sm">
              <h1 className="text-2xl font-bold">Topic Quiz</h1>
              {hasContext ? (
                <>
                  <p className="text-muted-foreground mt-2">
                    Test your knowledge on this topic.
                  </p>
                  <Button
                    onClick={fetchQuiz}
                    disabled={loading}
                    className="mt-4"
                  >
                    {loading
                      ? language === "my"
                        ? "ဖွင့်နေသည်..."
                        : "Loading..."
                      : "📋 Take Quiz"}
                  </Button>
                </>
              ) : (
                <div className="mt-2 space-y-3">
                  <p className="text-muted-foreground">
                    Pick a topic from your lessons to start a quiz.
                  </p>
                  <Button onClick={() => navigate("/lessons")}>
                    Go to Lessons
                  </Button>
                </div>
              )}
            </section>

            {error && (
              <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </section>
            )}

            {questions.length > 0 && (
              <section className="space-y-6">
                {questions.map((q, i) => {
                  const isCorrect = q.answer === userAnswers[i];
                  return (
                    <Card key={i} className="border rounded-lg shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {i + 1}. {q.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {q.options.map((opt, j) => {
                          const isSelected = userAnswers[i] === opt;
                          const isRightAnswer = q.answer === opt;
                          return (
                            <button
                              key={j}
                              onClick={() => handleSelect(i, opt)}
                              disabled={showResults}
                              className={`block w-full text-left p-3 rounded-md border transition-all
                                ${isSelected ? "border-blue-500 bg-blue-50" : "border"}
                                ${showResults && isRightAnswer ? "bg-green-100 border-green-500" : ""}
                                ${showResults && isSelected && !isRightAnswer ? "bg-red-100 border-red-400" : ""}
                              `}
                            >
                              {opt}
                            </button>
                          );
                        })}

                        {showResults && (
                          <div
                            className={`text-sm mt-2 ${isCorrect ? "text-green-600" : "text-red-500"}`}
                          >
                            {isCorrect
                              ? "✅ Correct"
                              : `❌ Correct answer: ${q.answer}`}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {!showResults ? (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowResults(true)}
                      className="mt-4"
                    >
                      Check Answers
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border p-6 bg-muted">
                    <h2 className="text-xl font-semibold">📊 Results</h2>
                    <p className="mt-2 text-base">
                      You got <strong>{correctCount}</strong> out of{" "}
                      <strong>{questions.length}</strong> correct.
                    </p>
                    <p className="text-muted-foreground">
                      Score: {scorePercent}%
                    </p>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
