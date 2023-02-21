import React from 'react';
import { db } from '../auth.js';
import { doc, getDoc, getDocs, deleteDoc, updateDoc, collection, writeBatch } from "firebase/firestore";

const pixel = 32;

export const takeData = async (mode, uid) => {
    const projectName = location.pathname.split('/')[2];
    if (mode === 'edit') {
        const path = doc(db, 'user', 'userid', 'project', 'project-1');
        const project = await getDoc(path);
        if (project.data().firstTimeEdit) {
            await updateDoc(path, {
                firstTimeEdit: false
            });
            return;
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
            return doc(db, 'user', 'userid', 'project', 'project-1', 'setting', obj);
        else
            return collection(db, 'user', 'userid', 'project', 'project-1', 'setting', obj, obj2);
    }

    return {
        chara: chara.data(),
        door: door.data(),
        map: map.data(),
        stars: starGroup,
        walls: wallGroup
    };
};

export class SaveButton extends React.Component {
    constructor(props) {
        super(props);
        this.saveData = this.saveData.bind(this);
    }
    render() {
        let imgUrl, spanText;
        if (this.props.btn == "play") {
            imgUrl = "../image/icon_play.png";
            spanText = "Play"
        }
        if (this.props.btn == "save") {
            imgUrl = "../image/icon_save.png";
            spanText = "Save"
        }
        return (
            <button onClick={this.saveData} className="container-btn">
                <img src={imgUrl} alt="" />
                <span className="tooltiptext">
                    {spanText}
                </span>
            </button>
        )
    }
    saveData() {
        let chara = { x: this.props.items[3].x, y: this.props.items[3].y };
        let door = { x: this.props.items[4].x, y: this.props.items[4].y };
        let map = { w: this.props.items[0].w, h: this.props.items[0].h };
        let stars = this.props.items[1].children;
        let walls = this.props.items[2].children;
        let starMinNum = document.getElementById('input-star-num').value;
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
                const batch = writeBatch(db);
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
                document.getElementById('save-hint').style.display = 'flex';
                document.getElementById('save-hint').style.animation = 'fadein 1s ease';
                setTimeout(() => {
                    document.getElementById('save-hint').style.display = 'none';
                }, 1000)

            })
            .catch((err) => {
                console.log(err);
            });


        function chageObj(obj, obj2, obj3) {
            if (typeof obj2 === 'undefined')
                return doc(db, 'user', 'userid', 'project', 'project-1', 'setting', obj);
            else if (typeof obj3 === 'undefined')
                return collection(db, 'user', 'userid', 'project', 'project-1', 'setting', obj, obj2);
            else
                return doc(db, 'user', 'userid', 'project', 'project-1', 'setting', obj, obj2, obj3);
        }
    }
};