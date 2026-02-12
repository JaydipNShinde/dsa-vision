import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([42, 17, 85]);
  const [input, setInput] = useState("");
  const [peeked, setPeeked] = useState(false);
  const [message, setMessage] = useState("");

  const push = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setStack((p) => [...p, val]);
    setInput("");
    setPeeked(false);
    setMessage(`Pushed ${val} onto stack`);
  };

  const pop = () => {
    if (stack.length === 0) { setMessage("Stack is empty!"); return; }
    const val = stack[stack.length - 1];
    setStack((p) => p.slice(0, -1));
    setPeeked(false);
    setMessage(`Popped ${val} from stack`);
  };

  const peek = () => {
    if (stack.length === 0) { setMessage("Stack is empty!"); return; }
    setPeeked(true);
    setMessage(`Top element: ${stack[stack.length - 1]}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Stack</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">LIFO — Last In, First Out</p>
      </div>

      <div className="glass rounded-xl p-4 flex items-center gap-3">
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
        {message && <span className="text-sm text-primary ml-auto">{message}</span>}
      </div>

      <div className="glass rounded-xl p-8 flex justify-center">
        <div className="flex flex-col-reverse items-center gap-1 min-h-[300px]">
          {/* Base */}
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

          {stack.length === 0 && (
            <p className="text-muted-foreground text-sm mt-8">Stack is empty</p>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Push</p><p className="font-mono text-primary text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Pop</p><p className="font-mono text-primary text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Peek</p><p className="font-mono text-primary text-sm">O(1)</p></div>
      </div>
    </div>
  );
}
