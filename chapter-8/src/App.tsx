import './App.css'
import Cart from './components/Cart'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

function App() {
  const amount = useSelector((state: RootState) => state.cart.amount);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-800 text-white flex items-center px-6 z-30 shadow-md">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <h1 className="text-xl font-bold">Ohtani Ahn</h1>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-semibold text-lg">{amount}</span>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <Cart />
      </main>
    </div>
  )
}

export default App
