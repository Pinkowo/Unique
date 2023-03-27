// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from "react-router-dom";
// import GamePage from './game.jsx';
// import { db } from '../auth.js';
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { UserContext } from '../index.js';

// const HomePage = () => {
//     const user = useContext(UserContext);
//     const [value, setValue] = useState({
//         finished: false,
//         userId: '',
//         userName: '',
//         projectId: '',
//         projectName: ''
//     });
//     useEffect(() => {
//         const takeData = async () => {
//             let uids = [];
//             let projects = [];
//             const users = await getDocs(collection(db, "user"));
//             users.forEach(doc => {
//                 if (doc.data().projectNum > 0) uids.push({ uid: doc.id, name: doc.data().name });
//             });

//             do {
//                 const randomUserIndex = Math.floor(Math.random() * uids.length);
//                 const user = uids[randomUserIndex];

//                 const q = query(collection(db, "user", user.uid, 'project'), where("release", "==", true));
//                 const querySnapshot = await getDocs(q);
//                 querySnapshot.forEach((doc) => {
//                     projects.push({ pid: doc.id, pname: doc.data().name });
//                 });
//                 if (projects.length == 0) {
//                     uids.splice(randomUserIndex, 1);
//                 } else {
//                     const randomProjectIndex = Math.floor(Math.random() * projects.length);
//                     const project = projects[randomProjectIndex];
//                     setValue({
//                         finished: true,
//                         userId: user.uid,
//                         userName: user.name,
//                         projectId: project.pid,
//                         projectName: project.pname
//                     });
//                 }
//             } while (projects.length === 0 || uids.length === 0);
//         }
//         takeData()
//             .catch((err) => {
//                 console.log(err);
//             });
//     }, []);
//     return (
//         <div className="container home">
//             {value.projectId !== '' && (
//                 <GamePage uid={value.userId} projectId={value.projectId} />)}
//             <div className='home-panel'>
//                 <Info gameName={value.projectName} authorName={value.userName} />
//                 <Keyboard />
//                 <div className='home-btn'>
//                     {value.finished &&
//                         <div className='home-btn-play'>
//                             <Link to={value.userId + '/' + value.projectId}>
//                                 Play
//                             </Link>
//                         </div>}
//                     {!user &&
//                         <div className='home-btn-signup'>
//                             <Link to={`/signup`}>
//                                 Sign Up
//                             </Link>
//                         </div>}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import GamePage from './game.jsx';
import { db } from '../auth.js';
import { collection, getDocs, query, where } from "firebase/firestore";

const HomePage = (props) => {
    const [value, setValue] = useState({
        finished: false,
        userid: '',
        userName: '',
        projectId: '',
        projectName: ''
    });
    useEffect(() => {
        const takeData = async () => {
            let uids = [];
            let projects = [];
            const users = await getDocs(collection(db, "user"));
            users.forEach(doc => {
                if (doc.data().projectNum > 0) uids.push({ uid: doc.id, name: doc.data().name });
            });

            do {
                const randomUserIndex = Math.floor(Math.random() * uids.length);
                const user = uids[randomUserIndex];

                const q = query(collection(db, "user", user.uid, 'project'), where("release", "==", true));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    projects.push({ pid: doc.id, pname: doc.data().name });
                });
                if (projects.length == 0) {
                    uids.splice(randomUserIndex, 1);
                } else {
                    const randomProjectIndex = Math.floor(Math.random() * projects.length);
                    const project = projects[randomProjectIndex];
                    setValue({
                        finished: true,
                        userid: user.uid,
                        userName: user.name,
                        projectId: project.pid,
                        projectName: project.pname
                    });
                }
            } while (projects.length === 0 || uids.length === 0);
        }
        takeData()
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div className="container home">
            {value.projectId !== '' && (
                <GamePage uid={value.userid} projectId={value.projectId} />)}
            <div className='home-panel'>
                <Info gameName={value.projectName} authorName={value.userName} />
                <Keyboard />
                <div className='home-btn'>
                    {value.finished &&
                        <div className='home-btn-play'>
                            <Link to={value.userid + '/' + value.projectId}>
                                Play
                            </Link>
                        </div>}
                    {!props.user &&
                        <div className='home-btn-signup'>
                            <Link to={`/signup`}>
                                Sign Up
                            </Link>
                        </div>}
                </div>
            </div>
        </div>
    );
}

export default HomePage;

const Info = (props) => {
    return (
        <div className='home-info'>
            <h1>{props.gameName}</h1>
            <h3>{props.authorName}</h3>
        </div>
    )
}

const Keyboard = () => {
    const [leftArrow, setLeftArrow] = useState({});
    const [rightArrow, setRightArrow] = useState({});
    const [space, setSpace] = useState({});

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            const keyDownStyle = { borderBottom: '0', marginTop: '4px', marginBottom: '0.5px' };
            if (e.key === "ArrowLeft") setLeftArrow(keyDownStyle);
            if (e.key === "ArrowRight") setRightArrow(keyDownStyle);
            if (e.key === " ") setSpace(keyDownStyle);
        });
        window.addEventListener("keyup", (e) => {
            const keyUpStyle = { borderBottom: '5px solid #c7c7c7e8' };
            if (e.key === "ArrowLeft") setLeftArrow(keyUpStyle);
            if (e.key === "ArrowRight") setRightArrow(keyUpStyle);
            if (e.key === " ") setSpace(keyUpStyle);
        });
    }, []);

    return (
        <div className='keyboard'>
            <div className='arrow arrow-left' style={leftArrow}>⇦</div>
            <div className='arrow arrow-right' style={rightArrow}>⇨</div>
            <div className='space' style={space}>Space</div>
        </div>
    )
}
