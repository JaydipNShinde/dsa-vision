import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type AlgoType = "bubble" | "selection" | "insertion" | "merge" | "quick";

const ALGO_INFO: Record<AlgoType, { name: string; time: string; space: string }> = {
  bubble: { name: "Bubble Sort", time: "O(n²)", space: "O(1)" },
  selection: { name: "Selection Sort", time: "O(n²)", space: "O(1)" },
  insertion: { name: "Insertion Sort", time: "O(n²)", space: "O(1)" },
  merge: { name: "Merge Sort", time: "O(n log n)", space: "O(n)" },
  quick: { name: "Quick Sort", time: "O(n log n)", space: "O(log n)" },
};

function generateArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export default function SortingVisualizer() {
  const [size, setSize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState(() => generateArray(30));
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [algo, setAlgo] = useState<AlgoType>("bubble");
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  const delay = useCallback(() => new Promise<void>((r) => setTimeout(r, Math.max(5, 200 - speed * 2))), [speed]);

  const reset = () => {
    stopRef.current = true;
    setRunning(false);
    setComparing([]);
    setSorted([]);
    const newArr = generateArray(size);
    setArray(newArr);
  };

  const shuffle = () => {
    if (running) return;
    setArray(generateArray(size));
    setSorted([]);
    setComparing([]);
  };

  const bubbleSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 0; i < a.length && !stopRef.current; i++) {
      for (let j = 0; j < a.length - i - 1 && !stopRef.current; j++) {
        setComparing([j, j + 1]);
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        setArray([...a]);
        await delay();
      }
      setSorted((p) => [...p, a.length - 1 - i]);
    }
    setSorted(a.map((_, i) => i));
  };

  const selectionSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 0; i < a.length && !stopRef.current; i++) {
      let min = i;
      for (let j = i + 1; j < a.length && !stopRef.current; j++) {
        setComparing([min, j]);
        if (a[j] < a[min]) min = j;
        await delay();
      }
      [a[i], a[min]] = [a[min], a[i]];
      setArray([...a]);
      setSorted((p) => [...p, i]);
    }
    setSorted(a.map((_, i) => i));
  };

  const insertionSort = async (arr: number[]) => {
    const a = [...arr];
    for (let i = 1; i < a.length && !stopRef.current; i++) {
      let j = i;
      while (j > 0 && a[j] < a[j - 1] && !stopRef.current) {
        setComparing([j, j - 1]);
        [a[j], a[j - 1]] = [a[j - 1], a[j]];
        setArray([...a]);
        await delay();
        j--;
      }
    }
    setSorted(a.map((_, i) => i));
  };

  const mergeSort = async (arr: number[]) => {
    const a = [...arr];
    const mergeSortHelper = async (start: number, end: number) => {
      if (start >= end || stopRef.current) return;
      const mid = Math.floor((start + end) / 2);
      await mergeSortHelper(start, mid);
      await mergeSortHelper(mid + 1, end);
      const left = a.slice(start, mid + 1);
      const right = a.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;
      while (i < left.length && j < right.length && !stopRef.current) {
        setComparing([k, mid + 1 + j]);
        if (left[i] <= right[j]) { a[k++] = left[i++]; }
        else { a[k++] = right[j++]; }
        setArray([...a]);
        await delay();
      }
      while (i < left.length && !stopRef.current) { a[k++] = left[i++]; setArray([...a]); await delay(); }
      while (j < right.length && !stopRef.current) { a[k++] = right[j++]; setArray([...a]); await delay(); }
    };
    await mergeSortHelper(0, a.length - 1);
    setSorted(a.map((_, i) => i));
  };

  const quickSort = async (arr: number[]) => {
    const a = [...arr];
    const qs = async (low: number, high: number) => {
      if (low >= high || stopRef.current) return;
      const pivot = a[high];
      let i = low - 1;
      for (let j = low; j < high && !stopRef.current; j++) {
        setComparing([j, high]);
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          setArray([...a]);
        }
        await delay();
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      setArray([...a]);
      setSorted((p) => [...p, i + 1]);
      await qs(low, i);
      await qs(i + 2, high);
    };
    await qs(0, a.length - 1);
    setSorted(a.map((_, i) => i));
  };

  const run = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    setSorted([]);
    setComparing([]);
    const sortFn = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, merge: mergeSort, quick: quickSort }[algo];
    await sortFn(array);
    setRunning(false);
    setComparing([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Sorting <span className="text-primary">Algorithms</span>
        </h1>
        <p className="text-muted-foreground mt-1">Watch how different sorting algorithms organize data</p>
      </div>

      {/* Controls */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
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

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Size: {size}</span>
          <Slider
            value={[size]}
            onValueChange={([v]) => { if (!running) { setSize(v); setArray(generateArray(v)); setSorted([]); } }}
            min={10}
            max={80}
            step={1}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed</span>
          <Slider value={[speed]} onValueChange={([v]) => setSpeed(v)} min={1} max={100} step={1} className="w-24" />
        </div>

        <div className="flex gap-2">
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

      {/* Visualization */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-end justify-center gap-[2px] h-80">
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

      {/* Info */}
      <div className="glass rounded-xl p-4 flex gap-6">
        <div>
          <p className="text-xs text-muted-foreground">Algorithm</p>
          <p className="font-semibold text-foreground">{ALGO_INFO[algo].name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Time Complexity</p>
          <p className="font-mono text-primary">{ALGO_INFO[algo].time}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Space Complexity</p>
          <p className="font-mono text-accent">{ALGO_INFO[algo].space}</p>
        </div>
        <div className="flex gap-4 ml-auto items-center">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-xs text-muted-foreground">Unsorted</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent" /><span className="text-xs text-muted-foreground">Comparing</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-success" /><span className="text-xs text-muted-foreground">Sorted</span></div>
        </div>
      </div>
    </div>
  );
}
