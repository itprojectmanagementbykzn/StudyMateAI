import { Home, BookOpen, Bot, ClipboardCheck, LogOut, Languages } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { RootState } from "@/redux/store";
import { toggleLanguage } from "@/redux/language.slice";
import { resetProgress } from "@/redux/csprogress.slice";
import { setComputerScienceProgress } from "@/redux/csoverallprogress.slice";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/aichat", label: "AI Assistant", icon: Bot },
  { to: "/quiz", label: "Quizzes", icon: ClipboardCheck },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((s: RootState) => s.language.language);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      // Clear per-user state so nothing leaks to the next sign-in on this device.
      dispatch(resetProgress());
      dispatch(setComputerScienceProgress(0));
      navigate("/auth", { replace: true });
    }
  };

  return (
    <aside className="sidebar-bg md:flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground sticky top-0">
      <div className="h-16 sidebar-bg flex items-center px-6 font-semibold tracking-tight">
        <div className="w-[50%]">
          <img src="/studymateAI.jpg" alt="Study Mate AI Logo" />
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Language toggle + Logout */}
      <div className="mt-auto px-2 pb-4 space-y-1">
        <button
          onClick={() => dispatch(toggleLanguage())}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-sidebar-accent transition-colors"
          aria-label="Toggle language"
        >
          <Languages className="h-4 w-4" />
          <span>{language === "en" ? "မြန်မာ (Burmese)" : "English"}</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
