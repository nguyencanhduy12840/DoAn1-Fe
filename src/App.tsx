import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderListPage from "./pages/OrderListPage.tsx";

import OrderDetailPage from "./pages/OrderDetailPage.tsx";
import Profile from "./pages/Profile.tsx";
import ProtectedRoute from "./router/ProtectedRoute.tsx";
function App() {
  return (
    <>
      <ToastContainer aria-label={undefined} />
      <Router>
        <Routes>
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orderlist" element={<OrderListPage />} />
          <Route
            path="/orderlist/orderticket/client/:id"
            element={<OrderDetailPage />}
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
