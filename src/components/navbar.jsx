import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

const Navbar = (props) => {
    const [navbarClass, useNavbarClass] = useState('open');
    const [arrowClass, useArrowClass] = useState('fa fa-arrow-left');
    const [display, useDisplay] = useState('none');
    const [current, useCurrent] = useState('Projects');
    const data = useLocation();

    useEffect(() => {
        if (data.state === '/home') {
            useCurrent(data);
        }
    }, [data]);

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

    function handleChange(name) {
        useCurrent(name);
    }

    return (
        <div className={navbarClass} style={{ display }}>
            <ul>
                <Navigation name='Projects' link='/projects' class='navbar-link-title'
                    current={current} handleChange={handleChange} />
                {/* <Navigation name='Favorites' link='/' class='navbar-link'
                    current={current} handleChange={handleChange} /> */}
                <Navigation name='Tutorial' link='/tutorial' class='navbar-link'
                    current={current} handleChange={handleChange} />
                {/* <Navigation name='Settings' link='/' class='navbar-link'
                    current={current} handleChange={handleChange} /> */}
            </ul>
            <div onClick={handleClick}>
                <i className={arrowClass} aria-hidden="true"></i>
            </div>
        </div >
    )
}

export default Navbar;

const Navigation = (props) => {
    const [display, useDisplay] = useState('none');
    const [height, useHeight] = useState('');

    useEffect(() => {
        if (props.class === 'navbar-link-title')
            useHeight('80px');
    }, []);

    useEffect(() => {
        useDisplay(props.current === props.name ? 'flex' : 'none');
    }, [props.current]);

    return (
        <li style={{ height }}>
            <Link to={props.link} className={props.class}
                onClick={() => { props.handleChange(props.name) }}>
                {props.name}
                <span style={{ display }}>◂</span>
            </Link>
        </li>
    )
}