import Navigation from './components/Navigation';
import LiveMenu from './components/LiveMenu';
import CartBar from './components/CartBar';
import Footer from './components/Footer';
import { CartProvider } from './hooks/useCart';

export default function MenuPage() {
  return (
    <CartProvider>
      <div className="bg-coal-950 min-h-screen flex flex-col text-coal-50">
        <Navigation />
        <main>
          <LiveMenu />
        </main>
        <Footer />
        <CartBar />
      </div>
    </CartProvider>
  );
}
