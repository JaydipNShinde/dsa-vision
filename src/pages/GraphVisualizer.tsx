import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Plus, Trash2, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface GraphNode { id: number; x: number; y: number; }
interface Edge { from: number; to: number; weight: number; }

type AlgoType = "bfs" | "dfs" | "dijkstra";

const ALGO_INFO: Record<AlgoType, { name: string; time: string; space: string; description: string; steps: string[] }> = {
  bfs: {
    name: "BFS (Breadth-First Search)", time: "O(V + E)", space: "O(V)",
    description: "BFS explores the graph level by level, visiting all neighbors of the current node before moving to the next level. It uses a Queue.",
    steps: ["Start from source node, add to queue", "Dequeue a node, mark as visited", "Add all unvisited neighbors to queue", "Repeat until queue is empty"],
  },
  dfs: {
    name: "DFS (Depth-First Search)", time: "O(V + E)", space: "O(V)",
    description: "DFS explores as deep as possible along each branch before backtracking. It uses a Stack (or recursion).",
    steps: ["Start from source node, push to stack", "Pop a node, mark as visited", "Push all unvisited neighbors to stack", "Repeat until stack is empty"],
  },
  dijkstra: {
    name: "Dijkstra's Algorithm", time: "O((V+E) log V)", space: "O(V)",
    description: "Dijkstra's finds the shortest path from a source to all other nodes in a weighted graph with non-negative edges.",
    steps: ["Set distance of source = 0, others = ∞", "Pick unvisited node with smallest distance", "Update distances of neighbors", "Mark node as visited, repeat"],
  },
};

const DEFAULT_NODES: GraphNode[] = [
  { id: 0, x: 100, y: 80 }, { id: 1, x: 250, y: 40 }, { id: 2, x: 400, y: 80 },
  { id: 3, x: 80, y: 200 }, { id: 4, x: 250, y: 180 }, { id: 5, x: 420, y: 200 },
  { id: 6, x: 250, y: 280 },
];

