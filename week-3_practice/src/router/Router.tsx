import { type FC, useMemo, Children, cloneElement, type ReactNode, type ReactElement, useState, useEffect } from "react";
import { Route, type RouteProps } from './Route';

interface RoutesProps {
    children: ReactNode;
}

const useCurrentPath = () => {
    const [path, setPath] = useState(window.location.pathname);
    
    useEffect(() => {
        const onLocationChange = () => setPath(window.location.pathname);
        window.addEventListener('popstate', onLocationChange);
        return () => window.removeEventListener('popstate', onLocationChange);
    }, []);

    return path;
} 

const isRouteElement = (child: ReactNode): child is ReactElement<RouteProps> => {
    return (child as ReactElement).type === Route;
}

export const Router: FC<RoutesProps> = ({ children}) => {
    const currentPath = useCurrentPath();
    const activeRoute = useMemo(() => {
        const routes = Children.toArray(children).filter(isRouteElement);
        return routes.find((route) => route.props.path === currentPath);
    }, [children, currentPath]);

    if (!activeRoute) return null;

    const ComponentToRender = activeRoute.props.component;
    return <ComponentToRender />;
}