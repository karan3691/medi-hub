import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContext from "./Context/Context.jsx";
import CartProvider from "./Context/CartContext.jsx";
import {
  Navbar,
  Footer,
  HomePage,
  AllDoctorsPage,
  SpecialitiesPage,
  MedicinesPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  FaqsPage,
  AboutUsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
  OrderHistoryPage,
  Appointment,
  AddtoCart,
  ProductsByCategory,
  // SingleMedicine,
  // GoToTop,
  Bot,
  PatientDashboardPage,
  ProductDetailsPage,
} from "./import-export/ImportExport.js";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/admin_dashboard_page/AdminDashboardPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/alldoctors" element={<AllDoctorsPage />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/book-appointment/:doctorId" element={<Appointment />} />
            <Route path="/patient-dashboard" element={<PatientDashboardPage />} />

            <Route path="/specialities" element={<SpecialitiesPage />} />

            <Route path="/medicines" element={<MedicinesPage />} />
            <Route
              path="/medicines/shop_by_category/:id"
              element={<ProductsByCategory />}
            />
            <Route path="/medicines/:id" element={<ProductDetailsPage />} />
            <Route path="/medicines/cart" element={<AddtoCart />} />
            <Route path="/medicines/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/medicines/order_history"
              element={<OrderHistoryPage />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

            <Route path="/*" element={<ErrorPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
            <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
            <Route
              path="/termsandconditions"
              element={<TermsAndConditionsPage />}
            />
          </Routes>
          <Bot />
          {/* <GoToTop /> */}
          <Footer />
          <ToastContainer position="top-right" />
        </CartProvider>
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
