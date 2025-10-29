export type RouteProps = {
    path: string;
    component: React.FC;
};

export type LinkProps = {
    to: string;
    children: React.ReactNode;
};