import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/AppSidebar.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <SidebarProvider>
          <AppSidebar/>
          <main className="w-full">
              <App/>
          </main>
      </SidebarProvider>

  </StrictMode>,
)
