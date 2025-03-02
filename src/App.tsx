
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MediaProvider } from "./context/MediaContext";

import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import MediaDetail from "./pages/MediaDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MediaProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />
              <Route path="/media/:mediaId" element={<MediaDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MediaProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
