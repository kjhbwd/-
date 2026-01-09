import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Clock, Languages } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [japanTime, setJapanTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setJapanTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-jp font-bold text-xl tracking-tighter">
            <span className="w-8 h-8 rounded-full bg-[#bc002d] flex items-center justify-center text-white text-sm">
              JP
            </span>
            <span>TabiPlan</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className={cn(
              "text-sm font-medium transition-colors hover:text-[#bc002d]",
              location === "/" ? "text-[#bc002d]" : "text-muted-foreground"
            )}>
              Dashboard
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-full border border-black/5">
              <Clock className="w-3.5 h-3.5 text-[#bc002d]" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Tokyo Time</span>
                <span className="text-sm font-bold text-black/80 tabular-nums">{japanTime}</span>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-8 mt-12 bg-white/50">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 TabiPlan. Personal Japan Guide.</p>
        </div>
      </footer>

      {/* Floating Papago Button */}
      <a 
        href="https://papago.naver.com/?sk=ko&tk=ja"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] flex items-center gap-2 px-6 py-4 bg-[#00c73c] text-white rounded-full shadow-2xl shadow-[#00c73c]/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
          <Languages className="w-6 h-6" />
        </div>
        <span className="text-lg font-black tracking-tight">파파고 번역기</span>
      </a>
    </div>
  );
}
