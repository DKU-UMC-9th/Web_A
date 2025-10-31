// src/App.tsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [path, setPath] = useState(() => location.pathname);

  useEffect(() => {
    const onPop = () => setPath(location.pathname);
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  const go = (to: string) => {
    history.pushState({}, "", to);
    setPath(to);
    scrollTo(0, 0);
  };

  const Link = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.button === 1) return;
        e.preventDefault();
        go(to);
      }}
      style={{ marginRight: 12 }}
    >
      {children}
    </a>
  );

  let page: React.ReactNode = <NotFound />;
  if (path === "/") page = <Home />;
  else if (path === "/about") page = <About />;
  else {
    const m = path.match(/^\/posts\/([^/]+)$/);
    if (m) page = <Post id={m[1]} />;
  }

  return (
    <>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/posts/1">Post 1</Link>
        <Link to="/posts/2">Post 2</Link>
      </nav>
      <main style={{ padding: 16 }}>{page}</main>
    </>
  );
}

const Home = () => <h1>Home</h1>;
const About = () => <h1>About</h1>;
const Post = ({ id }: { id: string }) => <h1>Post #{id}</h1>;
const NotFound = () => <h1>404</h1>;
