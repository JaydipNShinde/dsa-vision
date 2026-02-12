import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Node {
  id: number;
  value: number;
}

let nextId = 4;

export default function LinkedListVisualizer() {
  const [list, setList] = useState<Node[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ]);
  const [input, setInput] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const [message, setMessage] = useState("");

  const addToEnd = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setList((p) => [...p, { id: nextId++, value: val }]);
    setInput("");
    setMessage(`Added ${val} to end`);
  };

  const addAtIndex = () => {
    const val = parseInt(input);
    const idx = parseInt(indexInput);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx > list.length) {
      setMessage("Invalid value or index");
      return;
    }
    const newList = [...list];
    newList.splice(idx, 0, { id: nextId++, value: val });
    setList(newList);
    setInput("");
    setIndexInput("");
    setHighlighted(idx);
    setTimeout(() => setHighlighted(-1), 1500);
    setMessage(`Inserted ${val} at index ${idx}`);
  };

  const removeFromEnd = () => {
    if (list.length === 0) { setMessage("List is empty!"); return; }
    setMessage(`Removed ${list[list.length - 1].value} from end`);
    setList((p) => p.slice(0, -1));
  };

  const removeAtIndex = () => {
    const idx = parseInt(indexInput);
    if (isNaN(idx) || idx < 0 || idx >= list.length) { setMessage("Invalid index"); return; }
    setMessage(`Removed ${list[idx].value} at index ${idx}`);
    setList((p) => p.filter((_, i) => i !== idx));
    setIndexInput("");
  };

  const traverse = async () => {
    for (let i = 0; i < list.length; i++) {
      setHighlighted(i);
      await new Promise((r) => setTimeout(r, 500));
    }
    setHighlighted(-1);
    setMessage("Traversal complete!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-warning">Linked List</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">Singly linked list operations</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input type="number" placeholder="Value" value={input} onChange={(e) => setInput(e.target.value)} className="w-24 h-8 text-sm bg-secondary border-border" />
        <Input type="number" placeholder="Index" value={indexInput} onChange={(e) => setIndexInput(e.target.value)} className="w-20 h-8 text-sm bg-secondary border-border" />
        <Button size="sm" onClick={addToEnd} className="gap-1"><Plus className="w-3 h-3" /> Add End</Button>
        <Button size="sm" variant="outline" onClick={addAtIndex} className="gap-1"><Plus className="w-3 h-3" /> At Index</Button>
        <Button size="sm" variant="outline" onClick={removeFromEnd} className="gap-1"><Minus className="w-3 h-3" /> Remove End</Button>
        <Button size="sm" variant="outline" onClick={removeAtIndex} className="gap-1"><Minus className="w-3 h-3" /> At Index</Button>
        <Button size="sm" variant="outline" onClick={traverse}>Traverse</Button>
        {message && <span className="text-sm text-warning ml-auto">{message}</span>}
      </div>

      <div className="glass rounded-xl p-8 overflow-x-auto">
        <div className="flex items-center gap-0 min-h-[100px] py-4">
          <span className="text-xs text-muted-foreground mr-3 shrink-0">HEAD</span>
          <AnimatePresence>
            {list.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center shrink-0"
              >
                <div
                  className={`node-element ${highlighted === i ? "active" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <span>{node.value}</span>
                    <span className="text-[9px] opacity-50">{i}</span>
                  </div>
                </div>
                {i < list.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-1" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {list.length > 0 && (
            <span className="text-xs text-muted-foreground ml-3 shrink-0">→ NULL</span>
          )}
          {list.length === 0 && <p className="text-muted-foreground text-sm">List is empty</p>}
        </div>
      </div>

      <div className="glass rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Access</p><p className="font-mono text-warning text-sm">O(n)</p></div>
        <div><p className="text-xs text-muted-foreground">Search</p><p className="font-mono text-warning text-sm">O(n)</p></div>
        <div><p className="text-xs text-muted-foreground">Insert (head)</p><p className="font-mono text-warning text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Delete (head)</p><p className="font-mono text-warning text-sm">O(1)</p></div>
      </div>
    </div>
  );
}
