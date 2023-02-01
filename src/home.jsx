import React, { useState } from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="container">
            <Link to={`/play`} className="navbar-link-title">Start</Link>
        </div>
    )
}

export default HomePage;
