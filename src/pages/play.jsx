import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import GamePage from './game.jsx';
import { db } from '../auth.js';
import { doc, getDoc } from "firebase/firestore";

const PlayPage = (props) => {
    const goPath = useNavigate();
    const user = location.pathname.split('/')[1];
    const projectId = location.pathname.split('/')[2];
    const [uid, useUid] = useState(user === 'play' ? props.user.uid : user);
    if (user === 'play' && !props.user) {
        goPath('/signin');
    }
    if (user !== 'play') {
        const takeData = async () => {
            const path = doc(db, 'user', user, 'project', projectId);
            const docSnap = await getDoc(path);
            if (!docSnap.exists() || !docSnap.data().release) {
                goPath('/');
            }
        }
        takeData()
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className='container'>
            <GamePage uid={uid} projectId={projectId} />
            {user === 'play' &&
                <div className='container-btn-group'>
                    <Link to={"/edit/" + projectId} className="container-btn">
                        <img src="../image/icon_edit.png" alt="" />
                        <span className="tooltiptext">
                            Edit
                        </span>
                    </Link>
                </div>}
        </div>
    )
}

export default PlayPage;