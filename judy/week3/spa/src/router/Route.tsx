import React, { useState, useEffect, type ReactElement, type ReactNode } from "react";
import type { RouteProps } from "../types/type";

type RoutesProps = {
  children: ReactNode;
};

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const activeRoute = React.Children.toArray(children).find((child) => {
    if (React.isValidElement<RouteProps>(child)) {
      return child.props.path === currentPath;
    }
    return false;
  }) as ReactElement<RouteProps> | undefined;

  return activeRoute ? React.cloneElement(activeRoute) : <h1>404 Not Found</h1>;
};

export const Route: React.FC<RouteProps> = ({ component: Component }) => {
  return <Component />;
};