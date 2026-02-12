import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCcw, Play, Trash2, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

function insertBST(root: TreeNode | undefined, val: number): TreeNode {
  if (!root) return { value: val };
  if (val < root.value) return { ...root, left: insertBST(root.left, val) };
  if (val > root.value) return { ...root, right: insertBST(root.right, val) };
  return root;
}

function countNodes(root: TreeNode | undefined): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function treeHeight(root: TreeNode | undefined): number {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

function getTraversal(root: TreeNode | undefined, type: string): number[] {
  if (!root) return [];
  if (type === "inorder") return [...getTraversal(root.left, type), root.value, ...getTraversal(root.right, type)];
  if (type === "preorder") return [root.value, ...getTraversal(root.left, type), ...getTraversal(root.right, type)];
  if (type === "postorder") return [...getTraversal(root.left, type), ...getTraversal(root.right, type), root.value];
  // level order
  const result: number[] = [];
  const queue: (TreeNode | undefined)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.value);
      queue.push(node.left, node.right);
    }
  }
  return result;
}

const TRAVERSAL_INFO: Record<string, { desc: string; order: string }> = {
  inorder: { desc: "Left → Root → Right. Gives sorted order for BST.", order: "L → N → R" },
  preorder: { desc: "Root → Left → Right. Useful for creating a copy of the tree.", order: "N → L → R" },
  postorder: { desc: "Left → Right → Root. Useful for deleting the tree.", order: "L → R → N" },
  levelorder: { desc: "Level by level, left to right. Uses queue (BFS).", order: "Top → Bottom" },
};

const BST_INFO = {
  description: "A Binary Search Tree (BST) is a tree data structure where each node has at most two children. For every node, all values in the left subtree are smaller, and all values in the right subtree are larger.",
  properties: ["Left child < Parent < Right child", "In-order traversal gives sorted order", "Search, Insert, Delete: O(log n) average", "Can degenerate to O(n) if unbalanced"],
  useCases: ["Database indexing (B-trees)", "File system organization", "Expression parsing", "Priority queues (heap)", "Auto-complete / dictionary"],
};

function TreeNodeComp({ node, highlighted, currentNode, x, y, spread }: {
  node: TreeNode; highlighted: number[]; currentNode: number; x: number; y: number; spread: number;
}) {
  const isHighlighted = highlighted.includes(node.value);
  const isCurrent = currentNode === node.value;
  return (
    <g>
      {node.left && (
        <>
          <line x1={x} y1={y + 15} x2={x - spread} y2={y + 65} stroke="hsl(220 15% 20%)" strokeWidth="2" />
          <TreeNodeComp node={node.left} highlighted={highlighted} currentNode={currentNode} x={x - spread} y={y + 60} spread={spread * 0.55} />
        </>
      )}
      {node.right && (
        <>
          <line x1={x} y1={y + 15} x2={x + spread} y2={y + 65} stroke="hsl(220 15% 20%)" strokeWidth="2" />
          <TreeNodeComp node={node.right} highlighted={highlighted} currentNode={currentNode} x={x + spread} y={y + 60} spread={spread * 0.55} />
        </>
      )}
      <circle
        cx={x} cy={y} r="20"
        fill={isCurrent ? "hsl(175 85% 45% / 0.3)" : isHighlighted ? "hsl(32 95% 55% / 0.2)" : "hsl(175 85% 45% / 0.1)"}
        stroke={isCurrent ? "hsl(175 85% 45%)" : isHighlighted ? "hsl(32 95% 55%)" : "hsl(175 85% 45%)"}
        strokeWidth={isCurrent ? "3" : "2"}
      />
      <text x={x} y={y + 5} textAnchor="middle" fill={isCurrent ? "hsl(175 85% 45%)" : isHighlighted ? "hsl(32 95% 55%)" : "hsl(175 85% 45%)"} fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
        {node.value}
      </text>
    </g>
  );
}

