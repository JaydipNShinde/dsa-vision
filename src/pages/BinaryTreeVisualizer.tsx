import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

function insertBST(root: TreeNode | undefined, val: number): TreeNode {
  if (!root) return { value: val };
  if (val < root.value) return { ...root, left: insertBST(root.left, val) };
  return { ...root, right: insertBST(root.right, val) };
}

function getTraversal(root: TreeNode | undefined, type: string): number[] {
  if (!root) return [];
  if (type === "inorder") return [...getTraversal(root.left, type), root.value, ...getTraversal(root.right, type)];
  if (type === "preorder") return [root.value, ...getTraversal(root.left, type), ...getTraversal(root.right, type)];
  return [...getTraversal(root.left, type), ...getTraversal(root.right, type), root.value];
}

function TreeNodeComp({ node, highlighted, x, y, spread }: {
  node: TreeNode;
  highlighted: number[];
  x: number;
  y: number;
  spread: number;
}) {
  const isHighlighted = highlighted.includes(node.value);
  return (
    <g>
      {node.left && (
        <>
          <line x1={x} y1={y + 15} x2={x - spread} y2={y + 65} stroke="hsl(220 15% 20%)" strokeWidth="2" />
          <TreeNodeComp node={node.left} highlighted={highlighted} x={x - spread} y={y + 60} spread={spread * 0.55} />
        </>
      )}
      {node.right && (
        <>
          <line x1={x} y1={y + 15} x2={x + spread} y2={y + 65} stroke="hsl(220 15% 20%)" strokeWidth="2" />
          <TreeNodeComp node={node.right} highlighted={highlighted} x={x + spread} y={y + 60} spread={spread * 0.55} />
        </>
      )}
      <circle
        cx={x}
        cy={y}
        r="20"
        fill={isHighlighted ? "hsl(32 95% 55% / 0.2)" : "hsl(175 85% 45% / 0.1)"}
        stroke={isHighlighted ? "hsl(32 95% 55%)" : "hsl(175 85% 45%)"}
        strokeWidth="2"
      />
      <text x={x} y={y + 5} textAnchor="middle" fill={isHighlighted ? "hsl(32 95% 55%)" : "hsl(175 85% 45%)"} fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
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
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const insert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot((r) => insertBST(r, val));
    setInput("");
    setMessage(`Inserted ${val}`);
  };

  const animateTraversal = async (type: string) => {
    if (!root) return;
    const result = getTraversal(root, type);
    setTraversalResult(result);
    setHighlighted([]);
    for (let i = 0; i < result.length; i++) {
      setHighlighted((p) => [...p, result[i]]);
      await new Promise((r) => setTimeout(r, 500));
    }
    setMessage(`${type}: [${result.join(", ")}]`);
  };

  const resetTree = () => {
    let r: TreeNode | undefined;
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => (r = insertBST(r, v)));
    setRoot(r);
    setHighlighted([]);
    setTraversalResult([]);
    setMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Binary <span className="text-primary">Tree</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">BST insertion & tree traversals</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <Input type="number" placeholder="Value" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && insert()} className="w-28 h-8 text-sm bg-secondary border-border" />
        <Button size="sm" onClick={insert} className="gap-1"><Plus className="w-3 h-3" /> Insert</Button>
        <div className="border-l border-border h-6 mx-1" />
        <Button size="sm" variant="outline" onClick={() => animateTraversal("inorder")} className="gap-1"><Play className="w-3 h-3" /> Inorder</Button>
        <Button size="sm" variant="outline" onClick={() => animateTraversal("preorder")}>Preorder</Button>
        <Button size="sm" variant="outline" onClick={() => animateTraversal("postorder")}>Postorder</Button>
        <Button size="sm" variant="outline" onClick={resetTree} className="gap-1 ml-auto"><RotateCcw className="w-3 h-3" /> Reset</Button>
      </div>

      <div className="glass rounded-xl p-6">
        <svg viewBox="0 0 600 300" className="w-full h-[300px]">
          {root && <TreeNodeComp node={root} highlighted={highlighted} x={300} y={30} spread={130} />}
        </svg>
      </div>

      {traversalResult.length > 0 && (
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Traversal Result</p>
          <div className="flex gap-1 flex-wrap">
            {traversalResult.map((val, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  highlighted.includes(val) ? "bg-accent/20 text-accent" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {val}
              </motion.span>
            ))}
          </div>
          {message && <p className="text-sm text-primary mt-2">{message}</p>}
        </div>
      )}
    </div>
  );
}
