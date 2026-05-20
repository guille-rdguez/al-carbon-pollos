// Entry point for React app
import { createRoot } from 'react-dom/client';
import './styles.css';
import HomePage from './HomePage';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<HomePage />);
