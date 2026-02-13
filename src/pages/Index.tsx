import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3, Search, Layers, ArrowRightLeft, Link2, GitBranch, Hash,
  Network, TreePine, Type, Repeat, Sparkles,
} from "lucide-react";

const categories = [
  {
    section: "Algorithms",
    items: [
      { title: "Sorting Algorithms", description: "Bubble, Selection, Insertion, Merge & Quick Sort", icon: BarChart3, path: "/sorting", gradient: "from-primary/20 to-primary/5", borderColor: "border-primary/30", iconColor: "text-primary" },
      { title: "Searching Algorithms", description: "Linear Search & Binary Search visualized", icon: Search, path: "/searching", gradient: "from-accent/20 to-accent/5", borderColor: "border-accent/30", iconColor: "text-accent" },
      { title: "Graph Algorithms", description: "BFS, DFS & Dijkstra's shortest path", icon: Network, path: "/graph", gradient: "from-info/20 to-info/5", borderColor: "border-info/30", iconColor: "text-info" },
      { title: "Recursion & DP", description: "Fibonacci, Factorial, Knapsack, LCS", icon: Repeat, path: "/recursion-dp", gradient: "from-success/20 to-success/5", borderColor: "border-success/30", iconColor: "text-success" },
    ],
  },
  {
    section: "Data Structures",
    items: [
      { title: "Stack", description: "LIFO operations: Push, Pop & Peek", icon: Layers, path: "/stack", gradient: "from-success/20 to-success/5", borderColor: "border-success/30", iconColor: "text-success" },
      { title: "Queue", description: "FIFO operations: Enqueue & Dequeue", icon: ArrowRightLeft, path: "/queue", gradient: "from-info/20 to-info/5", borderColor: "border-info/30", iconColor: "text-info" },
      { title: "Linked List", description: "Insert, Delete & Traverse nodes", icon: Link2, path: "/linked-list", gradient: "from-warning/20 to-warning/5", borderColor: "border-warning/30", iconColor: "text-warning" },
      { title: "Binary Tree", description: "BST traversals: Inorder, Preorder, Postorder, Level-order", icon: GitBranch, path: "/binary-tree", gradient: "from-primary/20 to-accent/5", borderColor: "border-primary/30", iconColor: "text-primary" },
      { title: "Heap", description: "Min/Max Heap: Insert, Extract & Heapify", icon: TreePine, path: "/heap", gradient: "from-accent/20 to-primary/5", borderColor: "border-accent/30", iconColor: "text-accent" },
      { title: "Trie", description: "Prefix tree: Insert & Search words", icon: Type, path: "/trie", gradient: "from-info/20 to-primary/5", borderColor: "border-info/30", iconColor: "text-info" },
      { title: "Hash Table", description: "Hashing, collisions & separate chaining", icon: Hash, path: "/hash-table", gradient: "from-accent/20 to-info/5", borderColor: "border-accent/30", iconColor: "text-accent" },
    ],
  },
];

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" /> Interactive Visual Learning Platform
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl md:text-5xl font-bold tracking-tight">
          Data Structures &{" "}
          <span className="text-primary glow-text-primary">Algorithms</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-3 text-lg max-w-xl">
          Interactive visualizations to help you understand DSA concepts intuitively. Pick a topic below to get started.
        </motion.p>
      </div>

      {/* Sections */}
      {categories.map((cat, sIdx) => (
        <div key={cat.section} className="mb-8">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + sIdx * 0.05 }} className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            {cat.section}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((item, i) => (
              <motion.div key={item.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + sIdx * 0.05 + i * 0.04 }}>
                <Link to={item.path} className={`block rounded-xl border ${item.borderColor} bg-gradient-to-br ${item.gradient} p-5 hover:scale-[1.02] transition-all duration-300 group`}>
                  <item.icon className={`w-8 h-8 ${item.iconColor} mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Algorithms", value: "10+" },
          { label: "Data Structures", value: "7+" },
          { label: "Visualizations", value: "Interactive" },
          { label: "Cost", value: "Free" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
