import { Link, useLocation } from 'react-router-dom';

export default function Navigation () {
    const location = useLocation();

    return (
        <nav>
            {location.pathname === '/' ? (
                <span>Meminate!</span>
            ) : (
                <Link to="/">Meminate</Link>
            )}
            {' | '}
            {location.pathname === '/self-meminator' ? (
                <span>Build your own meme!</span>
            ) : (
                <Link to="/self-meminator">Build your own meme!</Link>
            )}
        </nav>

    );
}
