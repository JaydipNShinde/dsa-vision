import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, RotateCcw, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface TrieNode {
  children: Record<string, TrieNode>;
  isEnd: boolean;
  char: string;
}

function createNode(char: string): TrieNode {
  return { children: {}, isEnd: false, char };
}

const TRIE_INFO = {
  description: "A Trie (Prefix Tree) is a tree data structure used for storing strings. Each node represents a character, and paths from root to marked nodes form complete words. Tries enable extremely fast prefix-based searches.",
  operations: [
    { name: "Insert", complexity: "O(m)", desc: "m = word length" },
    { name: "Search", complexity: "O(m)", desc: "m = word length" },
    { name: "Prefix Search", complexity: "O(m)", desc: "Find all words with prefix" },
    { name: "Delete", complexity: "O(m)", desc: "Remove word from trie" },
  ],
  useCases: ["Autocomplete / search suggestions", "Spell checkers", "IP routing (longest prefix match)", "Dictionary implementations", "Phone book / contact search"],
};

export default function TrieVisualizer() {
  const [root, setRoot] = useState<TrieNode>(() => {
    const r = createNode("");
    ["cat", "car", "card", "care", "do", "dog", "done"].forEach((w) => {
      let node = r;
      for (const c of w) {
        if (!node.children[c]) node.children[c] = createNode(c);
        node = node.children[c];
      }
      node.isEnd = true;
    });
    return r;
  });
  const [input, setInput] = useState("");
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [running, setRunning] = useState(false);
  const [words, setWords] = useState<string[]>(["cat", "car", "card", "care", "do", "dog", "done"]);
  const stopRef = useRef(false);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(200, 800 - speed * 7))), [speed]);

  const cloneTrie = (node: TrieNode): TrieNode => {
    const n = createNode(node.char);
    n.isEnd = node.isEnd;
    for (const [k, v] of Object.entries(node.children)) n.children[k] = cloneTrie(v);
    return n;
  };

  const insertWord = async () => {
    const word = input.trim().toLowerCase();
    if (!word || running) return;
    setRunning(true);
    stopRef.current = false;
    const newRoot = cloneTrie(root);
    let node = newRoot;
    const path: string[] = ["root"];
    setMessage(`Inserting "${word}"...`);
    for (let i = 0; i < word.length && !stopRef.current; i++) {
      const c = word[i];
      if (!node.children[c]) node.children[c] = createNode(c);
      node = node.children[c];
      path.push(path[path.length - 1] + "-" + c);
      setHighlighted([...path]);
      setRoot(cloneTrie(newRoot));
      await delay();
    }
    node.isEnd = true;
    setRoot(cloneTrie(newRoot));
    if (!words.includes(word)) setWords((p) => [...p, word]);
    setMessage(`✅ Inserted "${word}"`);
    setInput("");
    setHighlighted([]);
    setRunning(false);
  };

  const searchWord = async () => {
    const word = input.trim().toLowerCase();
    if (!word || running) return;
    setRunning(true);
    stopRef.current = false;
    let node: TrieNode | undefined = root;
    const path: string[] = ["root"];
    setMessage(`Searching for "${word}"...`);
    for (let i = 0; i < word.length && !stopRef.current; i++) {
      const c = word[i];
      node = node?.children[c];
      if (!node) {
        setMessage(`❌ "${word}" not found — no path for '${c}'`);
        setHighlighted([]);
        setRunning(false);
        return;
      }
      path.push(path[path.length - 1] + "-" + c);
      setHighlighted([...path]);
      await delay();
    }
    if (node?.isEnd) setMessage(`✅ "${word}" found!`);
    else setMessage(`❌ "${word}" is a prefix but not a complete word`);
    setRunning(false);
  };

  const resetTrie = () => {
    stopRef.current = true;
    const r = createNode("");
    const defaultWords = ["cat", "car", "card", "care", "do", "dog", "done"];
    defaultWords.forEach((w) => {
      let node = r;
      for (const c of w) {
        if (!node.children[c]) node.children[c] = createNode(c);
        node = node.children[c];
      }
      node.isEnd = true;
    });
    setRoot(r);
    setWords(defaultWords);
    setHighlighted([]);
    setMessage("");
    setRunning(false);
  };

  // Render trie as tree
  const renderTrieNode = (node: TrieNode, x: number, y: number, spread: number, path: string): JSX.Element => {
    const keys = Object.keys(node.children).sort();
    const isHighlighted = highlighted.includes(path);
    const totalWidth = keys.length * spread;
    const startX = x - totalWidth / 2 + spread / 2;

    return (
      <g>
        <circle cx={x} cy={y} r="16"
          fill={node.isEnd ? "hsl(32 95% 55% / 0.2)" : isHighlighted ? "hsl(175 85% 45% / 0.2)" : "hsl(175 85% 45% / 0.06)"}
          stroke={node.isEnd ? "hsl(32 95% 55%)" : isHighlighted ? "hsl(175 85% 45%)" : "hsl(220 15% 22%)"}
          strokeWidth={isHighlighted ? "3" : "1.5"}
        />
        <text x={x} y={y + 4} textAnchor="middle" fill={node.isEnd ? "hsl(32 95% 55%)" : isHighlighted ? "hsl(175 85% 45%)" : "hsl(190 20% 80%)"} fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
          {node.char || "∅"}
        </text>
        {keys.map((k, i) => {
          const childX = startX + i * spread;
          const childY = y + 50;
          const childPath = path + "-" + k;
          return (
            <g key={k}>
              <line x1={x} y1={y + 16} x2={childX} y2={childY - 16} stroke={highlighted.includes(childPath) ? "hsl(175 85% 45%)" : "hsl(220 15% 18%)"} strokeWidth={highlighted.includes(childPath) ? "2.5" : "1.5"} />
              {renderTrieNode(node.children[k], childX, childY, Math.max(spread * 0.6, 30), childPath)}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Trie</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">Prefix Tree — Fast string search and autocomplete</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input placeholder="Enter word" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insertWord()} className="w-40 h-8 text-sm bg-secondary border-border" disabled={running} />
        <Button size="sm" onClick={insertWord} disabled={running} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
        <Button size="sm" variant="outline" onClick={searchWord} disabled={running} className="gap-1"><Search className="w-3 h-3" /> Search</Button>
        <Button size="sm" variant="outline" onClick={resetTrie} className="gap-1"><RotateCcw className="w-3 h-3" /> Reset</Button>
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

      {/* Trie */}
      <div className="glass rounded-xl p-4">
        <svg viewBox="0 0 600 320" className="w-full h-[320px]">
          {renderTrieNode(root, 300, 25, 65, "root")}
        </svg>
      </div>

      {/* Words in Trie */}
      <div className="glass rounded-xl p-4">
        <p className="text-xs font-semibold text-foreground mb-2">Words in Trie ({words.length})</p>
        <div className="flex gap-2 flex-wrap">
          {words.map((w) => (
            <span key={w} className="px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20">{w}</span>
          ))}
        </div>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
        {TRIE_INFO.operations.map((op) => (
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
          <span className="text-sm font-semibold text-foreground">About Tries</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{TRIE_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {TRIE_INFO.useCases.map((uc, i) => (
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
