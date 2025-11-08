import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Levels from "./pages/Levels";
import TopicMap from "./pages/TopicMap";
import LevelDetail from "./pages/LevelDetail";
import Profile from "./pages/Profile";
import Reels from "./pages/Reels";
import Workflows from "./pages/Workflows";
import NotFound from "./pages/NotFound";
import ClimateLesson from "./components/ClimateLesson";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/levels/topic/:topicId" element={<TopicMap />} />
          <Route path="/levels/:id" element={<LevelDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/climate-lesson" element={<ClimateLesson />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
