import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Search, Layers, ArrowRightLeft, Link2, Home, Hash, Binary,
  GitBranch, Network, TreePine, Type, Repeat, Info, Mail, Menu, X, ChevronDown, ChevronRight,
} from "lucide-react";

const sections = [
  {
    title: "General",
    items: [
      { title: "Home", path: "/", icon: Home },
      { title: "About", path: "/about", icon: Info },
      { title: "Contact", path: "/contact", icon: Mail },
    ],
  },
  {
    title: "Algorithms",
    items: [
      { title: "Sorting", path: "/sorting", icon: BarChart3 },
      { title: "Searching", path: "/searching", icon: Search },
      { title: "Graph (BFS/DFS)", path: "/graph", icon: Network },
      { title: "Recursion & DP", path: "/recursion-dp", icon: Repeat },
    ],
  },
  {
    title: "Data Structures",
    items: [
      { title: "Stack", path: "/stack", icon: Layers },
      { title: "Queue", path: "/queue", icon: ArrowRightLeft },
      { title: "Linked List", path: "/linked-list", icon: Link2 },
      { title: "Binary Tree", path: "/binary-tree", icon: GitBranch },
      { title: "Heap", path: "/heap", icon: TreePine },
      { title: "Trie", path: "/trie", icon: Type },
      { title: "Hash Table", path: "/hash-table", icon: Hash },
    ],
  },
];

export default function DSALayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => setCollapsed((p) => ({ ...p, [title]: !p[title] }));

  const navContent = (
    <>
      <Link to="/" className="p-5 border-b border-border block" onClick={() => setMobileOpen(false)}>
        <div className="flex items-center gap-2">
          <Binary className="w-7 h-7 text-primary" />
          <span className="text-lg font-bold text-foreground tracking-tight">
            DSA <span className="text-primary">Viz</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Visualize & Learn DSA</p>
      </Link>

      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {sections.map((section) => {
          const isCollapsed = collapsed[section.title];
          const hasActive = section.items.some((i) => location.pathname === i.path);
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {section.title}
                {hasActive && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto" />}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-primary">♥</span> for learning DSA
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">10+ Visualizers • 15+ Algorithms</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-card/40 backdrop-blur-sm flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Binary className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">DSA <span className="text-primary">Viz</span></span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col">
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:h-screen">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 pt-20 md:pt-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