const DEFAULT_EDGES: Edge[] = [
  { from: 0, to: 1, weight: 4 }, { from: 0, to: 3, weight: 2 }, { from: 1, to: 2, weight: 3 },
  { from: 1, to: 4, weight: 1 }, { from: 2, to: 5, weight: 6 }, { from: 3, to: 4, weight: 5 },
  { from: 3, to: 6, weight: 7 }, { from: 4, to: 5, weight: 2 }, { from: 4, to: 6, weight: 3 },
];

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);
  const [algo, setAlgo] = useState<AlgoType>("bfs");
  const [visited, setVisited] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState(-1);
  const [visitedEdges, setVisitedEdges] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [startNode, setStartNode] = useState("0");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [distances, setDistances] = useState<Record<number, number>>({});
  const stopRef = useRef(false);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(200, 1000 - speed * 8))), [speed]);

  const getNeighbors = (nodeId: number) => {
    const result: { id: number; weight: number }[] = [];
    edges.forEach((e) => {
      if (e.from === nodeId) result.push({ id: e.to, weight: e.weight });
      if (e.to === nodeId) result.push({ id: e.from, weight: e.weight });
    });
    return result;
  };

  const runBFS = async (start: number) => {
    const queue = [start];
    const vis = new Set<number>([start]);
    setVisited([start]);
    while (queue.length > 0 && !stopRef.current) {
      const node = queue.shift()!;
      setCurrentNode(node);
      setMessage(`Visiting node ${node}`);
      await delay();
      for (const nb of getNeighbors(node)) {
        if (!vis.has(nb.id) && !stopRef.current) {
          vis.add(nb.id);
          queue.push(nb.id);
          setVisited([...vis]);
          setVisitedEdges((p) => [...p, `${Math.min(node, nb.id)}-${Math.max(node, nb.id)}`]);
        }
      }
    }
    setCurrentNode(-1);
    setMessage("✅ BFS Complete! Order: " + [...vis].join(" → "));
  };

  const runDFS = async (start: number) => {
    const stack = [start];
    const vis = new Set<number>();
    while (stack.length > 0 && !stopRef.current) {
      const node = stack.pop()!;
      if (vis.has(node)) continue;
      vis.add(node);
      setVisited([...vis]);
      setCurrentNode(node);
      setMessage(`Visiting node ${node}`);
      await delay();
      const neighbors = getNeighbors(node).reverse();
      for (const nb of neighbors) {
        if (!vis.has(nb.id)) {
          stack.push(nb.id);
          setVisitedEdges((p) => [...p, `${Math.min(node, nb.id)}-${Math.max(node, nb.id)}`]);
        }
      }
    }
    setCurrentNode(-1);
    setMessage("✅ DFS Complete! Order: " + [...vis].join(" → "));
  };

  const runDijkstra = async (start: number) => {
    const dist: Record<number, number> = {};
    const vis = new Set<number>();
    nodes.forEach((n) => (dist[n.id] = Infinity));
    dist[start] = 0;
    setDistances({ ...dist });

    for (let i = 0; i < nodes.length && !stopRef.current; i++) {
      let minDist = Infinity, u = -1;
      nodes.forEach((n) => { if (!vis.has(n.id) && dist[n.id] < minDist) { minDist = dist[n.id]; u = n.id; } });
      if (u === -1) break;
      vis.add(u);
      setVisited([...vis]);
      setCurrentNode(u);
      setMessage(`Processing node ${u}, distance = ${dist[u]}`);
      await delay();
      for (const nb of getNeighbors(u)) {
        const newDist = dist[u] + nb.weight;
        if (newDist < dist[nb.id]) {
          dist[nb.id] = newDist;
          setDistances({ ...dist });
          setVisitedEdges((p) => [...p, `${Math.min(u, nb.id)}-${Math.max(u, nb.id)}`]);
        }
      }
    }
    setCurrentNode(-1);
    setDistances({ ...dist });
    setMessage("✅ Dijkstra Complete! Shortest distances found.");
  };

  const run = async () => {
    if (running) return;
    const start = parseInt(startNode);
    if (isNaN(start) || !nodes.find((n) => n.id === start)) { setMessage("Invalid start node"); return; }
    stopRef.current = false;
    setRunning(true);
    setVisited([]);
    setVisitedEdges([]);
    setCurrentNode(-1);
    setDistances({});
    if (algo === "bfs") await runBFS(start);
    else if (algo === "dfs") await runDFS(start);
    else await runDijkstra(start);
    setRunning(false);
  };

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setVisited([]);
    setVisitedEdges([]);
    setCurrentNode(-1);
    setMessage("");
    setDistances({});
  };

  const addEdge = () => {
    const f = parseInt(edgeFrom), t = parseInt(edgeTo), w = parseInt(edgeWeight) || 1;
    if (isNaN(f) || isNaN(t)) return;
    if (!nodes.find((n) => n.id === f)) {
      setNodes((p) => [...p, { id: f, x: 80 + Math.random() * 360, y: 40 + Math.random() * 240 }]);
    }
    if (!nodes.find((n) => n.id === t)) {
      setNodes((p) => [...p, { id: t, x: 80 + Math.random() * 360, y: 40 + Math.random() * 240 }]);
    }
    setEdges((p) => [...p, { from: f, to: t, weight: w }]);
    setEdgeFrom(""); setEdgeTo(""); setEdgeWeight("1");
    setMessage(`Added edge ${f} → ${t} (weight: ${w})`);
  };

  const resetGraph = () => {
    reset();
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
  };

  const info = ALGO_INFO[algo];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Graph</span> Visualizer
        </h1>
        <p className="text-muted-foreground mt-1">BFS, DFS & Dijkstra's shortest path on interactive graphs</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {(Object.keys(ALGO_INFO) as AlgoType[]).map((a) => (
            <button key={a} onClick={() => !running && setAlgo(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${algo === a ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >{ALGO_INFO[a].name.split(" ")[0]}</button>
          ))}
        </div>
        <Input type="number" placeholder="Start" value={startNode} onChange={(e) => setStartNode(e.target.value)} className="w-20 h-8 text-sm bg-secondary border-border" disabled={running} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" onClick={run} disabled={running} className="gap-1"><Play className="w-3 h-3" /> Run</Button>
          <Button size="sm" variant="outline" onClick={reset} className="gap-1"><RotateCcw className="w-3 h-3" /> Reset</Button>
        </div>
      </div>

      {/* Add Edge */}
      <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">Add Edge:</span>
        <Input type="number" placeholder="From" value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)} className="w-16 h-8 text-sm bg-secondary border-border" />
        <span className="text-xs text-muted-foreground">→</span>
        <Input type="number" placeholder="To" value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)} className="w-16 h-8 text-sm bg-secondary border-border" />
        <Input type="number" placeholder="Wt" value={edgeWeight} onChange={(e) => setEdgeWeight(e.target.value)} className="w-14 h-8 text-sm bg-secondary border-border" />
        <Button size="sm" variant="outline" onClick={addEdge} disabled={running} className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
        <Button size="sm" variant="outline" onClick={resetGraph} className="gap-1 ml-auto"><Trash2 className="w-3 h-3" /> Reset Graph</Button>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-mono text-accent">{message}</p>
        </motion.div>
      )}

      {/* Graph SVG */}
      <div className="glass rounded-xl p-4">
        <svg viewBox="0 0 520 320" className="w-full h-[320px]">
          {edges.map((e, i) => {
            const fromN = nodes.find((n) => n.id === e.from);
            const toN = nodes.find((n) => n.id === e.to);
            if (!fromN || !toN) return null;
            const eKey = `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`;
            const isVis = visitedEdges.includes(eKey);
            return (
              <g key={i}>
                <line x1={fromN.x} y1={fromN.y} x2={toN.x} y2={toN.y} stroke={isVis ? "hsl(175 85% 45%)" : "hsl(220 15% 20%)"} strokeWidth={isVis ? "3" : "2"} />
                <text x={(fromN.x + toN.x) / 2 + 5} y={(fromN.y + toN.y) / 2 - 5} fill="hsl(220 10% 50%)" fontSize="10" fontFamily="JetBrains Mono">{e.weight}</text>
              </g>
            );
          })}
          {nodes.map((n) => {
            const isCurrent = currentNode === n.id;
            const isVisited = visited.includes(n.id);
            return (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r="22"
                  fill={isCurrent ? "hsl(32 95% 55% / 0.3)" : isVisited ? "hsl(175 85% 45% / 0.2)" : "hsl(175 85% 45% / 0.08)"}
                  stroke={isCurrent ? "hsl(32 95% 55%)" : isVisited ? "hsl(175 85% 45%)" : "hsl(220 15% 25%)"}
                  strokeWidth={isCurrent ? "3" : "2"}
                />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill={isCurrent ? "hsl(32 95% 55%)" : isVisited ? "hsl(175 85% 45%)" : "hsl(190 20% 90%)"} fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                  {n.id}
                </text>
                {algo === "dijkstra" && distances[n.id] !== undefined && (
                  <text x={n.x} y={n.y + 38} textAnchor="middle" fill="hsl(32 95% 55%)" fontSize="10" fontFamily="JetBrains Mono">
                    d={distances[n.id] === Infinity ? "∞" : distances[n.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-6">
        <div><p className="text-xs text-muted-foreground">Algorithm</p><p className="font-semibold text-foreground">{info.name}</p></div>
        <div><p className="text-xs text-muted-foreground">Time</p><p className="font-mono text-primary">{info.time}</p></div>
        <div><p className="text-xs text-muted-foreground">Space</p><p className="font-mono text-accent">{info.space}</p></div>
        <div><p className="text-xs text-muted-foreground">Nodes</p><p className="font-mono text-info">{nodes.length}</p></div>
        <div><p className="text-xs text-muted-foreground">Edges</p><p className="font-mono text-info">{edges.length}</p></div>
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">How {info.name} Works</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
            <ol className="space-y-1">
              {info.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="text-primary font-mono shrink-0">{i + 1}.</span>{s}</li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </div>
  );
}
