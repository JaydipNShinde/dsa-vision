import { motion } from "framer-motion";
import { Binary, BookOpen, Users, Zap, Target, Award, Code2, GraduationCap } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Comprehensive Coverage", desc: "From basic sorting to advanced graphs — every DSA concept visualized." },
  { icon: Zap, title: "Interactive Animations", desc: "Step-by-step animations with speed control to learn at your own pace." },
  { icon: Target, title: "Custom Input", desc: "Enter your own data to test and understand edge cases." },
  { icon: Code2, title: "Complexity Analysis", desc: "Time & space complexity for every algorithm with best/worst cases." },
  { icon: Users, title: "Beginner Friendly", desc: "Clear explanations, real-world analogies, and step-by-step breakdowns." },
  { icon: Award, title: "No Backend Needed", desc: "Everything runs in your browser — fast, private, and always available." },
];

const team = [
  { name: "DSA Viz Team", role: "Full Stack Developers", desc: "Passionate about making DSA accessible to everyone through visual learning." },
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Binary className="w-4 h-4" />
          About DSA Viz
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Learn DSA the <span className="text-primary glow-text-primary">Visual</span> Way
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          DSA Viz is an interactive platform designed to help students and developers understand 
          Data Structures & Algorithms through beautiful, step-by-step visualizations. 
          No more memorizing — start understanding.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">Our Mission</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          We believe that anyone can master Data Structures and Algorithms with the right tools. 
          Traditional textbooks and lecture slides make DSA feel abstract and intimidating. 
          Our platform bridges that gap by turning complex concepts into interactive visual experiences. 
          Whether you're preparing for coding interviews, competitive programming, or university exams — 
          DSA Viz makes learning engaging, intuitive, and fun.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Why DSA Viz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <f.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What We Cover */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">What We Cover</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { cat: "Sorting", items: "Bubble, Selection, Insertion, Merge, Quick" },
            { cat: "Searching", items: "Linear Search, Binary Search" },
            { cat: "Linear DS", items: "Stack, Queue, Linked List" },
            { cat: "Non-Linear DS", items: "Binary Tree, Graph, Trie, Heap" },
            { cat: "Advanced", items: "Hash Table, Dynamic Programming" },
            { cat: "Techniques", items: "Recursion, BFS, DFS, Dijkstra" },
            { cat: "Concepts", items: "Time/Space Complexity, Big O" },
            { cat: "Coming Soon", items: "AVL Trees, Red-Black Trees, Segment Trees" },
          ].map((c) => (
            <div key={c.cat} className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs font-semibold text-primary mb-1">{c.cat}</p>
              <p className="text-[11px] text-muted-foreground">{c.items}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "10+", label: "Visualizers" },
          { value: "15+", label: "Algorithms" },
          { value: "100%", label: "Free" },
          { value: "0ms", label: "No Backend Lag" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="glass rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
