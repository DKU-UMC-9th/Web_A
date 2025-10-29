import { ThemeProvider } from "./context/ThemeProvider.tsx";
import NavBar from "./NavBar.tsx";
import ThemeContent from "./ThemeContent.tsx";

export default function App() {
  return (
    <>
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <NavBar />
        <main className="flex-1">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
    </>
  )
}