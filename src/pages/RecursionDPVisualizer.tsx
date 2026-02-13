import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Problem = "fibonacci" | "factorial" | "knapsack" | "lcs";

const PROBLEM_INFO: Record<Problem, { name: string; description: string; timeNaive: string; timeDP: string; space: string; steps: string[] }> = {
  fibonacci: {
    name: "Fibonacci", description: "Compute nth Fibonacci number. Naive recursion has exponential time due to repeated subproblems. DP stores results to avoid recomputation.",
    timeNaive: "O(2ⁿ)", timeDP: "O(n)", space: "O(n)",
    steps: ["fib(0)=0, fib(1)=1", "fib(n) = fib(n-1) + fib(n-2)", "With DP: store each result in table", "Look up instead of recomputing"],
  },
  factorial: {
    name: "Factorial", description: "Compute n! = n × (n-1) × ... × 1. Classic recursion example showing how function calls stack up and resolve.",
    timeNaive: "O(n)", timeDP: "O(n)", space: "O(n)",
    steps: ["Base case: 0! = 1", "n! = n × (n-1)!", "Recursive calls go deeper until base", "Results multiply back up the stack"],
  },
  knapsack: {
    name: "0/1 Knapsack", description: "Given items with weights and values, find maximum value that fits in a knapsack of given capacity. Classic DP problem.",
    timeNaive: "O(2ⁿ)", timeDP: "O(n×W)", space: "O(n×W)",
    steps: ["For each item: include or exclude", "If included: value + solve remaining capacity", "If excluded: solve with remaining items", "Take maximum of both choices"],
  },
  lcs: {
    name: "Longest Common Subsequence", description: "Find the longest subsequence common to two strings. Fundamental DP problem used in diff tools and bioinformatics.",
    timeNaive: "O(2ⁿ)", timeDP: "O(m×n)", space: "O(m×n)",
    steps: ["Compare characters of both strings", "If match: 1 + LCS of remaining", "If no match: max(skip from s1, skip from s2)", "Build DP table bottom-up"],
  },
};

