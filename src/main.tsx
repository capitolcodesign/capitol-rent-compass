
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTheme } from './components/admin/theme/ThemeSettingsService.ts'

// Add a console log to help with debugging
console.log("Application starting...");

// Initialize theme
initializeTheme().catch(error => {
  console.error('Failed to initialize theme:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
