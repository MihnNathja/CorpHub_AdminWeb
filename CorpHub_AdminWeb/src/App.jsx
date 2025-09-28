import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
