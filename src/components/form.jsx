import React, { useState } from 'react';

export const Input = props => {
    const [msg, useMsg] = useState('');
    const [display, useDisplay] = useState('none');
    const [type, useType] = useState(props.type);
    const [change, useChange] = useState(false);

    const title = props.type.charAt(0).toUpperCase() + props.type.substring(1);
    let placeholder;
    if (props.type === 'email')
        placeholder = 'unique@example.com';

    if (props.type === 'password')
        placeholder = '********';

    if (props.type === 'name')
        placeholder = 'Unique';

    function handleBlur(e) {
        useChange(false);
        if (e.target.value === '') {
            useDisplay('flex');
            useMsg('Please do not be empty.');
            return;
        }
        if (props.type == 'email' && !props.email) {
            useDisplay('flex');
            useMsg('Please enter a valid email address.');
            return;
        }
        if (props.type == 'password' && !props.password) {
            useDisplay('flex');
            if (e.target.value.length < 8)
                useMsg('Password must be at least 8 characters long.');
            else if (!/\d+/.test(e.target.value))
                useMsg('Password must contain at least one digit.');
            else if (!/[a-zA-Z]+/.test(e.target.value))
                useMsg('Password must contain at least one letter.');
            else
                useMsg('Password only allow special characters like !@#$%^&*()_+');
            return;
        }
        if (props.type == 'name' && !props.name) {
            useDisplay('flex');
            if (e.target.value.length > 10)
                useMsg('Name must be less than 10 characters long.');
            else
                useMsg('Please enter a valid name.');
            return;
        }
    }

    return (
        <label htmlFor={props.type}>
            <PasswordHint type={props.type} isChanging={change} />
            <p>{title}</p>
            <div className='input-box'>
                <input
                    type={type == 'name' ? 'text' : type}
                    name={props.type}
                    autoComplete="on"
                    placeholder={placeholder}
                    onBlur={handleBlur}
                    onFocus={() => { useDisplay('none') }}
                    onChange={e => { useChange(true); props.handleChange(e); }}
                    required
                />
                <Eyes type={props.type} click={type => { useType(type) }} />
            </div>
            <span style={{ display }}>
                <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                {msg}
            </span>
        </label>
    )
}

const PasswordHint = props => {
    let display = 'none';
    if (props.type === 'password' && props.isChanging) {
        display = 'block';
        let div = document.getElementsByClassName('input-box');
        let pw = div[div.length - 1].childNodes[0];
        pw.style.width = '231px';
        pw.style.paddingRight = '30px';
    }
    return (
        <div
            className='tooltiptext'
            style={{ display }}>
            At least 8 characters, include 1 letter, 1 digit.
        </div>
    )
}

const Eyes = props => {
    const [eye, useEye] = useState('fa fa-eye-slash');
    let display = 'none';
    if (props.type === 'password')
        display = 'inline-block';

    function handleClick() {
        if (eye == "fa fa-eye-slash") {
            props.click('text');
            useEye("fa fa-eye");
            return;
        }
        if (eye == "fa fa-eye") {
            props.click('password');
            useEye("fa fa-eye-slash");
            return;
        }
    }
    return (
        <i
            style={{ display }}
            className={eye}
            aria-hidden="true"
            onClick={handleClick}>
        </i>
    )
}

export const FormBtn = props => {
    let disabled = true;
    if (props.class === 'form-btn')
        disabled = false;
    if (props.class === 'form-btn-disabled')
        disabled = true;
    return (
        <input
            type="submit"
            className={props.class}
            value={props.value}
            disabled={disabled}
        />
    )
}

export const OtherFormBtn = props => {
    return (
        <button className='form-btn-other' onClick={props.handleClick}>
            <img src='../image/icon_google.png' />
            Sign {props.action} with {props.value}
        </button>
    )
}