import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DataManagement from "./pages/DataManagement";
import Statistics from "./pages/Statistics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data" element={<DataManagement />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;