import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CityPatrol from "./pages/CityPatrol";
import EventReview from "./pages/EventReview";
import WorkOrder from "./pages/WorkOrder";
import Emergency from "./pages/Emergency";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => {
  console.log("City Management System initialized");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: "1440px",
            height: "100vh",
            margin: "0 auto",
            background: "rgb(8, 18, 38)",
          }}
        >
          {/* Top Tab Navigation Bar */}
          <Sidebar />

          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<CityPatrol />} />
              <Route path="/event-review" element={<EventReview />} />
              <Route path="/work-order" element={<WorkOrder />} />
              <Route path="/emergency" element={<Emergency />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;