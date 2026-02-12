import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Info, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUEUE_INFO = {
  description: "A Queue is a linear data structure that follows the FIFO (First In, First Out) principle. Think of it like a line at a ticket counter — the first person in line is served first.",
  useCases: ["CPU task scheduling", "Print job spooling", "BFS (Breadth-First Search)", "Message queues in systems", "Handling requests in web servers"],
  operations: [
    { name: "Enqueue", desc: "Add element to rear", complexity: "O(1)" },
    { name: "Dequeue", desc: "Remove element from front", complexity: "O(1)" },
    { name: "Front", desc: "View front element", complexity: "O(1)" },
    { name: "isEmpty", desc: "Check if queue is empty", complexity: "O(1)" },
  ],
};

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([12, 45, 78]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const addHistory = (msg: string) => setHistory((p) => [msg, ...p].slice(0, 10));

  const enqueue = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setQueue((p) => [...p, val]);
    setInput("");
    setMessage(`Enqueued ${val} at rear`);
    addHistory(`ENQUEUE(${val})`);
  };

  const dequeue = () => {
    if (queue.length === 0) { setMessage("Queue Underflow! Queue is empty."); return; }
    const val = queue[0];
    setQueue((p) => p.slice(1));
    setMessage(`Dequeued ${val} from front`);
    addHistory(`DEQUEUE() → ${val}`);
  };

  const clear = () => {
    setQueue([]);
    setMessage("Queue cleared");
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-info">Queue</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">FIFO — First In, First Out</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input
          type="number"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          className="w-36 h-8 text-sm bg-secondary border-border"
        />
        <Button size="sm" onClick={enqueue} className="gap-1"><Plus className="w-3 h-3" /> Enqueue</Button>
        <Button size="sm" variant="outline" onClick={dequeue} className="gap-1"><Minus className="w-3 h-3" /> Dequeue</Button>
        <Button size="sm" variant="outline" onClick={clear} className="gap-1"><RotateCcw className="w-3 h-3" /> Clear</Button>
        {message && <span className="text-sm text-info ml-auto">{message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-8 md:col-span-2">
          <div className="flex items-center justify-center gap-1 min-h-[120px] overflow-x-auto py-4">
            {queue.length > 0 && <span className="text-xs text-muted-foreground mr-2 shrink-0">FRONT →</span>}
            <AnimatePresence>
              {queue.map((val, i) => (
                <motion.div
                  key={`${val}-${i}`}
                  initial={{ opacity: 0, scale: 0.5, y: -30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -50 }}
                  className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center font-mono font-bold border-2 shrink-0 ${
                    i === 0
                      ? "border-accent bg-accent/15 text-accent"
                      : i === queue.length - 1
                      ? "border-info bg-info/15 text-info"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] opacity-50">{i === 0 ? "front" : i === queue.length - 1 ? "rear" : i}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {queue.length > 0 && <span className="text-xs text-muted-foreground ml-2 shrink-0">← REAR</span>}
            {queue.length === 0 && <p className="text-muted-foreground text-sm">Queue is empty</p>}
          </div>
        </div>

        {/* History */}
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Operation History</p>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {history.length === 0 && <p className="text-xs text-muted-foreground">No operations yet</p>}
            {history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">{h}</div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Size: <span className="text-info font-mono">{queue.length}</span></p>
            <p className="text-xs text-muted-foreground">Front: <span className="text-info font-mono">{queue.length > 0 ? queue[0] : "—"}</span></p>
            <p className="text-xs text-muted-foreground">Rear: <span className="text-info font-mono">{queue.length > 0 ? queue[queue.length - 1] : "—"}</span></p>
          </div>
        </div>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
        {QUEUE_INFO.operations.map((op) => (
          <div key={op.name}>
            <p className="text-xs text-muted-foreground">{op.name}</p>
            <p className="font-mono text-info text-sm">{op.complexity}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{op.desc}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-info" />
          <span className="text-sm font-semibold text-foreground">About Queues</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{QUEUE_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {QUEUE_INFO.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="text-accent">•</span>{uc}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
