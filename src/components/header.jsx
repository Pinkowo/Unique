import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { auth } from '../auth.js';
import { signOut } from "firebase/auth";

const Header = (props) => {
    const [name, useName] = useState('');
    const [photo, usePhoto] = useState(0);

    useEffect(() => {
        if (props.user) {
            useName(props.user.displayName);
            usePhoto(props.user.photoURL);
            sign(true);
        }
    }, []);

    function sign(signin = true) {
        const signinDiv = document.getElementById("signin");
        const signoutDiv = document.getElementById("signout");
        if (signin) {
            signinDiv.style.display = 'none';
            signoutDiv.style.display = 'flex';
        }
        if (!signin) {
            signinDiv.style.display = 'flex';
            signoutDiv.style.display = 'none';
            signOut(auth).then(() => {
                location.href = "/";
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    return (
        <div className="header">
            <div className="header-container">
                <a href='/'>Unique</a>
                <div id="signin">
                    <Link to={`/signin`} className="navbar-link-title">
                        <i className="fa fa-sign-in" aria-hidden="true"></i>
                    </Link>
                </div>
                <div id="signout" style={{ display: 'none' }}>
                    <img src={photo} alt="" />
                    <span>{name}</span>
                    <button onClick={() => sign(false)}>
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header;