export default function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | undefined>(() => {
    let r: TreeNode | undefined;
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => (r = insertBST(r, v)));
    return r;
  });
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState(-1);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState("");
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  const insert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot((r) => insertBST(r, val));
    setInput("");
    setMessage(`Inserted ${val} into BST`);
  };

  const bulkInsert = () => {
    const values = bulkInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (values.length === 0) return;
    let r = root;
    values.forEach((v) => (r = insertBST(r, v)));
    setRoot(r);
    setBulkInput("");
    setMessage(`Inserted ${values.length} values: [${values.join(", ")}]`);
  };

  const animateTraversal = async (type: string) => {
    if (!root || running) return;
    setRunning(true);
    stopRef.current = false;
    const result = getTraversal(root, type);
    setTraversalResult(result);
    setTraversalType(type);
    setHighlighted([]);
    setCurrentNode(-1);
    const delayMs = Math.max(100, 800 - speed * 7);
    for (let i = 0; i < result.length && !stopRef.current; i++) {
      setCurrentNode(result[i]);
      await new Promise((r) => setTimeout(r, delayMs));
      setHighlighted((p) => [...p, result[i]]);
      setCurrentNode(-1);
    }
    setMessage(`${type}: [${result.join(", ")}]`);
    setRunning(false);
  };

  const resetTree = () => {
    stopRef.current = true;
    let r: TreeNode | undefined;
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => (r = insertBST(r, v)));
    setRoot(r);
    setHighlighted([]);
    setCurrentNode(-1);
    setTraversalResult([]);
    setMessage("");
    setRunning(false);
  };

  const clearTree = () => {
    stopRef.current = true;
    setRoot(undefined);
    setHighlighted([]);
    setCurrentNode(-1);
    setTraversalResult([]);
    setMessage("Tree cleared");
    setRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          Binary <span className="text-primary">Tree</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">BST — Insert, traverse, and understand tree operations</p>
      </div>

      <div className="glass rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="number" placeholder="Value" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insert()} className="w-24 h-8 text-sm bg-secondary border-border" disabled={running} />
          <Button size="sm" onClick={insert} disabled={running} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
          <div className="border-l border-border h-6 mx-1" />
          {(["inorder", "preorder", "postorder", "levelorder"] as const).map((t) => (
            <Button key={t} size="sm" variant="outline" onClick={() => animateTraversal(t)} disabled={running} className="gap-1 text-xs capitalize">
              <Play className="w-3 h-3" /> {t}
            </Button>
          ))}
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={resetTree} className="gap-1"><RotateCcw className="w-3 h-3" /> Reset</Button>
            <Button size="sm" variant="outline" onClick={clearTree} className="gap-1"><Trash2 className="w-3 h-3" /> Clear</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input placeholder="Bulk insert: 10, 5, 15, 3, 7" value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && bulkInsert()} className="h-8 text-sm bg-secondary border-border flex-1" disabled={running} />
          <Button size="sm" variant="outline" onClick={bulkInsert} disabled={running} className="text-xs">Bulk Insert</Button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Speed</span>
            <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
          </div>
        </div>
        {message && <p className="text-sm text-primary">{message}</p>}
      </div>

      {/* Tree */}
      <div className="glass rounded-xl p-6">
        <svg viewBox="0 0 600 320" className="w-full h-[320px]">
          {root && <TreeNodeComp node={root} highlighted={highlighted} currentNode={currentNode} x={300} y={30} spread={130} />}
          {!root && <text x="300" y="160" textAnchor="middle" fill="hsl(220 10% 50%)" fontSize="14">Insert values to build the tree</text>}
        </svg>
      </div>

      {/* Tree Stats */}
      <div className="glass rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div><p className="text-xs text-muted-foreground">Nodes</p><p className="font-mono text-primary text-lg">{countNodes(root)}</p></div>
        <div><p className="text-xs text-muted-foreground">Height</p><p className="font-mono text-primary text-lg">{treeHeight(root)}</p></div>
        <div><p className="text-xs text-muted-foreground">Search (avg)</p><p className="font-mono text-success text-sm">O(log n)</p></div>
        <div><p className="text-xs text-muted-foreground">Insert (avg)</p><p className="font-mono text-success text-sm">O(log n)</p></div>
      </div>

      {/* Traversal Result */}
      {traversalResult.length > 0 && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold text-foreground capitalize">{traversalType} Traversal</p>
            {traversalType && <span className="text-[10px] text-muted-foreground font-mono">({TRAVERSAL_INFO[traversalType]?.order})</span>}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{TRAVERSAL_INFO[traversalType]?.desc}</p>
          <div className="flex gap-1 flex-wrap">
            {traversalResult.map((val, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  highlighted.includes(val) ? "bg-accent/20 text-accent" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {val}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">About Binary Search Trees</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{BST_INFO.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Key Properties:</p>
              <ul className="space-y-1">
                {BST_INFO.properties.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="text-primary">•</span>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Real-World Use Cases:</p>
              <ul className="space-y-1">
                {BST_INFO.useCases.map((uc, i) => (
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
