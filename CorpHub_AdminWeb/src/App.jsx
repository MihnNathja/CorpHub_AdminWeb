import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </ThemeProvider>
      </BrowserRouter>
      {/* ToastContainer ở cuối cùng */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // hoặc "light", "dark"
      />
    </>

  );
}

export default App;
