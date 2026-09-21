import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './app.css'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from "react-hot-toast";

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <AppRoutes />
    </>
  )
}
