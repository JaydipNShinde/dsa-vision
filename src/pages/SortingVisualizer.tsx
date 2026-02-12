import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Shuffle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

type AlgoType = "bubble" | "selection" | "insertion" | "merge" | "quick";

const ALGO_INFO: Record<AlgoType, {
  name: string; time: string; space: string; best: string; worst: string; stable: string;
  description: string; steps: string[];
}> = {
  bubble: {
    name: "Bubble Sort", time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)", stable: "Yes",
    description: "Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position in each pass.",
    steps: ["Compare adjacent elements", "Swap if left > right", "Repeat until no swaps needed", "Largest element moves to end each pass"],
  },
  selection: {
    name: "Selection Sort", time: "O(n²)", space: "O(1)", best: "O(n²)", worst: "O(n²)", stable: "No",
    description: "Selection Sort divides the array into sorted and unsorted parts. It repeatedly finds the minimum element from the unsorted part and places it at the beginning.",
    steps: ["Find minimum in unsorted portion", "Swap with first unsorted position", "Move boundary one position right", "Repeat until fully sorted"],
  },
  insertion: {
    name: "Insertion Sort", time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)", stable: "Yes",
    description: "Insertion Sort builds the sorted array one element at a time by picking each element and inserting it into its correct position among the previously sorted elements.",
    steps: ["Pick next unsorted element", "Compare with sorted elements (right to left)", "Shift larger elements right", "Insert element at correct position"],
  },
  merge: {
    name: "Merge Sort", time: "O(n log n)", space: "O(n)", best: "O(n log n)", worst: "O(n log n)", stable: "Yes",
    description: "Merge Sort is a divide-and-conquer algorithm that recursively splits the array in half, sorts each half, and then merges the sorted halves back together.",
    steps: ["Divide array into two halves", "Recursively sort each half", "Merge sorted halves by comparing elements", "Combine until single sorted array"],
  },
  quick: {
    name: "Quick Sort", time: "O(n log n)", space: "O(log n)", best: "O(n log n)", worst: "O(n²)", stable: "No",
    description: "Quick Sort picks a pivot element and partitions the array around it — elements smaller go left, larger go right. It then recursively sorts the partitions.",
    steps: ["Choose a pivot element", "Partition: smaller left, larger right", "Recursively sort left partition", "Recursively sort right partition"],
  },
};

function generateArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function SortingVisualizer() {
  const [size, setSize] = useState(30);
  const [speed, setSpeed] = useState(30);
  const [array, setArray] = useState(() => generateArray(30));
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [algo, setAlgo] = useState<AlgoType>("bubble");
  const [running, setRunning] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [customInput, setCustomInput] = useState("");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const stopRef = useRef(false);
  const compRef = useRef(0);
  const swapRef = useRef(0);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(10, 500 - speed * 5))), [speed]);

  const incComp = () => { compRef.current++; setComparisons(compRef.current); };
  const incSwap = () => { swapRef.current++; setSwaps(swapRef.current); };

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setComparing([]);
    setSorted([]);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep("");
    compRef.current = 0;
    swapRef.current = 0;
    const newArr = generateArray(size);
    setArray(newArr);
  };

  const shuffle = () => {
    if (running) return;
    setArray(generateArray(size));
    setSorted([]);
    setComparing([]);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep("");
    compRef.current = 0;
    swapRef.current = 0;
  };

  const applyCustomArray = () => {
    if (running) return;
    const values = customInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0 && n <= 100);
    if (values.length >= 2) {
      setArray(values);
      setSize(values.length);
      setSorted([]);
      setComparing([]);
      setComparisons(0);
      setSwaps(0);
      setCustomInput("");
    }
  };

  const bubbleSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 0; i < a.length && !stopRef.current; i++) {
      for (let j = 0; j < a.length - i - 1 && !stopRef.current; j++) {
        setComparing([j, j + 1]);
        setCurrentStep(`Comparing index ${j} (${a[j]}) with index ${j + 1} (${a[j + 1]})`);
        incComp();
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          incSwap();
        }
        setArray([...a]);
        await delay();
      }
      setSorted((p) => [...p, a.length - 1 - i]);
    }
    setSorted(a.map((_, i) => i));
    setCurrentStep("✅ Sorting complete!");
  };

  const selectionSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 0; i < a.length && !stopRef.current; i++) {
      let min = i;
      setCurrentStep(`Finding minimum in unsorted portion [${i}...${a.length - 1}]`);
      for (let j = i + 1; j < a.length && !stopRef.current; j++) {
        setComparing([min, j]);
        incComp();
        if (a[j] < a[min]) min = j;
        await delay();
      }
      if (min !== i) {
        setCurrentStep(`Swapping ${a[i]} at index ${i} with minimum ${a[min]} at index ${min}`);
        [a[i], a[min]] = [a[min], a[i]];
        incSwap();
      }
      setArray([...a]);
      setSorted((p) => [...p, i]);
    }
    setSorted(a.map((_, i) => i));
    setCurrentStep("✅ Sorting complete!");
  };

  const insertionSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 1; i < a.length && !stopRef.current; i++) {
      let j = i;
      setCurrentStep(`Inserting element ${a[i]} into correct position`);
      while (j > 0 && a[j] < a[j - 1] && !stopRef.current) {
        setComparing([j, j - 1]);
        incComp();
        [a[j], a[j - 1]] = [a[j - 1], a[j]];
        incSwap();
        setArray([...a]);
        await delay();
        j--;
      }
    }
    setSorted(a.map((_, i) => i));
    setCurrentStep("✅ Sorting complete!");
  };

  const mergeSort = async (arr: number[]) => {
    const a = [...arr];
    const mergeSortHelper = async (start: number, end: number) => {
      if (start >= end || stopRef.current) return;
      const mid = Math.floor((start + end) / 2);
      setCurrentStep(`Dividing [${start}...${end}] at mid=${mid}`);
      await mergeSortHelper(start, mid);
      await mergeSortHelper(mid + 1, end);
      const left = a.slice(start, mid + 1);
      const right = a.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;
      setCurrentStep(`Merging [${start}...${mid}] and [${mid + 1}...${end}]`);
      while (i < left.length && j < right.length && !stopRef.current) {
        setComparing([k, mid + 1 + j]);
        incComp();
        if (left[i] <= right[j]) { a[k++] = left[i++]; }
        else { a[k++] = right[j++]; incSwap(); }
        setArray([...a]);
        await delay();
      }
      while (i < left.length && !stopRef.current) { a[k++] = left[i++]; setArray([...a]); await delay(); }
      while (j < right.length && !stopRef.current) { a[k++] = right[j++]; setArray([...a]); await delay(); }
    };
    await mergeSortHelper(0, a.length - 1);
    setSorted(a.map((_, i) => i));
    setCurrentStep("✅ Sorting complete!");
  };

  const quickSort = async (arr: number[]) => {
    const a = [...arr];
    const qs = async (low: number, high: number) => {
      if (low >= high || stopRef.current) return;
      const pivot = a[high];
      setCurrentStep(`Pivot: ${pivot} at index ${high}`);
      let i = low - 1;
      for (let j = low; j < high && !stopRef.current; j++) {
        setComparing([j, high]);
        incComp();
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          incSwap();
          setArray([...a]);
        }
        await delay();
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      incSwap();
      setArray([...a]);
      setSorted((p) => [...p, i + 1]);
      await qs(low, i);
      await qs(i + 2, high);
    };
    await qs(0, a.length - 1);
    setSorted(a.map((_, i) => i));
    setCurrentStep("✅ Sorting complete!");
  };

  const run = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    setSorted([]);
    setComparing([]);
    compRef.current = 0;
    swapRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    const sortFn = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, merge: mergeSort, quick: quickSort }[algo];
    await sortFn(array);
    setRunning(false);
    setComparing([]);
  };

  const info = ALGO_INFO[algo];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold">
          Sorting <span className="text-primary">Algorithms</span>
        </h1>
        <p className="text-muted-foreground mt-1">Watch how different sorting algorithms organize data step-by-step</p>
      </div>

      {/* Algorithm Selector */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(ALGO_INFO) as AlgoType[]).map((a) => (
            <button
              key={a}
              onClick={() => !running && setAlgo(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algo === a
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {ALGO_INFO[a].name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Size: {size}</span>
          <Slider
            value={[size]}
            onValueChange={([v]) => { if (!running) { setSize(v); setArray(generateArray(v)); setSorted([]); setComparisons(0); setSwaps(0); } }}
            min={5}
            max={80}
            step={1}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-28" />
          <span className="text-[10px] text-muted-foreground">{speed <= 20 ? "Slow" : speed <= 50 ? "Medium" : speed <= 80 ? "Fast" : "Ultra"}</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button size="sm" onClick={run} disabled={running} className="gap-1">
            <Play className="w-3 h-3" /> Sort
          </Button>
          <Button size="sm" variant="outline" onClick={reset} className="gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
          <Button size="sm" variant="outline" onClick={shuffle} disabled={running} className="gap-1">
            <Shuffle className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Custom Array Input */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Custom Array:</span>
        <Input
          placeholder="e.g. 45, 23, 67, 12, 89, 34, 56"
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

      {/* Live Step Display */}
      {currentStep && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-sm font-mono text-accent">{currentStep}</p>
          <div className="ml-auto flex gap-4">
            <span className="text-xs text-muted-foreground">Comparisons: <span className="text-primary font-mono">{comparisons}</span></span>
            <span className="text-xs text-muted-foreground">Swaps: <span className="text-primary font-mono">{swaps}</span></span>
          </div>
        </motion.div>
      )}

      {/* Visualization */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-end justify-center gap-[2px] h-72">
          {array.map((val, i) => (
            <motion.div
              key={i}
              layout
              className={`bar-element ${comparing.includes(i) ? "comparing" : ""} ${sorted.includes(i) ? "sorted" : ""}`}
              style={{
                height: `${(val / 100) * 100}%`,
                width: `${Math.max(2, 100 / array.length - 1)}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Complexity & Legend */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-muted-foreground">Algorithm</p>
          <p className="font-semibold text-foreground">{info.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Time (Avg)</p>
          <p className="font-mono text-primary">{info.time}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Best Case</p>
          <p className="font-mono text-success">{info.best}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Worst Case</p>
          <p className="font-mono text-destructive">{info.worst}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Space</p>
          <p className="font-mono text-accent">{info.space}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Stable</p>
          <p className="font-mono text-info">{info.stable}</p>
        </div>
        <div className="flex gap-4 ml-auto items-center">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-xs text-muted-foreground">Unsorted</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent" /><span className="text-xs text-muted-foreground">Comparing</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-success" /><span className="text-xs text-muted-foreground">Sorted</span></div>
        </div>
      </div>

      {/* Algorithm Details */}
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
                    <span className="text-primary font-mono shrink-0">{i + 1}.</span>
                    {step}
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
