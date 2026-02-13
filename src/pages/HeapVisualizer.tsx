import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Play, RotateCcw, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type HeapType = "min" | "max";

const HEAP_INFO = {
  description: "A Heap is a complete binary tree that satisfies the heap property. In a Min-Heap, parent ≤ children. In a Max-Heap, parent ≥ children. Heaps are used to implement Priority Queues.",
  operations: [
    { name: "Insert", complexity: "O(log n)", desc: "Add element and bubble up" },
    { name: "Extract", complexity: "O(log n)", desc: "Remove root and heapify down" },
    { name: "Peek", complexity: "O(1)", desc: "View root element" },
    { name: "Heapify", complexity: "O(n)", desc: "Build heap from array" },
  ],
  useCases: ["Priority Queues", "Dijkstra's Algorithm", "Heap Sort", "Median finding", "Task scheduling"],
};

function swap(arr: number[], i: number, j: number) { [arr[i], arr[j]] = [arr[j], arr[i]]; }

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<number[]>([10, 20, 30, 25, 35, 40, 50]);
  const [heapType, setHeapType] = useState<HeapType>("min");
  const [input, setInput] = useState("");
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const stopRef = useRef(false);

  const addHistory = (msg: string) => setHistory((p) => [msg, ...p].slice(0, 10));
  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(200, 800 - speed * 7))), [speed]);

  const compare = (a: number, b: number) => heapType === "min" ? a < b : a > b;

  const insert = async () => {
    const val = parseInt(input);
    if (isNaN(val) || running) return;
    setRunning(true);
    stopRef.current = false;
    const arr = [...heap, val];
    setHeap([...arr]);
    let i = arr.length - 1;
    setMessage(`Inserted ${val}, bubbling up...`);
    addHistory(`INSERT(${val})`);
    while (i > 0 && !stopRef.current) {
      const parent = Math.floor((i - 1) / 2);
      setHighlighted([i, parent]);
      await delay();
      if (compare(arr[i], arr[parent])) {
        swap(arr, i, parent);
        setHeap([...arr]);
        i = parent;
      } else break;
    }
    setHighlighted([]);
    setMessage(`Inserted ${val} — heap property restored`);
    setInput("");
    setRunning(false);
  };

  const extract = async () => {
    if (heap.length === 0 || running) return;
    setRunning(true);
    stopRef.current = false;
    const arr = [...heap];
    const root = arr[0];
    arr[0] = arr[arr.length - 1];
    arr.pop();
    setHeap([...arr]);
    setMessage(`Extracted ${root}, heapifying down...`);
    addHistory(`EXTRACT() → ${root}`);
    let i = 0;
    while (!stopRef.current) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let target = i;
      if (l < arr.length && compare(arr[l], arr[target])) target = l;
      if (r < arr.length && compare(arr[r], arr[target])) target = r;
      if (target === i) break;
      setHighlighted([i, target]);
      await delay();
      swap(arr, i, target);
      setHeap([...arr]);
      i = target;
    }
    setHighlighted([]);
    setMessage(`Extracted ${root} — heap property restored`);
    setRunning(false);
  };

  const buildHeap = async () => {
    if (running) return;
    setRunning(true);
    stopRef.current = false;
    const arr = [...heap];
    setMessage("Building heap...");
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0 && !stopRef.current; i--) {
      let j = i;
      while (!stopRef.current) {
        const l = 2 * j + 1, r = 2 * j + 2;
        let target = j;
        if (l < arr.length && compare(arr[l], arr[target])) target = l;
        if (r < arr.length && compare(arr[r], arr[target])) target = r;
        if (target === j) break;
        setHighlighted([j, target]);
        await delay();
        swap(arr, j, target);
        setHeap([...arr]);
        j = target;
      }
    }
    setHighlighted([]);
    setMessage("✅ Heap built!");
    addHistory(`BUILD_HEAP(${heapType})`);
    setRunning(false);
  };

  const clear = () => {
    stopRef.current = true;
    setHeap([]);
    setHighlighted([]);
    setMessage("Heap cleared");
    setHistory([]);
    setRunning(false);
  };

  const toggleType = () => {
    if (running) return;
    const newType = heapType === "min" ? "max" : "min";
    setHeapType(newType);
    setMessage(`Switched to ${newType}-heap. Click "Build Heap" to re-heapify.`);
  };

  // Tree rendering
  const renderNode = (idx: number, x: number, y: number, spread: number): JSX.Element | null => {
    if (idx >= heap.length) return null;
    const isHighlighted = highlighted.includes(idx);
    const left = 2 * idx + 1, right = 2 * idx + 2;
    return (
      <g key={idx}>
        {left < heap.length && <line x1={x} y1={y + 15} x2={x - spread} y2={y + 60} stroke="hsl(220 15% 20%)" strokeWidth="2" />}
        {right < heap.length && <line x1={x} y1={y + 15} x2={x + spread} y2={y + 60} stroke="hsl(220 15% 20%)" strokeWidth="2" />}
        <circle cx={x} cy={y} r="20"
          fill={isHighlighted ? "hsl(32 95% 55% / 0.25)" : idx === 0 ? "hsl(175 85% 45% / 0.15)" : "hsl(175 85% 45% / 0.08)"}
          stroke={isHighlighted ? "hsl(32 95% 55%)" : idx === 0 ? "hsl(175 85% 45%)" : "hsl(220 15% 25%)"}
          strokeWidth={isHighlighted ? "3" : "2"}
        />
        <text x={x} y={y + 5} textAnchor="middle" fill={isHighlighted ? "hsl(32 95% 55%)" : "hsl(175 85% 45%)"} fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">{heap[idx]}</text>
        {left < heap.length && renderNode(left, x - spread, y + 55, spread * 0.52)}
        {right < heap.length && renderNode(right, x + spread, y + 55, spread * 0.52)}
      </g>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Heap</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">{heapType === "min" ? "Min-Heap" : "Max-Heap"} — Complete binary tree with heap property</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <button onClick={toggleType} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${heapType === "min" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Min-Heap</button>
        <button onClick={toggleType} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${heapType === "max" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Max-Heap</button>
        <div className="border-l border-border h-6 mx-1" />
        <Input type="number" placeholder="Value" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insert()} className="w-24 h-8 text-sm bg-secondary border-border" disabled={running} />
        <Button size="sm" onClick={insert} disabled={running} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
        <Button size="sm" variant="outline" onClick={extract} disabled={running} className="gap-1"><Minus className="w-3 h-3" /> Extract</Button>
        <Button size="sm" variant="outline" onClick={buildHeap} disabled={running} className="gap-1"><Play className="w-3 h-3" /> Build Heap</Button>
        <Button size="sm" variant="outline" onClick={clear} className="gap-1"><RotateCcw className="w-3 h-3" /> Clear</Button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
        </div>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-mono text-accent">{message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tree */}
        <div className="glass rounded-xl p-4 md:col-span-2">
          <svg viewBox="0 0 520 300" className="w-full h-[300px]">
            {heap.length > 0 ? renderNode(0, 260, 30, 120) : <text x="260" y="150" textAnchor="middle" fill="hsl(220 10% 50%)" fontSize="14">Insert values to build the heap</text>}
          </svg>
        </div>

        {/* Array + History */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Array Representation</p>
            <div className="flex gap-1 flex-wrap">
              {heap.map((v, i) => (
                <span key={i} className={`px-2 py-1 rounded text-xs font-mono ${highlighted.includes(i) ? "bg-accent/20 text-accent" : "bg-secondary text-secondary-foreground"}`}>{v}</span>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Parent(i) = ⌊(i-1)/2⌋ | Left(i) = 2i+1 | Right(i) = 2i+2</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">History</p>
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {history.length === 0 && <p className="text-xs text-muted-foreground">No operations yet</p>}
              {history.map((h, i) => (
                <div key={i} className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">{h}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
        {HEAP_INFO.operations.map((op) => (
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
          <span className="text-sm font-semibold text-foreground">About Heaps</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{HEAP_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {HEAP_INFO.useCases.map((uc, i) => (
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
