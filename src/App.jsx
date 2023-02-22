import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import HomePage from './pages/home.jsx';
import GamePage from './pages/game.jsx';
import ProjectPage from './pages/project.jsx';
import EditorPage from './pages/editor.jsx';
import SignInPage from './pages/signin.jsx';
import SignUpPage from './pages/signup.jsx';
import Header from './components/header.jsx';
import Navbar from './components/navbar.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from './auth.js';
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
    ReactDOMClient.createRoot(
        document.getElementById('root')).render(
            <Router>
                <Header user={user} />
                <div className='section'>
                    <Navbar user={user} />
                    <Routes>
                        <Route exact path="/" element={<HomePage />} />
                        <Route path="/play/:project" element={<GamePage user={user} />} />
                        <Route path="/projects" element={<ProjectPage user={user} />} />
                        <Route path="/edit/:project" element={<EditorPage user={user} />} />
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="*" element={<HomePage to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        )
});
/*
    <Route path="/project" element={<ProjectPage />} />
    <Route path="/edit/:game" element={<EditPage />} />
    <Route path="/favorite" element={<FavoritePage />} />
    <Route path="/play/:author/:game" element={<GamePage />} />
*/