import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ThemeProvider>
        {/* 👇 Bọc AppLayout + AppRoutes trong AuthInitializer */}
          <AppLayout>
            <AppRoutes />
          </AppLayout>
      </ThemeProvider>

      {/* ✅ ToastContainer ở cuối cùng */}
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
        theme="colored"
      />
    </>
  );
}

export default App;
