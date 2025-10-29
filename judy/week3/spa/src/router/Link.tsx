import type { LinkProps } from "../types/type";

export const Link: React.FC<LinkProps> = ({ to, children }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if(window.location.pathname === to) return;
        window.history.pushState({}, "", to);
        const navEvent = new PopStateEvent("popstate");
        window.dispatchEvent(navEvent);
    };

    return (
        <a href={to} onClick={handleClick} style={{ marginRight : "10px"}}>
            {children}
        </a>
    )
}