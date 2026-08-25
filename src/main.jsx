import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)
