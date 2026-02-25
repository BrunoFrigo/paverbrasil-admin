import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Pedidos from "./pages/Pedidos";
import Anotacoes from "./pages/Anotacoes";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/pedidos"} component={Pedidos} />
      <Route path={"/anotacoes"} component={Anotacoes} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={Login} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
