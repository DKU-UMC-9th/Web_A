import { Link } from "./router/Link";
import { Routes, Route } from "./router/Route";

const Home: React.FC = () => <h1>🏠 메인 페이지</h1>;
const About: React.FC = () => <h1>💡 상세정보 페이지</h1>;
const Chat: React.FC = () => <h1>💬 채팅 페이지</h1>;

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/chat">Chat</Link>
      </nav>

      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/chat" component={Chat} />
      </Routes>
    </>
  );
}

export default App;
