// Entry point for React app
import { createRoot } from 'react-dom/client';
import './styles.css';
import HomePage from './HomePage';
import CateringPage from './CateringPage';
import MenuPage from './MenuPage';
import { LanguageProvider } from './hooks/useLanguage';

function resolvePage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/catering') {
    return <CateringPage />;
  }

  if (path === '/menu') {
    return <MenuPage />;
  }

  return <HomePage />;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <LanguageProvider>
    {resolvePage()}
  </LanguageProvider>,
);
