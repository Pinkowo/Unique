// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import GamePage from './game.jsx';
// import { db } from '../auth.js';
// import { doc, getDoc } from "firebase/firestore";
// import { UserContext } from '../index.js';

// const PlayPage = () => {
//     const goPath = useNavigate();
//     const user = useContext(UserContext);
//     const path = location.pathname.split('/')[1];
//     const projectId = location.pathname.split('/')[2];
//     const uid = user === 'play' ? user.uid : path;
//     const [info, setInfo] = useState({ userName: '', projectName: '' });

//     useEffect(() => {
//         if (path === 'play' && !user) {
//             goPath('/signin');
//         }
//         if (path !== 'play') {
//             const takeData = async () => {
//                 const docSnap = await getDoc(doc(db, 'user', path, 'project', projectId));
//                 if (docSnap.exists() && docSnap.data().release) {
//                     const userDoc = await getDoc(doc(db, 'user', path));
//                     setInfo({ userName: userDoc.data().name, projectName: docSnap.data().name });
//                 } else {
//                     goPath('/');
//                 }
//             }
//             takeData()
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         }
//     }, [user]);

//     return (
//         <div className='container'>
//             {path !== 'play' &&
//                 <div className='game-info'>
//                     <h1>{info.projectName}</h1>
//                     <h3>{info.userName}</h3>
//                     {/* <div className='game-favorite'>
//                         <button>Add to Favorites</button>
//                     </div> */}
//                     <div className='game-refresh'>
//                         <button onClick={() => { location.reload() }}>
//                             <i className="fa fa-repeat" aria-hidden="true"></i>
//                         </button>
//                     </div>
//                 </div>}
//             <GamePage uid={uid} projectId={projectId} />
//             {path === 'play' &&
//                 <div className='container-btn-group'>
//                     <Link to={"/edit/" + projectId} className="container-btn">
//                         <img src="../image/icon_edit.png" alt="" />
//                         <span className="tooltiptext">
//                             Edit
//                         </span>
//                     </Link>
//                 </div>}
//         </div>
//     )
// }

// export default PlayPage;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import GamePage from './game.jsx';
import { db } from '../auth.js';
import { doc, getDoc } from "firebase/firestore";

const PlayPage = (props) => {
    const goPath = useNavigate();
    const user = location.pathname.split('/')[1];
    const projectId = location.pathname.split('/')[2];
    const uid = user === 'play' ? props.user.uid : user;
    const [info, setInfo] = useState({ userName: '', projectName: '' });

    useEffect(() => {
        if (user === 'play' && !props.user) {
            goPath('/signin');
        }
        if (user !== 'play') {
            const takeData = async () => {
                const docSnap = await getDoc(doc(db, 'user', user, 'project', projectId));
                if (docSnap.exists() && docSnap.data().release) {
                    const userDoc = await getDoc(doc(db, 'user', user));
                    setInfo({ userName: userDoc.data().name, projectName: docSnap.data().name });
                } else {
                    goPath('/');
                }
            }
            takeData()
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    return (
        <div className='container'>
            {user !== 'play' &&
                <div className='game-info'>
                    <h1>{info.projectName}</h1>
                    <h3>{info.userName}</h3>
                    {/* <div className='game-favorite'>
                        <button>Add to Favorites</button>
                    </div> */}
                    <div className='game-refresh'>
                        <button onClick={() => { location.reload() }}>
                            <i className="fa fa-repeat" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>}
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



// const FavoriteBtn = () => {
//     return (
//         <button>Add to Favorites</button>
//     )
// }