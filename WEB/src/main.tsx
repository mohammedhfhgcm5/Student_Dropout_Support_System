import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import DashboardPage from "./pages/DashboardPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ManageStudentsGuardiansSchools from "./components/dashboardStudents/ManageStudents";

// 🟢 Initialize React Query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

      <BrowserRouter>
    
     
      <Routes>
        <Route
              path="/dashboard"
              element={
                 <ProtectedRoute>
                  <DashboardPage />
                 </ProtectedRoute>
              }
            />
        <Route
              path="/"
              element={
                // <ProtectedRoute>
                  <LoginPage />
                // </ProtectedRoute>
              }
            />


            <Route path="/students" element={<ProtectedRoute>
              <ManageStudentsGuardiansSchools /></ProtectedRoute>} />

      </Routes>

       </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
