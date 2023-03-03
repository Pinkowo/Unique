import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Input, FormBtn, OtherFormBtn } from '../components/form.jsx';
import { auth, db } from '../auth.js';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SignUpPage = (props) => {
    const [name, useName] = useState(false);
    const [email, useEmail] = useState(false);
    const [password, usePassword] = useState(false);
    const [className, useClassName] = useState('form-btn-disabled');
    const [errMsg, useErrMsg] = useState('');
    const [display, useDisplay] = useState('none');
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        if (props.user) {
            location.href = "/projects";
        }
    }, []);

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const setData = async () => {
                    const docSnap = await getDoc(doc(db, "user", result.user.uid));
                    if (!docSnap.exists()) {
                        console.log(docSnap.data())
                        await setDoc(doc(db, "user", result.user.uid), {
                            name: result.user.displayName,
                            projectNum: 0
                        }, { merge: true });
                    }
                }
                setData()
                    .then(() => {
                        location.href = "/projects";
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }).catch((error) => {
                const errorMsg = error.code.split('/')[1].replaceAll('-', ' ');
                useDisplay('flex');
                useErrMsg(errorMsg);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        useClassName('form-btn-disabled');
        const nameVal = e.target[0].value;
        const emailVal = e.target[1].value;
        const passwordVal = e.target[2].value;
        createUserWithEmailAndPassword(auth, emailVal, passwordVal)
            .then((result) => {
                const randomNum = Math.floor((Math.random() * 53));
                const profile = "https://xsgames.co/randomusers/assets/avatars/pixel/" + randomNum + ".jpg";
                updateProfile(result.user, {
                    displayName: nameVal,
                    photoURL: profile
                }).then(() => {
                    const setData = async () => {
                        await setDoc(doc(db, "user", result.user.uid), {
                            name: nameVal,
                            projectNum: 0
                        }, { merge: true });
                    }
                    setData()
                        .then(() => {
                            signInWithEmailAndPassword(auth, emailVal, passwordVal)
                                .then(() => {
                                    location.href = "/projects";
                                }).catch(() => {
                                    location.href = "/signin";
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }).catch((error) => {
                    console.log(error)
                });
            })
            .catch((error) => {
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
            if (name && password)
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
            if (name && email)
                useClassName('form-btn');
        }
    }
    function handleNameChange(e) {
        useDisplay('none');
        const nameRegex = /^[\w\d\u4e00-\u9fa5]{1,10}$/;
        if (!nameRegex.test(e.target.value)) {
            useName(false);
            useClassName('form-btn-disabled');
        } else {
            useName(true);
            if (email && password)
                useClassName('form-btn');
        }
    }

    return (
        <div className="container">
            <div className="sign-form">
                <div>
                    <Link to="/signin" className='form-link'>
                        Login
                    </Link>
                    <p>/</p>
                    <h1>Register</h1>
                </div>
                <p style={{ display }}>
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <Input type='name' name={name} handleChange={handleNameChange} />
                    <Input type='email' email={email} handleChange={handleEmailChange} />
                    <Input type='password' password={password} handleChange={handlePasswordChange} />
                    <FormBtn value='CREATE ACCOUNT' class={className} />
                    <OtherFormBtn action='Up' value='Google' handleClick={handleGoogleLogin} />
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;
