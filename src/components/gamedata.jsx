import { db } from '../auth.js';
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

export const takeData = async () => {
    const chara = await getDoc(doc(db, 'user', 'userid', 'project', 'project-1', 'setting', 'chara'));
    const door = await getDoc(doc(db, 'user', 'userid', 'project', 'project-1', 'setting', 'door'));
    const map = await getDoc(doc(db, 'user', 'userid', 'project', 'project-1', 'setting', 'map'));
    const stars = await getDocs(collection(db, 'user', 'userid', 'project', 'project-1', 'setting', 'map', 'stars'));
    let starGroup = [];
    stars.forEach(doc => {
        starGroup.push(doc.data());
    });
    const walls = await getDocs(collection(db, 'user', 'userid', 'project', 'project-1', 'setting', 'map', 'walls'));
    let wallGroup = [];
    walls.forEach(doc => {
        wallGroup.push(doc.data());
    });
    if (chara.exists()) {
        return {
            chara: chara.data(),
            door: door.data(),
            map: map.data(),
            stars: starGroup,
            walls: wallGroup
        };
    }
};



