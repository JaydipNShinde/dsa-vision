import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type SearchType = "linear" | "binary";

const ALGO_INFO: Record<SearchType, {
  name: string; time: string; best: string; worst: string; space: string; requirement: string;
  description: string; steps: string[];
}> = {
  linear: {
    name: "Linear Search", time: "O(n)", best: "O(1)", worst: "O(n)", space: "O(1)", requirement: "None",
    description: "Linear Search checks each element one by one from start to end until the target is found or the array ends. It works on both sorted and unsorted arrays.",
    steps: ["Start from the first element", "Compare current element with target", "If match → element found!", "If no match → move to next element", "If end reached → element not found"],
  },
  binary: {
    name: "Binary Search", time: "O(log n)", best: "O(1)", worst: "O(log n)", space: "O(1)", requirement: "Sorted Array",
    description: "Binary Search works on sorted arrays by repeatedly dividing the search interval in half. It compares the target with the middle element and eliminates half the remaining elements each step.",
    steps: ["Find the middle element", "If middle = target → found!", "If target < middle → search left half", "If target > middle → search right half", "Repeat until found or interval is empty"],
  },
};

export default function SearchingVisualizer() {
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
  const [speed, setSpeed] = useState(30);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(true);
  const [customInput, setCustomInput] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const stopRef = useRef(false);
  const stepRef = useRef(0);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(100, 800 - speed * 7))), [speed]);

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setCurrent(-1);
    setFound(-1);
    setVisited([]);
    setRange([-1, -1]);
    setMessage("");
    setStepCount(0);
    setCurrentStep("");
    stepRef.current = 0;
  };

  const regenerate = () => {
    reset();
    setArray(
      Array.from({ length: 20 }, (_, i) => i * 3 + Math.floor(Math.random() * 3) + 1).sort((a, b) => a - b)
    );
  };

  const applyCustomArray = () => {
    if (running) return;
    let values = customInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (values.length >= 2) {
      if (algo === "binary") values.sort((a, b) => a - b);
      setArray(values);
      reset();
      setCustomInput("");
    }
  };

  const incStep = () => { stepRef.current++; setStepCount(stepRef.current); };

  const linearSearch = async (t: number) => {
    for (let i = 0; i < array.length && !stopRef.current; i++) {
      setCurrent(i);
      setVisited((p) => [...p, i]);
      incStep();
      setCurrentStep(`Checking index ${i}: ${array[i]} ${array[i] === t ? "= " : "≠ "}${t}`);
      await delay();
      if (array[i] === t) {
        setFound(i);
        setMessage(`✅ Found ${t} at index ${i} in ${stepRef.current} steps!`);
        return;
      }
    }
    setMessage(`❌ ${t} not found after checking all ${array.length} elements.`);
  };

  const binarySearch = async (t: number) => {
    let low = 0, high = array.length - 1;
    while (low <= high && !stopRef.current) {
      const mid = Math.floor((low + high) / 2);
      setRange([low, high]);
      setCurrent(mid);
      setVisited((p) => [...p, mid]);
      incStep();
      setCurrentStep(`Range [${low}...${high}], Mid=${mid}, Value=${array[mid]} ${array[mid] === t ? "=" : array[mid] < t ? "<" : ">"} ${t}`);
      await delay();
      if (array[mid] === t) {
        setFound(mid);
        setMessage(`✅ Found ${t} at index ${mid} in ${stepRef.current} steps!`);
        return;
      }
      if (array[mid] < t) low = mid + 1;
      else high = mid - 1;
    }
    setMessage(`❌ ${t} not found in the array.`);
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

  const info = ALGO_INFO[algo];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          Searching <span className="text-primary">Algorithms</span>
        </h1>
        <p className="text-muted-foreground mt-1">See how search algorithms find elements in an array</p>
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
              {ALGO_INFO[a].name}
            </button>
          ))}
        </div>

        <Input
          type="number"
          placeholder="Target value"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          className="w-32 h-8 text-sm bg-secondary border-border"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-28" />
          <span className="text-[10px] text-muted-foreground">{speed <= 20 ? "Slow" : speed <= 50 ? "Medium" : "Fast"}</span>
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

      {/* Custom Array Input */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Custom Array:</span>
        <Input
          placeholder="e.g. 5, 12, 23, 34, 45, 56, 67"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyCustomArray()}
          className="h-8 text-sm bg-secondary border-border flex-1"
          disabled={running}
        />
        <Button size="sm" variant="outline" onClick={applyCustomArray} disabled={running} className="text-xs">
          Apply
        </Button>
      </div>

      {/* Live Step */}
      {currentStep && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-mono text-accent">{currentStep}</p>
          <span className="text-xs text-muted-foreground ml-auto">Steps: <span className="text-primary font-mono">{stepCount}</span></span>
        </motion.div>
      )}

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

      {/* Complexity */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-6">
        <div><p className="text-xs text-muted-foreground">Algorithm</p><p className="font-semibold">{info.name}</p></div>
        <div><p className="text-xs text-muted-foreground">Time (Avg)</p><p className="font-mono text-primary">{info.time}</p></div>
        <div><p className="text-xs text-muted-foreground">Best Case</p><p className="font-mono text-success">{info.best}</p></div>
        <div><p className="text-xs text-muted-foreground">Worst Case</p><p className="font-mono text-destructive">{info.worst}</p></div>
        <div><p className="text-xs text-muted-foreground">Space</p><p className="font-mono text-accent">{info.space}</p></div>
        <div><p className="text-xs text-muted-foreground">Requirement</p><p className="font-mono text-info">{info.requirement}</p></div>
      </div>

      {/* Info Panel */}
      <div className="glass rounded-xl p-4">
        <button onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-2 w-full text-left">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">How {info.name} Works</span>
          {showInfo ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" /> : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
        </button>
        {showInfo && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Steps:</p>
              <ol className="space-y-1">
                {info.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary font-mono shrink-0">{i + 1}.</span>{step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
