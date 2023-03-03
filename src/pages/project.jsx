import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { db } from '../auth.js';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const ProjectPage = (props) => {
    const [items, useItems] = useState([]);
    const [i, useI] = useState(0);
    const [uid, useUid] = useState(0);
    const goPath = useNavigate();
    const [clickBtn, useClickBtn] = useState(false);

    useEffect(() => {
        if (props.user) {
            useUid(props.user.uid);
            const takeData = async () => {
                const order = query(collection(db, "user", props.user.uid, "project"),
                    orderBy("time", "desc"));
                const querySnapshot = await getDocs(order);
                let itemGroup = [];
                querySnapshot.forEach(doc => {
                    const newItem = {
                        id: doc.id,
                        name: doc.data().name
                    };
                    itemGroup.push(newItem);
                });
                useItems(itemGroup);
                const docSnap = await getDoc(doc(db, "user", props.user.uid));
                if (docSnap.exists()) {
                    useI(docSnap.data().projectNum + 1);
                }
            }
            takeData()
                .catch((err) => {
                    console.log(err);
                });
        } else {
            goPath('/');
        }
    }, []);

    function handleClick() {
        if (!clickBtn) {
            useClickBtn(true);
            const time = serverTimestamp();
            const pushData = async () => {
                const docRef = await addDoc(collection(db, "user", uid, "project"), {
                    firstTimeEdit: true,
                    name: 'project' + i,
                    time: time,
                    release: false
                });
                await updateDoc(doc(db, "user", uid), { projectNum: i });
                const path = '/edit/' + docRef.id;
                goPath(path);
            }
            pushData()
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    return (
        <div className="container" style={{ 'alignItems': 'start' }}>
            <h1 className='project-title'>Projects</h1>
            <Project items={items} handleClick={handleClick} />
        </div>
    )
}

const Project = props => {
    return (
        <ul className='project-list'>
            {props.items.map(item => (
                <li key={item.id}>
                    <Link to={'/edit/' + item.id}>
                        <div className='project-img'>
                            <img src="../image/icon_edit_white.png" className='img-icon' />
                            <img src="../image/bg.jpg" className='img-main' />
                        </div>
                        <div className='project-name'>{item.name}</div>
                    </Link>
                </li>
            ))}
            <li>
                <button onClick={props.handleClick}>+</button>
            </li>
        </ul>
    )
}

export default ProjectPage;