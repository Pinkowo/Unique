import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import HomePage from './pages/home.jsx';
import GamePage from './pages/game.jsx';
import EditorPage from './pages/editor.jsx';
import Header from './components/header.jsx';
import Navbar from './components/navbar.jsx';
import EditPanel from './components/editPanel.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOMClient.createRoot(document.getElementById('root')).render(
    <Router>
        <Header />
        <div className='section'>
            <Navbar />
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/play" element={<GamePage />} />
                <Route path="/editor" element={<EditorPage />} />
            </Routes>
            <EditPanel />
        </div>
    </Router>
)

/*
    <Route path="/project" element={<ProjectPage />} />
    <Route path="/edit/:game" element={<EditPage />} />
    <Route path="/favorite" element={<FavoritePage />} />
    <Route path="/play/:author/:game" element={<GamePage />} />
*/