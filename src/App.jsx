import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import HomePage from './home.jsx';
import GamePage from './game.jsx';
import Header from './components/header.jsx';
import Navbar from './components/navbar.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOMClient.createRoot(document.getElementById('root')).render(
    <Router>
        <Header />
        <div className='section'>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/play" element={<GamePage />} />
            </Routes>
        </div>
    </Router>
)

/*
    <Route path="/project" element={<ProjectPage />} />
    <Route path="/edit/:game" element={<EditPage />} />
    <Route path="/favorite" element={<FavoritePage />} />
    <Route path="/play/:author/:game" element={<GamePage />} />
*/

/*import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyDlw_Sof26dEs6vMeBwxFMVjbrC2de27NI",
    authDomain: "unique-game-editor.firebaseapp.com",
    projectId: "unique-game-editor",
    storageBucket: "unique-game-editor.appspot.com",
    messagingSenderId: "1056383477214",
    appId: "1:1056383477214:web:8012d34ab394080a64a94f"
};
const app = initializeApp(firebaseConfig);*/