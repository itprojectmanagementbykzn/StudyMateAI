// Full-screen AI tutor page (/aichat): sidebar + the reusable StudyChat.
import Sidebar from "../layout/Sidebar";
import StudyChat from "./StudyChat";

const MainChatbot = () => {
  return (
    <div className="flex h-screen bg-muted/20">
      <div className="hidden md:block w-64 shrink-0 border-r bg-card shadow-sm">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col p-4 min-w-0">
        <StudyChat className="flex-1" />
      </div>
    </div>
  );
};

export default MainChatbot;
