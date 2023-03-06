import React from 'react';
import HomePage from './pages/home.jsx';
import PlayPage from './pages/play.jsx';
import ProjectPage from './pages/project.jsx';
import EditorPage from './pages/editor.jsx';
import SignInPage from './pages/signin.jsx';
import SignUpPage from './pages/signup.jsx';
import TutorialPage from './pages/tutorial.jsx'
import Header from './components/header.jsx';
import Navbar from './components/navbar.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = (props) => {
    return (
        <Router>
            <Header user={props.user} />
            <div className='section'>
                <Navbar user={props.user} />
                <Routes>
                    <Route exact path="/" element={<HomePage user={props.user} />} />
                    <Route path="/play/:project" element={<PlayPage user={props.user} />} />
                    <Route path="/projects" element={<ProjectPage user={props.user} />} />
                    <Route path="/edit/:project" element={<EditorPage user={props.user} />} />
                    <Route path="/signin" element={<SignInPage user={props.user} />} />
                    <Route path="/signup" element={<SignUpPage user={props.user} />} />
                    <Route path="/:user/:project" element={<PlayPage user={props.user} />} />
                    <Route path="/tutorial" element={<TutorialPage />} />
                    <Route path="*" element={<HomePage to="/" replace />} />
                </Routes>
            </div>
        </Router>
    )
}
export default App;

/*
    <Route path="/favorite" element={<FavoritePage />} />
    <Route path="/play/:author/:game" element={<GamePage />} />
*/