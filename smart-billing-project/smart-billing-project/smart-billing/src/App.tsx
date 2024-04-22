import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/contexts/AuthProvider";
import RequireAuth from "./components/helpers/RequireAuth";
import Dashboard from "./components/routes/Dashboard";
import Home from "./components/routes/Home";
import Login from "./components/routes/Login";
import Products from "./components/routes/Products";
import SignUp from "./components/routes/SignUp";
import BillingSection from "./components/sections/BillingSection";
import HistorySection from "./components/sections/HistorySection";
import PaymentCheckout from "./components/sections/PaymentCheckout";
import ProductsSection from "./components/sections/ProductsSection";
import ProfileSection from "./components/sections/ProfileSection";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5C48DA",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Dashboard />}>
            <Route path="/" element={<BillingSection />} />
            <Route path="/billing" element={<BillingSection />} />
            <Route
              path="history"
              element={
                <RequireAuth>
                  <HistorySection />
                </RequireAuth>
              }
            />
            <Route path="profile" element={<ProfileSection />} />
            <Route path="products" element={<ProductsSection />} />
            <Route path="payment" element={<PaymentCheckout />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
