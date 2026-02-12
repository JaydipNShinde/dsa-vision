import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([12, 45, 78]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const enqueue = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setQueue((p) => [...p, val]);
    setInput("");
    setMessage(`Enqueued ${val}`);
  };

  const dequeue = () => {
    if (queue.length === 0) { setMessage("Queue is empty!"); return; }
    const val = queue[0];
    setQueue((p) => p.slice(1));
    setMessage(`Dequeued ${val}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-info">Queue</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">FIFO — First In, First Out</p>
      </div>

      <div className="glass rounded-xl p-4 flex items-center gap-3">
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
        {message && <span className="text-sm text-info ml-auto">{message}</span>}
      </div>

      <div className="glass rounded-xl p-8">
        <div className="flex items-center justify-center gap-1 min-h-[120px] overflow-x-auto py-4">
          {/* Front label */}
          {queue.length > 0 && <span className="text-xs text-muted-foreground mr-2 shrink-0">FRONT →</span>}

          <AnimatePresence>
            {queue.map((val, i) => (
              <motion.div
                key={`${val}-${i}`}
                initial={{ opacity: 0, scale: 0.5, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -50 }}
                className={`w-16 h-16 rounded-lg flex items-center justify-center font-mono font-bold border-2 shrink-0 ${
                  i === 0
                    ? "border-accent bg-accent/15 text-accent"
                    : i === queue.length - 1
                    ? "border-info bg-info/15 text-info"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {val}
              </motion.div>
            ))}
          </AnimatePresence>

          {queue.length > 0 && <span className="text-xs text-muted-foreground ml-2 shrink-0">← REAR</span>}
          {queue.length === 0 && <p className="text-muted-foreground text-sm">Queue is empty</p>}
        </div>
      </div>

      <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Enqueue</p><p className="font-mono text-info text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Dequeue</p><p className="font-mono text-info text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Size</p><p className="font-mono text-foreground text-sm">{queue.length}</p></div>
      </div>
    </div>
  );
}
