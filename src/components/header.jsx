import React from 'react';

const Header = () => {

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
        }
    }

    return (
        <div className="header">
            <div className="header-container">
                <a>Unique</a>
                <div id="signin">
                    <button onClick={() => sign(true)}>
                        <i className="fa fa-sign-in" aria-hidden="true"></i>
                    </button>
                </div>
                <div id="signout" style={{ display: 'none' }}>
                    <img src="https://xsgames.co/randomusers/assets/avatars/pixel/4.jpg" alt="" />
                    <span>Pink</span>
                    <button onClick={() => sign(false)}>
                        <i className="fa fa-sign-out" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header;