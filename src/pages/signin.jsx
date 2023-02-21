import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Input, FormBtn, OtherFormBtn } from '../components/form.jsx';
import { auth } from '../auth.js';
import { signInWithEmailAndPassword } from "firebase/auth";

const SignInPage = () => {
    const [email, useEmail] = useState(false);
    const [password, usePassword] = useState(false);
    const [className, useClassName] = useState('form-btn-disabled');
    const [errMsg, useErrMsg] = useState('');
    const [display, useDisplay] = useState('none');
    const goPath = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        useClassName('form-btn-disabled');
        const emailVal = e.target[0].value;
        const passwordVal = e.target[1].value;
        signInWithEmailAndPassword(auth, emailVal, passwordVal)
            .then(() => {
                goPath("/projects");
            }).catch((error) => {
                const errorMsg = error.code.split('/')[1].replaceAll('-', ' ');
                useDisplay('flex');
                useErrMsg(errorMsg);
            });
    }
    function handleEmailChange(e) {
        useDisplay('none');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(e.target.value)) {
            useEmail(false);
            useClassName('form-btn-disabled');
        } else {
            useEmail(true);
            if (password)
                useClassName('form-btn');
        }
    }
    function handlePasswordChange(e) {
        useDisplay('none');
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        if (!passwordRegex.test(e.target.value)) {
            usePassword(false);
            useClassName('form-btn-disabled');
        } else {
            usePassword(true);
            if (email)
                useClassName('form-btn');
        }
    }
    return (
        <div className="container">
            <div className="sign-form">
                <div>
                    <h1>Login</h1>
                    <p>/</p>
                    <Link to="/signup" className='form-link'>
                        Register
                    </Link>
                </div>
                <p style={{ display }}>
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <Input type='email' email={email} handleChange={handleEmailChange} />
                    <Input type='password' password={password} handleChange={handlePasswordChange} />
                    <div className='form-link-pw'>
                        <Link to="/signup">
                            Forgot password?
                        </Link>
                    </div>
                    <FormBtn value='LOG IN' class={className} />
                    <OtherFormBtn action='In' value='Google' />
                </form>
            </div>
        </div>
    )
}

export default SignInPage;
