import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Info, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TABLE_SIZE = 10;
function hashFn(key: number): number { return key % TABLE_SIZE; }
type Bucket = number[];

const HT_INFO = {
  description: "A Hash Table stores key-value pairs using a hash function to compute an index into an array of buckets. It provides near-constant time lookups, insertions, and deletions on average.",
  concepts: [
    { term: "Hash Function", desc: "Converts key to array index (here: key % 10)" },
    { term: "Collision", desc: "When two keys hash to the same index" },
    { term: "Separate Chaining", desc: "Handle collisions using linked lists at each bucket" },
    { term: "Load Factor", desc: "Number of elements / table size. High load → more collisions" },
  ],
  useCases: ["Dictionaries / Maps", "Database indexing", "Caches (LRU, Memcached)", "Symbol tables in compilers", "Counting frequencies"],
};

export default function HashTableVisualizer() {
  const [table, setTable] = useState<Bucket[]>(() => {
    const t: Bucket[] = Array.from({ length: TABLE_SIZE }, () => []);
    [15, 25, 35, 7, 42].forEach((v) => t[hashFn(v)].push(v));
    return t;
  });
  const [input, setInput] = useState("");
  const [highlighted, setHighlighted] = useState<{ bucket: number; val?: number } | null>(null);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const totalElements = table.reduce((acc, b) => acc + b.length, 0);
  const addHistory = (msg: string) => setHistory((p) => [msg, ...p].slice(0, 10));

  const insert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const newTable = table.map((b) => [...b]);
    const collision = newTable[idx].length > 0;
    if (!newTable[idx].includes(val)) newTable[idx].push(val);
    setTable(newTable);
    setHighlighted({ bucket: idx, val });
    setInput("");
    setMessage(`hash(${val}) = ${val} % ${TABLE_SIZE} = ${idx}${collision ? " ⚠️ Collision!" : ""}`);
    addHistory(`INSERT(${val}) → bucket[${idx}]${collision ? " [collision]" : ""}`);
    setTimeout(() => setHighlighted(null), 2000);
  };

  const search = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const found = table[idx].includes(val);
    setHighlighted({ bucket: idx, val: found ? val : undefined });
    setMessage(found ? `✅ Found ${val} in bucket ${idx}` : `❌ ${val} not found in bucket ${idx}`);
    addHistory(`SEARCH(${val}) → ${found ? "found" : "not found"} in bucket[${idx}]`);
    setTimeout(() => setHighlighted(null), 2000);
  };

  const remove = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = hashFn(val);
    const exists = table[idx].includes(val);
    const newTable = table.map((b) => [...b]);
    newTable[idx] = newTable[idx].filter((v) => v !== val);
    setTable(newTable);
    setInput("");
    setMessage(exists ? `Removed ${val} from bucket ${idx}` : `${val} not found`);
    if (exists) addHistory(`DELETE(${val}) from bucket[${idx}]`);
  };

  const clear = () => {
    setTable(Array.from({ length: TABLE_SIZE }, () => []));
    setHighlighted(null);
    setMessage("Hash table cleared");
    setHistory([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-accent">Hash Table</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">Hash function: key % {TABLE_SIZE} — Separate chaining for collision resolution</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input type="number" placeholder="Key" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insert()} className="w-28 h-8 text-sm bg-secondary border-border" />
        <Button size="sm" onClick={insert} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
        <Button size="sm" variant="outline" onClick={search} className="gap-1"><Search className="w-3 h-3" /> Search</Button>
        <Button size="sm" variant="outline" onClick={remove} className="gap-1"><Trash2 className="w-3 h-3" /> Delete</Button>
        <Button size="sm" variant="outline" onClick={clear} className="gap-1"><RotateCcw className="w-3 h-3" /> Clear</Button>
        {message && <span className="text-sm text-accent ml-auto font-mono">{message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table */}
        <div className="glass rounded-xl p-6 space-y-2 md:col-span-2">
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

        {/* Stats + History */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Table Stats</p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Elements: <span className="text-accent font-mono">{totalElements}</span></p>
              <p className="text-xs text-muted-foreground">Table Size: <span className="text-accent font-mono">{TABLE_SIZE}</span></p>
              <p className="text-xs text-muted-foreground">Load Factor: <span className="text-accent font-mono">{(totalElements / TABLE_SIZE).toFixed(2)}</span></p>
              <p className="text-xs text-muted-foreground">Empty Buckets: <span className="text-accent font-mono">{table.filter((b) => b.length === 0).length}</span></p>
              <p className="text-xs text-muted-foreground">Max Chain: <span className="text-accent font-mono">{Math.max(0, ...table.map((b) => b.length))}</span></p>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Operation History</p>
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
      <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Insert (avg)</p><p className="font-mono text-success text-sm">O(1)</p><p className="text-[10px] text-muted-foreground">Worst: O(n)</p></div>
        <div><p className="text-xs text-muted-foreground">Search (avg)</p><p className="font-mono text-success text-sm">O(1)</p><p className="text-[10px] text-muted-foreground">Worst: O(n)</p></div>
        <div><p className="text-xs text-muted-foreground">Delete (avg)</p><p className="font-mono text-success text-sm">O(1)</p><p className="text-[10px] text-muted-foreground">Worst: O(n)</p></div>
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">About Hash Tables</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{HT_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Key Concepts:</p>
              {HT_INFO.concepts.map((c, i) => (
                <div key={i} className="mb-1">
                  <span className="text-xs text-accent font-semibold">{c.term}:</span>
                  <span className="text-xs text-muted-foreground ml-1">{c.desc}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {HT_INFO.useCases.map((uc, i) => (
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
