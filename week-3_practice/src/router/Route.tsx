import type { ComponentType } from "react";

export interface RouteProps {
    path: string;
    component: ComponentType;
}

export const Route = ({ component }: RouteProps) => {
    return null;
};