export default function RecursionDPVisualizer() {
  const [problem, setProblem] = useState<Problem>("fibonacci");
  const [input, setInput] = useState("8");
  const [input2, setInput2] = useState("ABCBDAB");
  const [input3, setInput3] = useState("BDCAB");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [dpTable, setDpTable] = useState<number[]>([]);
  const [dpGrid, setDpGrid] = useState<number[][]>([]);
  const [currentCell, setCurrentCell] = useState<[number, number]>([-1, -1]);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const stopRef = useRef(false);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(50, 500 - speed * 4))), [speed]);

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setDpTable([]);
    setDpGrid([]);
    setCurrentCell([-1, -1]);
    setCallStack([]);
    setResult("");
    setMessage("");
  };

  const runFibonacci = async () => {
    const n = parseInt(input);
    if (isNaN(n) || n < 0 || n > 30) { setMessage("Enter a number 0-30"); return; }
    setRunning(true);
    stopRef.current = false;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    if (n >= 1) dp[1] = 1;
    setDpTable([...dp]);
    setCallStack(["Computing fib(0) = 0", "Computing fib(1) = 1"]);
    await delay();
    for (let i = 2; i <= n && !stopRef.current; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      setDpTable([...dp]);
      setCurrentCell([i, -1]);
      setCallStack((p) => [`fib(${i}) = fib(${i - 1}) + fib(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`, ...p].slice(0, 15));
      setMessage(`Computing fib(${i}) = ${dp[i]}`);
      await delay();
    }
    setResult(`fib(${n}) = ${dp[n]}`);
    setMessage(`✅ fib(${n}) = ${dp[n]}`);
    setCurrentCell([-1, -1]);
    setRunning(false);
  };

  const runFactorial = async () => {
    const n = parseInt(input);
    if (isNaN(n) || n < 0 || n > 20) { setMessage("Enter a number 0-20"); return; }
    setRunning(true);
    stopRef.current = false;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    setDpTable([...dp]);
    setCallStack(["Base case: 0! = 1"]);
    await delay();
    for (let i = 1; i <= n && !stopRef.current; i++) {
      dp[i] = i * dp[i - 1];
      setDpTable([...dp]);
      setCurrentCell([i, -1]);
      setCallStack((p) => [`${i}! = ${i} × ${i - 1}! = ${i} × ${dp[i - 1]} = ${dp[i]}`, ...p].slice(0, 15));
      setMessage(`Computing ${i}! = ${dp[i]}`);
      await delay();
    }
    setResult(`${n}! = ${dp[n]}`);
    setMessage(`✅ ${n}! = ${dp[n]}`);
    setCurrentCell([-1, -1]);
    setRunning(false);
  };

  const runLCS = async () => {
    const s1 = input2.toUpperCase();
    const s2 = input3.toUpperCase();
    if (!s1 || !s2) return;
    setRunning(true);
    stopRef.current = false;
    const m = s1.length, n = s2.length;
    const grid: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    setDpGrid(grid.map((r) => [...r]));
    for (let i = 1; i <= m && !stopRef.current; i++) {
      for (let j = 1; j <= n && !stopRef.current; j++) {
        setCurrentCell([i, j]);
        if (s1[i - 1] === s2[j - 1]) {
          grid[i][j] = grid[i - 1][j - 1] + 1;
          setCallStack((p) => [`Match '${s1[i - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${grid[i][j]}`, ...p].slice(0, 15));
        } else {
          grid[i][j] = Math.max(grid[i - 1][j], grid[i][j - 1]);
          setCallStack((p) => [`No match: dp[${i}][${j}] = max(${grid[i - 1][j]}, ${grid[i][j - 1]}) = ${grid[i][j]}`, ...p].slice(0, 15));
        }
        setDpGrid(grid.map((r) => [...r]));
        setMessage(`Processing dp[${i}][${j}]`);
        await delay();
      }
    }
    setResult(`LCS length = ${grid[m][n]}`);
    setMessage(`✅ LCS("${s1}", "${s2}") = ${grid[m][n]}`);
    setCurrentCell([-1, -1]);
    setRunning(false);
  };

  const runKnapsack = async () => {
    const capacity = parseInt(input) || 7;
    const items = [
      { name: "A", weight: 1, value: 1 },
      { name: "B", weight: 3, value: 4 },
      { name: "C", weight: 4, value: 5 },
      { name: "D", weight: 5, value: 7 },
    ];
    setRunning(true);
    stopRef.current = false;
    const n = items.length;
    const grid: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
    setDpGrid(grid.map((r) => [...r]));
    for (let i = 1; i <= n && !stopRef.current; i++) {
      for (let w = 0; w <= capacity && !stopRef.current; w++) {
        setCurrentCell([i, w]);
        if (items[i - 1].weight <= w) {
          grid[i][w] = Math.max(grid[i - 1][w], grid[i - 1][w - items[i - 1].weight] + items[i - 1].value);
          setCallStack((p) => [`Item ${items[i - 1].name}(w=${items[i - 1].weight},v=${items[i - 1].value}), cap=${w}: max(${grid[i - 1][w]}, ${grid[i - 1][w - items[i - 1].weight]}+${items[i - 1].value}) = ${grid[i][w]}`, ...p].slice(0, 12));
        } else {
          grid[i][w] = grid[i - 1][w];
        }
        setDpGrid(grid.map((r) => [...r]));
        await delay();
      }
    }
    setResult(`Max value = ${grid[n][capacity]}`);
    setMessage(`✅ Knapsack max value = ${grid[n][capacity]}`);
    setCurrentCell([-1, -1]);
    setRunning(false);
  };

  const run = () => {
    reset();
    setTimeout(() => {
      if (problem === "fibonacci") runFibonacci();
      else if (problem === "factorial") runFactorial();
      else if (problem === "lcs") runLCS();
      else runKnapsack();
    }, 100);
  };

  const info = PROBLEM_INFO[problem];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          Recursion & <span className="text-primary">Dynamic Programming</span>
        </h1>
        <p className="text-muted-foreground mt-1">Visualize how DP optimizes recursive problems</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(PROBLEM_INFO) as Problem[]).map((p) => (
            <button key={p} onClick={() => { if (!running) { setProblem(p); reset(); } }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${problem === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >{PROBLEM_INFO[p].name}</button>
          ))}
        </div>
        {(problem === "fibonacci" || problem === "factorial") && (
          <Input type="number" placeholder="n" value={input} onChange={(e) => setInput(e.target.value)} className="w-20 h-8 text-sm bg-secondary border-border" disabled={running} />
        )}
        {problem === "knapsack" && (
          <Input type="number" placeholder="Capacity" value={input} onChange={(e) => setInput(e.target.value)} className="w-24 h-8 text-sm bg-secondary border-border" disabled={running} />
        )}
        {problem === "lcs" && (
          <>
            <Input placeholder="String 1" value={input2} onChange={(e) => setInput2(e.target.value)} className="w-28 h-8 text-sm bg-secondary border-border" disabled={running} />
            <Input placeholder="String 2" value={input3} onChange={(e) => setInput3(e.target.value)} className="w-28 h-8 text-sm bg-secondary border-border" disabled={running} />
          </>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" onClick={run} disabled={running} className="gap-1"><Play className="w-3 h-3" /> Run</Button>
          <Button size="sm" variant="outline" onClick={reset} className="gap-1"><RotateCcw className="w-3 h-3" /> Reset</Button>
        </div>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-mono text-accent">{message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DP Table / Grid */}
        <div className="glass rounded-xl p-4 md:col-span-2 overflow-auto">
          {dpTable.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">DP Table</p>
              <div className="flex gap-1 flex-wrap">
                {dpTable.map((v, i) => (
                  <div key={i} className={`flex flex-col items-center px-2 py-1.5 rounded text-xs font-mono ${currentCell[0] === i ? "bg-accent/20 text-accent border border-accent/30" : "bg-secondary text-secondary-foreground"}`}>
                    <span className="text-[9px] text-muted-foreground">{i}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {dpGrid.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">DP Grid</p>
              <div className="overflow-auto">
                <table className="border-collapse">
                  <tbody>
                    {dpGrid.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className={`w-8 h-8 text-center text-xs font-mono border border-border ${currentCell[0] === i && currentCell[1] === j ? "bg-accent/25 text-accent font-bold" : cell > 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {dpTable.length === 0 && dpGrid.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">Click "Run" to start the visualization</p>
          )}
          {result && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-lg font-bold text-primary text-center">{result}</motion.p>
          )}
        </div>

        {/* Call Stack */}
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Computation Log</p>
          <div className="space-y-1 max-h-[350px] overflow-y-auto">
            {callStack.length === 0 && <p className="text-xs text-muted-foreground">No computations yet</p>}
            {callStack.map((c, i) => (
              <div key={i} className={`text-[11px] font-mono px-2 py-1 rounded ${i === 0 ? "bg-accent/15 text-accent" : "bg-secondary/50 text-muted-foreground"}`}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Complexity */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-6">
        <div><p className="text-xs text-muted-foreground">Problem</p><p className="font-semibold">{info.name}</p></div>
        <div><p className="text-xs text-muted-foreground">Naive Time</p><p className="font-mono text-destructive">{info.timeNaive}</p></div>
        <div><p className="text-xs text-muted-foreground">DP Time</p><p className="font-mono text-success">{info.timeDP}</p></div>
        <div><p className="text-xs text-muted-foreground">Space</p><p className="font-mono text-accent">{info.space}</p></div>
      </div>

      {/* Info */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">About {info.name}</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">How it works:</p>
              <ol className="space-y-1">
                {info.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><span className="text-primary font-mono shrink-0">{i + 1}.</span>{s}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
