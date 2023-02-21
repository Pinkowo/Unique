import React, { useState } from 'react';

const EditPanel = props => {
    const [map, setMap] = useState({ w: props.map.w, h: props.map.h });
    function handleStarBlur(e) {
        if (e.target.value == '' || e.target.value < 0) {
            e.target.value = 0;
        }
        if (e.target.value > props.starNum.length) {
            e.target.value = props.starNum.length;
        }
    }
    function handleMapBlur(e) {
        const name = e.target.name;
        let minNum = 15;
        if (name == 'mapW') minNum = 20;
        if (e.target.value == '' || e.target.value < minNum) {
            e.target.value = minNum;
        }
        if (e.target.value > 99) {
            e.target.value = 99;
        }
    }
    return (
        <div id="edit-panel">
            <h2>Settings</h2>
            <form>
                <div>
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
                </div>
                <div>
                    <label>
                        <i className="fa fa-info-circle" aria-hidden="true">
                            <span className="tooltiptext">
                                The minimum number of stars to clear the game
                            </span>
                        </i>
                        Minimum Star
                    </label>
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
        </div >
    )
}

export default EditPanel;