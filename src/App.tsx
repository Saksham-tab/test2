import React from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchOverlay } from './components/navigation/SearchOverlay';
import { MobileMenuDrawer } from './components/navigation/MobileMenuDrawer';
import { ChatbotWidget } from './components/ai/ChatbotWidget';
import { ToastContainer } from './components/ui/ToastContainer';

// Feature Pages
import { HomePage } from './features/home/HomePage';
import { ShopPage } from './features/catalog/ShopPage';
import { ProductDetailPage } from './features/catalog/ProductDetailPage';
import { CategoryPage } from './features/catalog/CategoryPage';
import { ConcernPage } from './features/catalog/ConcernPage';
import { RitualDetailPage } from './features/rituals/RitualDetailPage';
import { WellnessGuidePage } from './features/ai/WellnessGuidePage';
import { IngredientsPage } from './features/content/IngredientsPage';
import { JournalPage } from './features/content/JournalPage';
import { CartPage } from './features/commerce/CartPage';
import { CheckoutPage } from './features/commerce/CheckoutPage';
import { OrderConfirmationPage } from './features/commerce/OrderConfirmationPage';
import { WishlistPage } from './features/commerce/WishlistPage';
import { AccountPage } from './features/account/AccountPage';
import { AboutPage } from './features/content/AboutPage';
import { FAQPage } from './features/content/FAQPage';
import { ContactPage } from './features/content/ContactPage';
import { PolicyPage } from './features/content/PolicyPage';
import { Button } from './components/ui/Button';

const MainView: React.FC = () => {
  const { path, navigate } = useRouter();

  const renderCurrentRoute = () => {
    // Exact routes
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    if (path === '/shop') {
      return <ShopPage />;
    }

    if (path === '/wellness-guide') {
      return <WellnessGuidePage />;
    }

    if (path === '/cart') {
      return <CartPage />;
    }

    if (path === '/checkout') {
      return <CheckoutPage />;
    }

    if (path === '/order-confirmation') {
      return <OrderConfirmationPage />;
    }

    if (path === '/wishlist') {
      return <WishlistPage />;
    }

    if (path === '/account') {
      return <AccountPage tab="orders" />;
    }

    if (path === '/account/orders') {
      return <AccountPage tab="orders" />;
    }

    if (path === '/account/addresses') {
      return <AccountPage tab="addresses" />;
    }

    if (path === '/about') {
      return <AboutPage />;
    }

    if (path === '/faq') {
      return <FAQPage />;
    }

    if (path === '/contact') {
      return <ContactPage />;
    }

    // Dynamic routes
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '').split('/')[0];
      return <ProductDetailPage slug={slug} />;
    }

    if (path.startsWith('/categories/')) {
      const slug = path.replace('/categories/', '').split('/')[0];
      return <CategoryPage slug={slug} />;
    }

    if (path.startsWith('/concerns/')) {
      const slug = path.replace('/concerns/', '').split('/')[0];
      return <ConcernPage slug={slug} />;
    }

    if (path.startsWith('/rituals/')) {
      const slug = path.replace('/rituals/', '').split('/')[0];
      return <RitualDetailPage slug={slug} />;
    }

    if (path === '/ingredients') {
      return <IngredientsPage />;
    }

    if (path.startsWith('/ingredients/')) {
      const slug = path.replace('/ingredients/', '').split('/')[0];
      return <IngredientsPage slug={slug} />;
    }

    if (path === '/journal') {
      return <JournalPage />;
    }

    if (path.startsWith('/journal/')) {
      const slug = path.replace('/journal/', '').split('/')[0];
      return <JournalPage slug={slug} />;
    }

    if (path.startsWith('/policies/')) {
      const slug = path.replace('/policies/', '').split('/')[0];
      return <PolicyPage policySlug={slug} />;
    }

    // 404 fallback
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
          Error 404
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] mt-2">
          Page Not Found
        </h1>
        <p className="text-xs text-[#635F59] mt-2 leading-relaxed">
          The path you sought does not exist in our apothecary. You may return to the homepage or explore our complete catalog.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/')}>
            Return Home
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/shop')}>
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#23201D]">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>
      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <SearchOverlay />
      <MobileMenuDrawer />
      <ChatbotWidget />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <MainView />
    </RouterProvider>
  );
}
