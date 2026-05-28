// Reusable, layout-agnostic AI tutor chat. Reads the global language
// preference and the latest lesson context from Redux, and talks to Gemini
// through the shared helper in @/lib/gemini. Used full-screen on /aichat and
// embedded inline on the chapter pages.
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { toggleLanguage } from "@/redux/language.slice";
import { sendChat, type ChatTurn, type LessonContext } from "@/lib/gemini";

interface StudyChatProps {
  className?: string;
}

const StudyChat = ({ className }: StudyChatProps) => {
  const dispatch = useDispatch();
  const language = useSelector((s: RootState) => s.language.language);
  const latestLesson = useSelector((s: RootState) => s.latestLesson);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const greeting =
    language === "my"
      ? "👋 မင်္ဂလာပါ! သင့်ရဲ့ နောက်ဆုံးသင်ခန်းစာအကြောင်း ဘာများ သိချင်ပါသလဲ?"
      : "👋 Hello! What would you like to explore from your last lesson?";

  const [messages, setMessages] = useState<ChatTurn[]>([
    { role: "model", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (customPrompt?: string) => {
    const prompt = (customPrompt ?? input).trim();
    if (!prompt || loading) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    const lessonContext: LessonContext = {
      title: latestLesson.title,
      chapter: latestLesson.chapter,
      subject: latestLesson.subject,
    };

    try {
      const reply = await sendChat(history, prompt, language, lessonContext);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            reply ||
            (language === "my"
              ? "တောင်းပန်ပါတယ်၊ အဖြေ မရရှိပါ။"
              : "Sorry, I couldn't generate a response."),
        },
      ]);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Something went wrong.";
      toast({ title: "AI Error", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardHeader className="bg-primary/10 px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
          <MessageSquare className="w-4 h-4" />
          StudyBuddy AI
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(toggleLanguage())}
          aria-label="Toggle language"
        >
          {language === "en" ? "မြန်မာ" : "English"}
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        <div
          ref={scrollerRef}
          className="flex-1 overflow-auto space-y-3 pr-1 rounded-lg border p-3 bg-background"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-sm whitespace-pre-line",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-accent text-accent-foreground rounded-bl-sm"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin w-4 h-4" />
              {language === "my" ? "စဉ်းစားနေသည်…" : "Thinking…"}
            </div>
          )}
        </div>

        {latestLesson?.topic?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {latestLesson.topic.map((topic: string, idx: number) => (
              <Button
                key={idx}
                onClick={() => send(topic)}
                disabled={loading}
                className="text-xs px-3 py-1 rounded-full"
                variant="secondary"
              >
                {topic}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder={
              language === "my" ? "မေးချင်တာရေးပါ…" : "Type your question…"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 rounded-full px-4"
            disabled={loading}
          />
          <Button
            onClick={() => send()}
            disabled={loading}
            className="rounded-full px-5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : language === "my" ? (
              "ပို့မည်"
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyChat;
