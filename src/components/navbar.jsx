import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <ul>
                <li style={{ height: '80px' }}>
                    <Link to="/" className="navbar-link-title">
                        Project
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Favorite
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Assets
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Tutorial
                    </Link>
                </li>
            </ul>
        </div >
    )
}

export default Navbar;