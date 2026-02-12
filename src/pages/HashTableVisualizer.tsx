import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TABLE_SIZE = 10;

function hashFn(key: number): number {
  return key % TABLE_SIZE;
}

type Bucket = number[];

export default function HashTableVisualizer() {
  const [table, setTable] = useState<Bucket[]>(() => {
    const t: Bucket[] = Array.from({ length: TABLE_SIZE }, () => []);
    [15, 25, 35, 7, 42].forEach((v) => t[hashFn(v)].push(v));
    return t;
  });
  const [input, setInput] = useState("");
  const [highlighted, setHighlighted] = useState<{ bucket: number; val?: number } | null>(null);
  const [message, setMessage] = useState("");

  const insert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const newTable = table.map((b) => [...b]);
    if (!newTable[idx].includes(val)) newTable[idx].push(val);
    setTable(newTable);
    setHighlighted({ bucket: idx, val });
    setInput("");
    setMessage(`hash(${val}) = ${val} % ${TABLE_SIZE} = ${idx}`);
    setTimeout(() => setHighlighted(null), 2000);
  };

  const search = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const found = table[idx].includes(val);
    setHighlighted({ bucket: idx, val: found ? val : undefined });
    setMessage(found ? `Found ${val} in bucket ${idx}` : `${val} not found in bucket ${idx}`);
    setTimeout(() => setHighlighted(null), 2000);
  };

  const remove = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const newTable = table.map((b) => [...b]);
    newTable[idx] = newTable[idx].filter((v) => v !== val);
    setTable(newTable);
    setInput("");
    setMessage(`Removed ${val} from bucket ${idx}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-accent">Hash Table</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">Hash function: key % {TABLE_SIZE} (separate chaining)</p>
      </div>

      <div className="glass rounded-xl p-4 flex items-center gap-3">
        <Input type="number" placeholder="Key" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insert()} className="w-28 h-8 text-sm bg-secondary border-border" />
        <Button size="sm" onClick={insert} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
        <Button size="sm" variant="outline" onClick={search} className="gap-1"><Search className="w-3 h-3" /> Search</Button>
        <Button size="sm" variant="outline" onClick={remove} className="gap-1"><Trash2 className="w-3 h-3" /> Delete</Button>
        {message && <span className="text-sm text-accent ml-auto font-mono">{message}</span>}
      </div>

      <div className="glass rounded-xl p-6 space-y-2">
        {table.map((bucket, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              highlighted?.bucket === i ? "bg-accent/10 border border-accent/30" : ""
            }`}
          >
            <span className="w-8 text-xs font-mono text-muted-foreground text-right shrink-0">[{i}]</span>
            <div className="w-px h-6 bg-border" />
            <div className="flex gap-2 flex-wrap">
              {bucket.length === 0 ? (
                <span className="text-xs text-muted-foreground/50 italic">empty</span>
              ) : (
                bucket.map((val, j) => (
                  <motion.div
                    key={`${val}-${j}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`node-element !w-10 !h-10 !text-xs ${
                      highlighted?.bucket === i && highlighted?.val === val ? "active" : ""
                    }`}
                  >
                    {val}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Insert (avg)</p><p className="font-mono text-accent text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Search (avg)</p><p className="font-mono text-accent text-sm">O(1)</p></div>
        <div><p className="text-xs text-muted-foreground">Delete (avg)</p><p className="font-mono text-accent text-sm">O(1)</p></div>
      </div>
    </div>
  );
}
