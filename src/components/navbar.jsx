import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Navbar = (props) => {
    const [navbarClass, useNavbarClass] = useState('close');
    const [arrowClass, useArrowClass] = useState('fa fa-arrow-right');
    const [display, useDisplay] = useState('none');

    useEffect(() => {
        if (props.user) {
            useDisplay('flex');
        } else {
            useDisplay('none');
        }
    }, []);

    function handleClick() {
        if (navbarClass === 'open') {
            useNavbarClass('close');
            useArrowClass('fa fa-arrow-right');
            return;
        }
        if (navbarClass === 'close') {
            useNavbarClass('open');
            useArrowClass('fa fa-arrow-left');
            return;
        }
    }

    return (
        <div className={navbarClass} style={{ display }}>
            <ul>
                <li style={{ height: '80px' }}>
                    <Link to="/projects" className="navbar-link-title">
                        Projects
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Favorites
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Tutorial
                    </Link>
                </li>
                <li>
                    <Link to="/play" className="navbar-link">
                        Settings
                    </Link>
                </li>
            </ul>
            <button onClick={handleClick}>
                <i className={arrowClass} aria-hidden="true"></i>
            </button>
        </div >
    )
}

export default Navbar;