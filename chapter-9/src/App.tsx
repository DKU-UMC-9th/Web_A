import './App.css'
import Navbar from './components/Navbar'
import CartList from './components/CartList'
import PriceBox from './components/PriceBox'
import Modal from './components/Modal'
import { useModalStore } from './hooks/useModalStore'






function App() {


  const { isOpen } = useModalStore()
  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />}
    </>
  )
}

export default App
