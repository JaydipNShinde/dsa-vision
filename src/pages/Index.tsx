import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Layers,
  ArrowRightLeft,
  Link2,
  GitBranch,
  Hash,
} from "lucide-react";

const categories = [
  {
    title: "Sorting Algorithms",
    description: "Bubble, Selection, Insertion, Merge & Quick Sort",
    icon: BarChart3,
    path: "/sorting",
    gradient: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
  },
  {
    title: "Searching Algorithms",
    description: "Linear Search & Binary Search visualized",
    icon: Search,
    path: "/searching",
    gradient: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
    iconColor: "text-accent",
  },
  {
    title: "Stack",
    description: "LIFO operations: Push, Pop & Peek",
    icon: Layers,
    path: "/stack",
    gradient: "from-success/20 to-success/5",
    borderColor: "border-success/30",
    iconColor: "text-success",
  },
  {
    title: "Queue",
    description: "FIFO operations: Enqueue & Dequeue",
    icon: ArrowRightLeft,
    path: "/queue",
    gradient: "from-info/20 to-info/5",
    borderColor: "border-info/30",
    iconColor: "text-info",
  },
  {
    title: "Linked List",
    description: "Insert, Delete & Traverse nodes",
    icon: Link2,
    path: "/linked-list",
    gradient: "from-warning/20 to-warning/5",
    borderColor: "border-warning/30",
    iconColor: "text-warning",
  },
  {
    title: "Binary Tree",
    description: "Tree traversals: Inorder, Preorder, Postorder",
    icon: GitBranch,
    path: "/binary-tree",
    gradient: "from-primary/20 to-accent/5",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
  },
  {
    title: "Hash Table",
    description: "Hashing, collisions & chaining",
    icon: Hash,
    path: "/hash-table",
    gradient: "from-accent/20 to-primary/5",
    borderColor: "border-accent/30",
    iconColor: "text-accent",
  },
];

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          Data Structures &{" "}
          <span className="text-primary glow-text-primary">Algorithms</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-3 text-lg max-w-xl"
        >
          Interactive visualizations to help you understand DSA concepts intuitively.
          Pick a topic below to get started.
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link
              to={cat.path}
              className={`block rounded-xl border ${cat.borderColor} bg-gradient-to-br ${cat.gradient} p-5 hover:scale-[1.02] transition-all duration-300 group`}
            >
              <cat.icon className={`w-8 h-8 ${cat.iconColor} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 grid grid-cols-3 gap-4"
      >
        {[
          { label: "Algorithms", value: "7+" },
          { label: "Data Structures", value: "5+" },
          { label: "Visualizations", value: "Interactive" },
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
