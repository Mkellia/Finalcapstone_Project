import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import BuyerDashboardPage from './pages/BuyerDashboardPage.jsx';
import BuyerDisputesPage from './pages/BuyerDisputesPage.jsx';
import BuyerConfirmDeliveryPage from './pages/BuyerConfirmDeliveryPage.jsx';
import BuyerMakePaymentPage from './pages/BuyerMakePaymentPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SellerCreateOrderPage from './pages/SellerCreateOrderPage.jsx';
import SellerDashboardPage from './pages/SellerDashboardPage.jsx';
import SellerOrderDetailsPage from './pages/SellerOrderDetailsPage.jsx';

function App() {
  if (window.location.pathname === '/login') {
    return <LoginPage />;
  }
  if (window.location.pathname === '/register') {
    return <RegisterPage />;
  }
  if (window.location.pathname === '/buyer-dashboard') {
    return <BuyerDashboardPage />;
  }
  if (window.location.pathname === '/buyer-disputes') {
    return <BuyerDisputesPage />;
  }
  if (window.location.pathname === '/buyer-make-payment') {
    return <BuyerMakePaymentPage />;
  }
  if (window.location.pathname === '/buyer-confirm-delivery') {
    return <BuyerConfirmDeliveryPage />;
  }
  if (window.location.pathname === '/admin-dashboard') {
    return <AdminDashboardPage />;
  }
  if (window.location.pathname === '/seller-dashboard') {
    return <SellerDashboardPage />;
  }
  if (window.location.pathname === '/buyer-create-order') {
    return <SellerCreateOrderPage />;
  }
  if (window.location.pathname === '/buyer-orders') {
    return <SellerOrderDetailsPage />;
  }
  if (window.location.pathname === '/seller-orders') {
    return <SellerOrderDetailsPage />;
  }
  if (window.location.pathname === '/seller-order-details') {
    return <SellerOrderDetailsPage />;
  }

  return <HomePage />;
}

export default App;
