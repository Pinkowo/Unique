import React from 'react';
import useScript from './components/useScript.jsx';

const GamePage = () => {
    useScript('./game/view.js');
    useScript('./game/controller.js');
    return (
        <div className='container'>
            <div id="game-window">
                <div id="score">
                    <img src="./image/star.png" alt="" />
                    <p>x <span id="score-number">0</span></p>
                </div>
            </div>
        </div>
    )
}

export default GamePage;