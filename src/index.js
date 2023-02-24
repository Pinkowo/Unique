import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import '../public/main.scss';
import { auth } from './auth.js';
import { onAuthStateChanged } from "firebase/auth";
import App from './App.jsx';

const root = ReactDOMClient.createRoot(
    document.getElementById('root')
);

onAuthStateChanged(auth, (user) => {
    root.render(<App user={user} />);
});