import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Eye, Info, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STACK_INFO = {
  description: "A Stack is a linear data structure that follows the LIFO (Last In, First Out) principle. Think of it like a stack of plates — you can only add or remove from the top.",
  useCases: ["Function call stack (recursion)", "Undo/Redo operations", "Expression evaluation (postfix/prefix)", "Browser back button history", "Balanced parentheses checking"],
  operations: [
    { name: "Push", desc: "Add element to top", complexity: "O(1)" },
    { name: "Pop", desc: "Remove element from top", complexity: "O(1)" },
    { name: "Peek", desc: "View top element without removing", complexity: "O(1)" },
    { name: "isEmpty", desc: "Check if stack is empty", complexity: "O(1)" },
  ],
};

export default function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([42, 17, 85]);
  const [input, setInput] = useState("");
  const [peeked, setPeeked] = useState(false);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const addHistory = (msg: string) => setHistory((p) => [msg, ...p].slice(0, 10));

  const push = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setStack((p) => [...p, val]);
    setInput("");
    setPeeked(false);
    setMessage(`Pushed ${val} onto stack`);
    addHistory(`PUSH(${val})`);
  };

  const pop = () => {
    if (stack.length === 0) { setMessage("Stack Underflow! Stack is empty."); return; }
    const val = stack[stack.length - 1];
    setStack((p) => p.slice(0, -1));
    setPeeked(false);
    setMessage(`Popped ${val} from stack`);
    addHistory(`POP() → ${val}`);
  };

  const peek = () => {
    if (stack.length === 0) { setMessage("Stack is empty! Nothing to peek."); return; }
    setPeeked(true);
    setMessage(`Top element: ${stack[stack.length - 1]}`);
    addHistory(`PEEK() → ${stack[stack.length - 1]}`);
  };

  const clear = () => {
    setStack([]);
    setPeeked(false);
    setMessage("Stack cleared");
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Stack</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">LIFO — Last In, First Out</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input
          type="number"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && push()}
          className="w-36 h-8 text-sm bg-secondary border-border"
        />
        <Button size="sm" onClick={push} className="gap-1"><Plus className="w-3 h-3" /> Push</Button>
        <Button size="sm" variant="outline" onClick={pop} className="gap-1"><Minus className="w-3 h-3" /> Pop</Button>
        <Button size="sm" variant="outline" onClick={peek} className="gap-1"><Eye className="w-3 h-3" /> Peek</Button>
        <Button size="sm" variant="outline" onClick={clear} className="gap-1"><RotateCcw className="w-3 h-3" /> Clear</Button>
        {message && <span className="text-sm text-primary ml-auto">{message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stack Visual */}
        <div className="glass rounded-xl p-6 flex justify-center md:col-span-2">
          <div className="flex flex-col-reverse items-center gap-1 min-h-[300px]">
            <div className="w-48 h-2 bg-muted-foreground/30 rounded-full" />
            <AnimatePresence>
              {stack.map((val, i) => (
                <motion.div
                  key={`${val}-${i}`}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  className={`w-48 h-12 rounded-lg flex items-center justify-center font-mono font-bold border-2 transition-all ${
                    i === stack.length - 1 && peeked
                      ? "border-accent bg-accent/20 text-accent shadow-[0_0_15px_hsl(32_95%_55%/0.4)]"
                      : i === stack.length - 1
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {val}
                  {i === stack.length - 1 && (
                    <span className="text-[10px] ml-2 text-muted-foreground">← TOP</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && <p className="text-muted-foreground text-sm mt-8">Stack is empty</p>}
          </div>
        </div>

        {/* Operation History */}
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Operation History</p>
          <div className="space-y-1 max-h-[280px] overflow-y-auto">
            {history.length === 0 && <p className="text-xs text-muted-foreground">No operations yet</p>}
            {history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">
                {h}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Size: <span className="text-primary font-mono">{stack.length}</span></p>
            <p className="text-xs text-muted-foreground">Top: <span className="text-primary font-mono">{stack.length > 0 ? stack[stack.length - 1] : "—"}</span></p>
          </div>
        </div>
      </div>

      {/* Operations Complexity */}
      <div className="glass rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
        {STACK_INFO.operations.map((op) => (
          <div key={op.name}>
            <p className="text-xs text-muted-foreground">{op.name}</p>
            <p className="font-mono text-primary text-sm">{op.complexity}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{op.desc}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">About Stacks</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{STACK_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {STACK_INFO.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-accent">•</span>{uc}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
