import './App.css'
import Navbar from './components/Navbar'
import CartList from './components/CartList'
import { Provider } from 'react-redux'
import store from './store/store'
import PriceBox from './components/PriceBox'
import { useSelector } from './hooks/useCustomRedux'
import Modal from './components/Modal'

function AppContent() {
  const { isOpen } = useSelector((state) => state.modal)

  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />}
    </>
  )
}




function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
