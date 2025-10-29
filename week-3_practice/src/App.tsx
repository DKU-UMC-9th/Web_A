import './App.css'
import { Link, Route, Router } from './router'

const JjeonguPage = () => <h1>현지 페이지</h1>
const AeongPage = () => <h1>애옹 페이지</h1>
const JoyPage = () => <h1>조이 페이지</h1>
const NotFoundPage = () => <h1>404</h1>

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px'}}>
      <Link to='/jjeongu'>JJEOGU</Link>
      <Link to='/aeong'>AEONG</Link>
      <Link to='/joy'>JOY</Link>
      <Link to='/not-found'>NOT-FOUND</Link>
    </nav>
  );
};

function App() {
    return (
      <>
        <Header />
        <Router>
          <Route path='/jjeongu' component={JjeonguPage} />
          <Route path='/aeong' component={AeongPage} />
          <Route path='/joy' component={JoyPage} />
          <Route path='/not-found' component={NotFoundPage} />
        </Router>
      </>
    );
}

export default App;
