// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";

const Header = ({ headingText }) => {
    const location = useLocation().pathname
    return (
        <header>
           
             <h1 id="headingText" className="fade">{headingText}</h1>
             {
                (location === '/products' || location === '/users' || location === '/dashboard') &&<div className="links">
                <Link to={'users'}>Users</Link>
                <Link to={'products'}>Product</Link>
            </div>
             }
            

        </header>
    );
};

export default Header;





