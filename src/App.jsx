import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Toaster } from "sonner";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <div className="flex justify-center items-center h-screen bg-[#1f2937]">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      <Toaster richColors/>
    </BrowserRouter>
    </ThemeProvider>
    </div>
  );
}

export default App;