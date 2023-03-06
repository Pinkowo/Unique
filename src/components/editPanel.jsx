import React, { useState, useEffect } from 'react';
import { DeleteBtn, PublishBtn } from './gamedata.jsx';

const EditPanel = props => {
    const [name, useName] = useState('');
    const [openDelete, useOpenDelete] = useState(false);
    const [showCopy, useShowCopy] = useState(false);
    const uid = props.user.uid;
    const projectId = location.pathname.split('/')[2];
    useEffect(() => {
        useName(props.name);
    }, [props.name]);
    function handleStarBlur(e) {
        if (e.target.value == '' || e.target.value < 0) {
            e.target.value = 0;
        }
        if (e.target.value > props.starNum.length) {
            e.target.value = props.starNum.length;
        }
    }
    function handleNameBlur(e) {
        const name = e.target.value.trim();
        if (name == '')
            useName(props.name);
        else
            useName(name);
    }
    function handleNameChange(e) {
        if (e.target.value.length <= 20)
            useName(e.target.value);
    }
    return (
        <div id="edit-panel">
            <h2>Settings</h2>
            <form>
                <div>
                    <Label
                        content='Project Name'
                        tip='The name of your game'
                    />
                    <input
                        name="game"
                        type="text"
                        id='input-project-name'
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                    />
                </div>
                <div>
                    <Label
                        content='Minimum Star'
                        tip='The minimum number of stars to clear the game'
                    />
                    <input
                        name="minStar"
                        type="number"
                        min="0"
                        max={(props.starNum.children || []).length}
                        id='input-star-num'
                        value={props.star}
                        onChange={props.handleStarChange}
                        onBlur={handleStarBlur}
                    />
                </div>
            </form>
            <div className='publish-switch'>
                <Label
                    content='Release Game'
                    tip='Click the button to publish your game. Make sure you have saved the game before.'
                    class='publish-title'
                />
                <PublishBtn
                    uid={uid}
                    projectId={projectId}
                    showCopy={() => useShowCopy(true)}
                    hideCopy={() => useShowCopy(false)}
                />
                <CopyBtn
                    uid={uid}
                    projectId={projectId}
                    show={showCopy}
                />
            </div>
            <div className='edit-delete'>
                <button onClick={() => useOpenDelete(true)}>Delete Program</button>
            </div>
            <DeleteWindow
                user={props.user}
                open={openDelete}
                handleClose={() => useOpenDelete(false)}
            />
        </div >
    )
}

export default EditPanel;

const Label = (props) => {
    return (
        <label className={props.class}>
            <i className="fa fa-info-circle" aria-hidden="true">
                <span className="tooltiptext">
                    {props.tip}
                </span>
            </i>
            {props.content}
        </label>
    )
}

const CopyBtn = (props) => {
    const [className, useClassName] = useState('disappear');
    const [click, useClick] = useState(false);
    useEffect(() => {
        if (props.show) {
            useClassName('appear');
        }
        else {
            useClassName('disappear');
        }
    }, [props.show])
    function handleCopy() {
        navigator.clipboard.writeText('https://unique-game-editor.web.app/' + props.uid + '/' + props.projectId);
        useClick(true);
        setTimeout(() => {
            useClick(false);
        }, 1000);
    }
    return (
        <div className='publish-copy'>
            {click
                ? <button className='copied'>
                    <span>
                        Copied
                        <i className="fa fa-link" aria-hidden="true"></i>
                    </span>
                </button>
                : <button onClick={handleCopy} className={className}>
                    <span>
                        Copy Link
                        <i className="fa fa-share-alt" aria-hidden="true"></i>
                    </span>
                </button>}
        </div>
    )
}

const DeleteWindow = (props) => {
    const [display, useDisplay] = useState('none');
    useEffect(() => {
        if (props.open) {
            useDisplay('flex');
        } else {
            useDisplay('none');
        }
    }, [props.open]);
    return (
        <div className='delete-window' style={{ display }}>
            <button className='delete-close' onClick={props.handleClose}>X</button>
            <p>Do you want to DELETE this project?</p>
            <div className='delete-btns'>
                <DeleteBtn user={props.user} />
                <button className='delete-no' onClick={props.handleClose}>Cancel</button>
            </div>
        </div>
    )
}


    // const [map, setMap] = useState({ w: props.map.w, h: props.map.h });
    // function handleMapBlur(e) {
    //     const name = e.target.name;
    //     let minNum = 15;
    //     if (name == 'mapW') minNum = 20;
    //     if (e.target.value == '' || e.target.value < minNum) {
    //         e.target.value = minNum;
    //     }
    //     if (e.target.value > 99) {
    //         e.target.value = 99;
    //     }
    // }

/* <div>
    <label>
        <i className="fa fa-info-circle" aria-hidden="true">
            <span className="tooltiptext">
                Change the number to resize the map
            </span>
        </i>
        Map Size
    </label>
    <div>
        w<input
            name="mapW"
            type="number"
            min="20"
            max="99"
            value={map.w}
            onChange={e => setMap({ w: e.target.value })}
            onBlur={handleMapBlur}
        />
        x
        h<input
            name="mapH"
            type="number"
            min="15"
            max="99"
            value={map.h}
            onChange={e => setMap({ h: e.target.value })}
            onBlur={handleMapBlur}
        />
    </div>
</div> */