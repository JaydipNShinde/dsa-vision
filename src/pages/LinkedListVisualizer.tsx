import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, Info, ChevronDown, ChevronUp, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface Node {
  id: number;
  value: number;
}

let nextId = 4;

const LL_INFO = {
  description: "A Linked List is a linear data structure where elements (nodes) are stored in non-contiguous memory. Each node contains data and a pointer/reference to the next node in the sequence.",
  types: ["Singly Linked List — each node points to the next", "Doubly Linked List — each node points to both next and previous", "Circular Linked List — last node points back to first"],
  useCases: ["Dynamic memory allocation", "Implementing stacks & queues", "Undo functionality in editors", "Music playlist (next/previous track)", "Polynomial arithmetic"],
};

export default function LinkedListVisualizer() {
  const [list, setList] = useState<Node[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ]);
  const [input, setInput] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const [found, setFound] = useState(-1);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [traversing, setTraversing] = useState(false);
  const stopRef = useRef(false);

  const addToEnd = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setList((p) => [...p, { id: nextId++, value: val }]);
    setInput("");
    setMessage(`Added ${val} to end — O(n) operation`);
  };

  const addToHead = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setList((p) => [{ id: nextId++, value: val }, ...p]);
    setInput("");
    setMessage(`Added ${val} to head — O(1) operation`);
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
    setMessage(`Inserted ${val} at index ${idx} — O(n) operation`);
  };

  const removeFromEnd = () => {
    if (list.length === 0) { setMessage("List is empty!"); return; }
    setMessage(`Removed ${list[list.length - 1].value} from end — O(n) operation`);
    setList((p) => p.slice(0, -1));
  };

  const removeFromHead = () => {
    if (list.length === 0) { setMessage("List is empty!"); return; }
    setMessage(`Removed ${list[0].value} from head — O(1) operation`);
    setList((p) => p.slice(1));
  };

  const removeAtIndex = () => {
    const idx = parseInt(indexInput);
    if (isNaN(idx) || idx < 0 || idx >= list.length) { setMessage("Invalid index"); return; }
    setMessage(`Removed ${list[idx].value} at index ${idx}`);
    setList((p) => p.filter((_, i) => i !== idx));
    setIndexInput("");
  };

  const searchValue = async () => {
    const val = parseInt(searchInput);
    if (isNaN(val)) return;
    setTraversing(true);
    setFound(-1);
    stopRef.current = false;
    const delayMs = Math.max(100, 800 - speed * 7);
    for (let i = 0; i < list.length && !stopRef.current; i++) {
      setHighlighted(i);
      setMessage(`Searching... checking index ${i}, value ${list[i].value}`);
      await new Promise((r) => setTimeout(r, delayMs));
      if (list[i].value === val) {
        setFound(i);
        setMessage(`✅ Found ${val} at index ${i}!`);
        setTraversing(false);
        return;
      }
    }
    setHighlighted(-1);
    setMessage(`❌ ${val} not found in list`);
    setTraversing(false);
  };

  const traverse = async () => {
    setTraversing(true);
    stopRef.current = false;
    const delayMs = Math.max(100, 800 - speed * 7);
    for (let i = 0; i < list.length && !stopRef.current; i++) {
      setHighlighted(i);
      setMessage(`Traversing... node ${i}: value = ${list[i].value}, next → ${i < list.length - 1 ? `node ${i + 1}` : "NULL"}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
    setHighlighted(-1);
    setMessage("Traversal complete!");
    setTraversing(false);
  };

  const clear = () => {
    stopRef.current = true;
    setList([]);
    setHighlighted(-1);
    setFound(-1);
    setMessage("List cleared");
    setTraversing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-warning">Linked List</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">Singly linked list — dynamic data structure with pointer-based connections</p>
      </div>

      {/* Controls */}
      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="number" placeholder="Value" value={input} onChange={(e) => setInput(e.target.value)} className="w-24 h-8 text-sm bg-secondary border-border" disabled={traversing} />
          <Input type="number" placeholder="Index" value={indexInput} onChange={(e) => setIndexInput(e.target.value)} className="w-20 h-8 text-sm bg-secondary border-border" disabled={traversing} />
          <Button size="sm" onClick={addToHead} disabled={traversing} className="gap-1"><Plus className="w-3 h-3" /> Head</Button>
          <Button size="sm" onClick={addToEnd} disabled={traversing} className="gap-1"><Plus className="w-3 h-3" /> Tail</Button>
          <Button size="sm" variant="outline" onClick={addAtIndex} disabled={traversing} className="gap-1"><Plus className="w-3 h-3" /> At Index</Button>
          <Button size="sm" variant="outline" onClick={removeFromHead} disabled={traversing} className="gap-1"><Minus className="w-3 h-3" /> Head</Button>
          <Button size="sm" variant="outline" onClick={removeFromEnd} disabled={traversing} className="gap-1"><Minus className="w-3 h-3" /> Tail</Button>
          <Button size="sm" variant="outline" onClick={removeAtIndex} disabled={traversing} className="gap-1"><Minus className="w-3 h-3" /> At Index</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input type="number" placeholder="Search value" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-32 h-8 text-sm bg-secondary border-border" disabled={traversing} />
          <Button size="sm" variant="outline" onClick={searchValue} disabled={traversing} className="gap-1"><Search className="w-3 h-3" /> Search</Button>
          <Button size="sm" variant="outline" onClick={traverse} disabled={traversing}>Traverse</Button>
          <Button size="sm" variant="outline" onClick={clear} className="gap-1"><RotateCcw className="w-3 h-3" /> Clear</Button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Speed</span>
            <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
          </div>
        </div>
        {message && <p className="text-sm text-warning">{message}</p>}
      </div>

      {/* Visualization */}
      <div className="glass rounded-xl p-8 overflow-x-auto">
        <div className="flex items-center gap-0 min-h-[100px] py-4">
          <span className="text-xs text-muted-foreground mr-3 shrink-0 font-mono">HEAD</span>
          <AnimatePresence>
            {list.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center shrink-0"
              >
                <div className={`node-element ${highlighted === i ? "active" : ""} ${found === i ? "highlight" : ""}`}>
                  <div className="flex flex-col items-center">
                    <span>{node.value}</span>
                    <span className="text-[9px] opacity-50">{i}</span>
                  </div>
                </div>
                {i < list.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground mx-1" />}
              </motion.div>
            ))}
          </AnimatePresence>
          {list.length > 0 && <span className="text-xs text-muted-foreground ml-3 shrink-0 font-mono">→ NULL</span>}
          {list.length === 0 && <p className="text-muted-foreground text-sm">List is empty — add elements to begin</p>}
        </div>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Access</p><p className="font-mono text-warning text-sm">O(n)</p><p className="text-[10px] text-muted-foreground">Sequential traversal</p></div>
        <div><p className="text-xs text-muted-foreground">Search</p><p className="font-mono text-warning text-sm">O(n)</p><p className="text-[10px] text-muted-foreground">Linear search</p></div>
        <div><p className="text-xs text-muted-foreground">Insert (head)</p><p className="font-mono text-success text-sm">O(1)</p><p className="text-[10px] text-muted-foreground">Direct pointer update</p></div>
        <div><p className="text-xs text-muted-foreground">Delete (head)</p><p className="font-mono text-success text-sm">O(1)</p><p className="text-[10px] text-muted-foreground">Direct pointer update</p></div>
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-warning" />
          <span className="text-sm font-semibold text-foreground">About Linked Lists</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{LL_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Types of Linked Lists:</p>
              <ul className="space-y-1">
                {LL_INFO.types.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="text-warning">•</span>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {LL_INFO.useCases.map((uc, i) => (
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
