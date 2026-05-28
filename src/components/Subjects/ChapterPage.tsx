import React, { useEffect } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectDataType } from "../SubjectData/ComputerScience/CSData";
import ComputerScienceData from "../SubjectData/ComputerScience/CSData";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useDispatch } from "react-redux";
import { setLatestLesson } from "@/redux/latestlession.slice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetProgressQuery } from "@/api/Subject/csprogress.api";

interface SubjectProp {
  subjectname: string;
}

interface SubProgessType {
  userId: string;
  progress: {
    [courseName: string]: number[];
  };
}

const ChaptersComponent: React.FC<SubjectProp> = ({ subjectname }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    data: ComputerSciencProgess,
    isLoading,
    isError,
  } = useGetProgressQuery();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  if (isLoading) return <p>Loading progress...</p>;
  if (isError || !ComputerSciencProgess) return <p>Failed to load progress.</p>;

  const SubData: SubjectDataType = ComputerScienceData;
  const SubProgress: SubProgessType = ComputerSciencProgess;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        {SubData.subject} - Chapters
      </h1>

      <div className="space-y-4">
        {SubData.subSubject.map((subsubdata) => {
          const completedChapter =
            SubProgress.progress.progress[subsubdata.name] || [];

          return (
            <div
              key={subsubdata.name}
              id={subsubdata.name.replace(/\s+/g, "-")}
            >
              <div className="text-xl md:text-2xl font-semibold mb-2">
                {subsubdata.name}
              </div>

              {subsubdata.chapter.map((chapter) => {
                const isUnlocked =
                  chapter.chapter === 1 ||
                  completedChapter.includes(chapter.chapter) ||
                  completedChapter.includes(chapter.chapter - 1);

                const isCompleted = completedChapter.includes(chapter.chapter);

                return (
                  <Card
                    key={chapter.chapter}
                    className={`transition-all duration-200 ${
                      isUnlocked
                        ? "hover:shadow-lg cursor-pointer"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <CardHeader
                      onClick={() => {
                        const cardtopic = encodeURIComponent(
                          JSON.stringify(chapter.content)
                        );
                        if (isUnlocked)
                          navigate(
                            `${chapter.route}?chapter=${chapter.chapter}&subject=${subjectname}&chaptername=${subsubdata.name}&topic=${cardtopic}&option=intermediate`
                          );
                      }}
                      className="flex flex-row justify-between items-center space-y-0 pb-2"
                    >
                      <CardTitle className="text-lg font-semibold">
                        Chapter {chapter.chapter}: {chapter.title}
                      </CardTitle>
                      {!isUnlocked && (
                        <LockClosedIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                      {isCompleted && (
                        <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />
                      )}
                    </CardHeader>

                    <CardContent>
                      {isUnlocked ? (
                        <Accordion type="single" collapsible>
                          <AccordionItem value={`chapter-${chapter.chapter}`}>
                            <AccordionTrigger className="text-sm">
                              Topics ({chapter.content.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="pl-5 space-y-1 text-sm">
                                {chapter.content.map((topic, idx) => (
                                  <li
                                    className="p-5 border flex items-center justify-between shadow-lg"
                                    key={idx}
                                  >
                                    <p>{topic}</p>
                                    <div className="flex gap-4">
                                      {/* Quiz Button */}
                                      <div
                                        onClick={() =>
                                          navigate(
                                            `/option?subject=${subjectname}&chapter=${chapter.chapter}&topic=${topic} in ${subsubdata.name}`
                                          )
                                        }
                                        className="relative group"
                                      >
                                        <button className="text-xl">📋</button>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                                          Take Quiz
                                        </span>
                                      </div>

                                      {/* Chat Button */}
                                      <div
                                        onClick={() => {
                                          dispatch(
                                            setLatestLesson({
                                              subject: subjectname,
                                              chapter: chapter.chapter,
                                              title: chapter.title,
                                              topic: [topic],
                                            })
                                          );
                                          navigate(
                                            `/aichat?subject=${subjectname}&chapter=${chapter.chapter}&topic=${topic} in ${subsubdata.name}`
                                          );
                                        }}
                                        className="relative group"
                                      >
                                        <button className="text-xl">💬</button>
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                                          Ask AI
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <p className="text-sm">This chapter is locked.</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChaptersComponent;
