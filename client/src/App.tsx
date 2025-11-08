import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import WhatsAppWidget from "./components/WhatsAppWidget";

// Lazy load pages
import ComoFunciona from "./pages/ComoFunciona";
import EncontrarVeiculo from "./pages/EncontrarVeiculo";
import Leiloes from "./pages/Leiloes";
import Localizacoes from "./pages/Localizacoes";
import Suporte from "./pages/Suporte";
import VenderMeuCarro from "./pages/VenderMeuCarro";
import VendaDireta from "./pages/VendaDireta";
import AcharPecas from "./pages/AcharPecas";
import Registrar from "./pages/Registrar";
import Entrar from "./pages/Entrar";
import VehicleDetail from "./pages/VehicleDetail";
import Admin from "./pages/Admin";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/como-funciona"} component={ComoFunciona} />
      <Route path={"/encontrar-veiculo"} component={EncontrarVeiculo} />
      <Route path={"/leiloes"} component={Leiloes} />
      <Route path={"/localizacoes"} component={Localizacoes} />
      <Route path={"/suporte"} component={Suporte} />
      <Route path={"/vender-meu-carro"} component={VenderMeuCarro} />
      <Route path={"/venda-direta"} component={VendaDireta} />
      <Route path={"/achar-pecas"} component={AcharPecas} />
      <Route path={"/registrar"} component={Registrar} />
      <Route path={"/entrar"} component={Entrar} />
      <Route path={"/veiculo/:id"} component={VehicleDetail} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
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
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <WhatsAppWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
