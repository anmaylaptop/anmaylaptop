import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Applications from "./pages/Applications";
import Donors from "./pages/Donors";
import Students from "./pages/Students";
import Laptops from "./pages/Laptops";
import Motorbikes from "./pages/Motorbikes";
import Components from "./pages/Components";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/don-dang-ky" element={<Applications />} />
          <Route path="/nha-hao-tam" element={<Donors />} />
          <Route path="/sinh-vien" element={<Students />} />
          <Route path="/laptop" element={<Laptops />} />
          <Route path="/xe-may" element={<Motorbikes />} />
          <Route path="/linh-kien" element={<Components />} />
          <Route path="/bao-cao" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
