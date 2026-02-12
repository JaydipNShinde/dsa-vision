import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DSALayout from "@/components/DSALayout";
import Index from "./pages/Index";
import SortingVisualizer from "./pages/SortingVisualizer";
import SearchingVisualizer from "./pages/SearchingVisualizer";
import StackVisualizer from "./pages/StackVisualizer";
import QueueVisualizer from "./pages/QueueVisualizer";
import LinkedListVisualizer from "./pages/LinkedListVisualizer";
import BinaryTreeVisualizer from "./pages/BinaryTreeVisualizer";
import HashTableVisualizer from "./pages/HashTableVisualizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DSALayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="/searching" element={<SearchingVisualizer />} />
            <Route path="/stack" element={<StackVisualizer />} />
            <Route path="/queue" element={<QueueVisualizer />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/binary-tree" element={<BinaryTreeVisualizer />} />
            <Route path="/hash-table" element={<HashTableVisualizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DSALayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
