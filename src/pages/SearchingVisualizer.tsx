import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type SearchType = "linear" | "binary";

export default function SearchingVisualizer() {
  const [size] = useState(20);
  const [array, setArray] = useState(() =>
    Array.from({ length: 20 }, (_, i) => i * 3 + Math.floor(Math.random() * 3) + 1).sort((a, b) => a - b)
  );
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState(-1);
  const [found, setFound] = useState(-1);
  const [visited, setVisited] = useState<number[]>([]);
  const [range, setRange] = useState<[number, number]>([-1, -1]);
  const [algo, setAlgo] = useState<SearchType>("linear");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [message, setMessage] = useState("");
  const stopRef = useRef(false);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(50, 400 - speed * 4))), [speed]);

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setCurrent(-1);
    setFound(-1);
    setVisited([]);
    setRange([-1, -1]);
    setMessage("");
  };

  const regenerate = () => {
    reset();
    setArray(
      Array.from({ length: size }, (_, i) => i * 3 + Math.floor(Math.random() * 3) + 1).sort((a, b) => a - b)
    );
  };

  const linearSearch = async (t: number) => {
    for (let i = 0; i < array.length && !stopRef.current; i++) {
      setCurrent(i);
      setVisited((p) => [...p, i]);
      await delay();
      if (array[i] === t) {
        setFound(i);
        setMessage(`Found ${t} at index ${i}!`);
        return;
      }
    }
    setMessage(`${t} not found in the array.`);
  };

  const binarySearch = async (t: number) => {
    let low = 0, high = array.length - 1;
    while (low <= high && !stopRef.current) {
      const mid = Math.floor((low + high) / 2);
      setRange([low, high]);
      setCurrent(mid);
      setVisited((p) => [...p, mid]);
      await delay();
      if (array[mid] === t) {
        setFound(mid);
        setMessage(`Found ${t} at index ${mid}!`);
        return;
      }
      if (array[mid] < t) low = mid + 1;
      else high = mid - 1;
    }
    setMessage(`${t} not found in the array.`);
  };

  const run = async () => {
    const t = parseInt(target);
    if (isNaN(t)) return;
    reset();
    stopRef.current = false;
    setRunning(true);
    if (algo === "linear") await linearSearch(t);
    else await binarySearch(t);
    setRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Searching <span className="text-primary">Algorithms</span>
        </h1>
        <p className="text-muted-foreground mt-1">Visualize how search algorithms find elements</p>
      </div>

      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(["linear", "binary"] as SearchType[]).map((a) => (
            <button
              key={a}
              onClick={() => { if (!running) { setAlgo(a); reset(); } }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algo === a ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {a === "linear" ? "Linear Search" : "Binary Search"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Target value"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-32 h-8 text-sm bg-secondary border-border"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
        </div>

        <div className="flex gap-2 ml-auto">
          <Button size="sm" onClick={run} disabled={running} className="gap-1">
            <Play className="w-3 h-3" /> Search
          </Button>
          <Button size="sm" variant="outline" onClick={regenerate} className="gap-1">
            <RotateCcw className="w-3 h-3" /> New Array
          </Button>
        </div>
      </div>

      {/* Array visualization */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {array.map((val, i) => {
            const isFound = found === i;
            const isCurrent = current === i;
            const isVisited = visited.includes(i);
            const inRange = algo === "binary" && range[0] >= 0 && i >= range[0] && i <= range[1];
            return (
              <motion.div
                key={i}
                animate={isFound ? { scale: [1, 1.2, 1] } : {}}
                className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-sm border-2 transition-all duration-300 ${
                  isFound
                    ? "border-accent bg-accent/20 text-accent shadow-[0_0_15px_hsl(32_95%_55%/0.4)]"
                    : isCurrent
                    ? "border-primary bg-primary/20 text-primary shadow-[0_0_12px_hsl(175_85%_45%/0.3)]"
                    : isVisited
                    ? "border-muted-foreground/50 bg-muted/50 text-muted-foreground"
                    : inRange
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span className="font-bold">{val}</span>
                <span className="text-[10px] text-muted-foreground">{i}</span>
              </motion.div>
            );
          })}
        </div>
        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4 font-medium text-primary">
            {message}
          </motion.p>
        )}
      </div>

      <div className="glass rounded-xl p-4 flex gap-6">
        <div>
          <p className="text-xs text-muted-foreground">Algorithm</p>
          <p className="font-semibold">{algo === "linear" ? "Linear Search" : "Binary Search"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Time Complexity</p>
          <p className="font-mono text-primary">{algo === "linear" ? "O(n)" : "O(log n)"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Requirement</p>
          <p className="font-mono text-accent">{algo === "linear" ? "None" : "Sorted Array"}</p>
        </div>
      </div>
    </div>
  );
}
