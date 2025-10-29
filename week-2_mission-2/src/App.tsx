import './App.css'
import { ThemeProvider } from "./context/ThemeProvider";
import NavBar from "./NavBar.tsx";
import ThemeContent from "./ThemeContent.tsx";

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  )
}