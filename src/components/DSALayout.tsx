import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Layers,
  ArrowRightLeft,
  Link2,
  Home,
  TreePine,
  Hash,
  Binary,
  GitBranch,
} from "lucide-react";

const navItems = [
  { title: "Home", path: "/", icon: Home },
  { title: "Sorting", path: "/sorting", icon: BarChart3 },
  { title: "Searching", path: "/searching", icon: Search },
  { title: "Stack", path: "/stack", icon: Layers },
  { title: "Queue", path: "/queue", icon: ArrowRightLeft },
  { title: "Linked List", path: "/linked-list", icon: Link2 },
  { title: "Binary Tree", path: "/binary-tree", icon: GitBranch },
  { title: "Hash Table", path: "/hash-table", icon: Hash },
];

export default function DSALayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/40 backdrop-blur-sm flex flex-col shrink-0">
        <Link to="/" className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Binary className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              DSA <span className="text-primary">Viz</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Visualize & Learn</p>
        </Link>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              Built with <span className="text-primary">♥</span> for learning DSA
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
