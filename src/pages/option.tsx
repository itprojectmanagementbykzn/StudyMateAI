import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiBook, FiZap, FiLayers } from "react-icons/fi";

const OptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapter");
  const topic = searchParams.get("topic");

  const cards = [
    {
      title: "Basic",
      desc: "Test your knowledge with foundational questions.",
      cta: "Start Quiz",
      icon: <FiBook className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Advanced",
      desc: "Challenge yourself with more difficult problems.",
      cta: "Start Quiz",
      icon: <FiZap className="h-6 w-6 text-red-500" />,
    },
    {
      title: "Pro",
      desc: "Mix of both levels for complete preparation.",
      cta: "Start Quiz",
      icon: <FiLayers className="h-6 w-6 text-purple-500" />,
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl p-10 sm:text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
      >
        Choose Your Quiz Mode
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center w-full max-w-6xl">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="w-full max-w-sm"
          >
            <div className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/10 pointer-events-none" />

              <div className="p-6 relative z-10">
                {/* Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  {c.icon}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {c.desc}
                </p>

                <Button
                  className="mt-4 w-full"
                  aria-label={`Start ${c.title} quiz`}
                  onClick={() =>
                    navigate(
                      `/quiz?subject=${subject}&chapter=${chapter}&topic=${topic}&option=${encodeURIComponent(
                        c.title.toLowerCase().replace(/\s+/g, "-")
                      )}`
                    )
                  }
                >
                  {c.cta}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OptionPage;
