import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'
import axios from 'axios'

//요청 시 자동으로 헤더에 토큰을 담아서 보내줌.
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider
              style={
                      {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                      }
                    }>
          <App />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </BrowserRouter>
)
