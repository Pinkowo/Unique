import React from 'react';
import { useNavigate } from "react-router-dom";
import { db } from '../auth.js';
import { doc, getDoc, getDocs, deleteDoc, updateDoc, setDoc, collection, writeBatch, serverTimestamp } from "firebase/firestore";

const pixel = 32;

export const takeData = async (mode, uid) => {
    const projectId = location.pathname.split('/')[2];
    if (mode === 'edit') {
        const path = doc(db, 'user', uid, 'project', projectId);
        const project = await getDoc(path);
        if (project.data().firstTimeEdit) {
            await updateDoc(path, {
                firstTimeEdit: false
            });
            await setDoc(chageObj('map'), {
                w: 20,
                h: 15,
                starMinNum: 0
            });
            await setDoc(chageObj('chara'), {
                x: 0,
                y: 0
            });
            await setDoc(chageObj('door'), {
                x: 0,
                y: 0
            });
        }
    }
    const chara = await getDoc(chageObj('chara'));
    const door = await getDoc(chageObj('door'));
    const map = await getDoc(chageObj('map'));

    const stars = await getDocs(chageObj('map', 'stars'));
    let starGroup = [];
    stars.forEach(doc => {
        starGroup.push(doc.data());
    });

    const walls = await getDocs(chageObj('map', 'walls'));
    let wallGroup = [];
    walls.forEach(doc => {
        wallGroup.push(doc.data());
    });

    function chageObj(obj, obj2) {
        if (typeof obj2 === 'undefined')
            return doc(db, 'user', uid, 'project', projectId, 'setting', obj);
        else
            return collection(db, 'user', uid, 'project', projectId, 'setting', obj, obj2);
    }

    return {
        chara: chara.data(),
        door: door.data(),
        map: map.data(),
        stars: starGroup,
        walls: wallGroup
    };
};

export const SaveBtn = (props) => {
    const goPath = useNavigate();
    function saveData() {
        const uid = props.user.uid;
        const projectId = location.pathname.split('/')[2];
        let chara = { x: props.items[3].x, y: props.items[3].y };
        let door = { x: props.items[4].x, y: props.items[4].y };
        let map = { w: props.items[0].w, h: props.items[0].h };
        let stars = props.items[1].children;
        let walls = props.items[2].children;
        let starMinNum = parseInt(document.getElementById('input-star-num').value, 10);
        if (starMinNum > stars.length) starMinNum = stars.length;

        let arr = [];
        walls.forEach(wall => {
            let wallY = wall.y / pixel + 0.5;
            if (typeof arr[wallY] === 'undefined') {
                arr[wallY] = [];
            }
            arr[wallY].push(wall.x / pixel + 0.5);
        });
        let wallArr = [];
        arr.forEach((arg, index) => {
            if (arg.length == 1) {
                wallArr.push({ num: 1, x: arg[0], y: index });
            } else if (arg.length > 1) {
                arg.sort(function (a, b) {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                });
                arg.forEach((x, i, arg) => {
                    if (i == 0 || x - arg[i - 1] > 1) { wallArr.push({ num: 1, x: x, y: index }); }
                    if (x - arg[i - 1] == 1) wallArr[wallArr.length - 1].num++;
                })
            }
        });

        const takeData = async () => {
            const starSnapshot = await getDocs(chageObj('map', 'stars'));
            starSnapshot.forEach(doc => {
                deleteDoc(chageObj('map', 'stars', doc.id));
            });
            const wallSnapshot = await getDocs(chageObj('map', 'walls'));
            wallSnapshot.forEach(doc => {
                deleteDoc(chageObj('map', 'walls', doc.id));
            });
        };
        takeData()
            .then(() => {
                const time = serverTimestamp();
                const batch = writeBatch(db);
                batch.update(doc(db, 'user', uid, 'project', projectId), { time: time });
                batch.set(chageObj('chara'), { x: chara.x - pixel * 0.5, y: chara.y - pixel * 0.5 });
                batch.set(chageObj('door'), { x: door.x - pixel, y: door.y - pixel });
                batch.set(chageObj('map'), { w: map.w, h: map.h, starMinNum: starMinNum });
                stars.forEach((star, i) => {
                    batch.set(chageObj('map', 'stars', 'star' + i), { x: star.x, y: star.y, exist: true });
                });
                wallArr.forEach((wall, i) => {
                    batch.set(chageObj('map', 'walls', 'wall' + i), { x: (wall.x - 1) * pixel, y: (wall.y - 1) * pixel, num: wall.num });
                });
                batch.commit();
            })
            .then(() => {
                if (props.btn === 'save') {
                    document.getElementById('save-hint').style.display = 'flex';
                    document.getElementById('save-hint').style.animation = 'fadein 1s ease';
                    setTimeout(() => {
                        document.getElementById('save-hint').style.display = 'none';
                    }, 1000)
                    return;
                }
                if (props.btn === 'play') {
                    const path = '/play/' + projectId;
                    goPath(path);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            });

        function chageObj(obj, obj2, obj3) {
            if (typeof obj2 === 'undefined')
                return doc(db, 'user', uid, 'project', projectId, 'setting', obj);
            else if (typeof obj3 === 'undefined')
                return collection(db, 'user', uid, 'project', projectId, 'setting', obj, obj2);
            else
                return doc(db, 'user', uid, 'project', projectId, 'setting', obj, obj2, obj3);
        }
    }
    let imgUrl, spanText;
    if (props.btn == "play") {
        imgUrl = "../image/icon_play.png";
        spanText = "Play"
    }
    if (props.btn == "save") {
        imgUrl = "../image/icon_save.png";
        spanText = "Save"
    }
    return (
        <button onClick={saveData} className="container-btn">
            <img src={imgUrl} alt="" />
            <span className="tooltiptext">
                {spanText}
            </span>
        </button>
    )
}