// One-click "Explain in Burmese" affordance for lesson/chapter pages.
// Asks Gemini to explain the given topic in Burmese and shows it in a dialog.
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/redux/store";
import { explainTopic, type LessonContext } from "@/lib/gemini";

interface ExplainInBurmeseProps {
  topic: string;
  lesson: LessonContext;
}

const ExplainInBurmese = ({ topic, lesson }: ExplainInBurmeseProps) => {
  const language = useSelector((s: RootState) => s.language.language);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");

  const label = language === "my" ? "မြန်မာလို ရှင်းပြပါ" : "Explain in Burmese";

  const run = async () => {
    setOpen(true);
    setLoading(true);
    setExplanation("");
    try {
      const text = await explainTopic(topic, "my", lesson);
      setExplanation(text);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Something went wrong.";
      toast({ title: "AI Error", description, variant: "destructive" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="gap-2"
        onClick={run}
        disabled={loading}
      >
        <Sparkles className="w-4 h-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>🇲🇲 {topic}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" /> ရှင်းပြနေပါသည်…
            </div>
          ) : (
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {explanation}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExplainInBurmese;
