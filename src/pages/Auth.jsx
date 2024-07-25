import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Form } from "react-bootstrap";
import { setDoc, doc } from "firebase/firestore";
const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};
const Auth = ({ setActive, setUser }) => {
    const [state, setState] = useState(initialState);
    const [signUp, setSignUp] = useState(false);

    const { email, password, firstName, lastName, confirmPassword } = state;

    const navigate = useNavigate();

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };
    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (!signUp) {
                if (email && password) {
                    const { user } = await signInWithEmailAndPassword(auth, email, password);
                    setActive("home");
                }
                else { alert("fill all fields") }
            }
            else {
                if (password !== confirmPassword || password.length < 6) {
                    alert("This is wrong. Make sure confirm password matches and password length is >=6")
                }
                if (firstName && lastName && email && password) {
                    const { user } = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
                    await setDoc(doc(db, 'users', user.uid), {
                        firstName,
                        lastName,
                        email
                    });
                    setActive("home");
                }
                else {
                    alert("all fields to be filled")
                }
            }
            navigate("/");
        } catch (error) {
            alert(error.message);
        }

    }
    return (
        <>
            <div className="container-fluid mb-4">
                <div className="container justify-content-center align-items-center">
                    <div className="col-12 text-center">
                        <div className="text-center heading py-2">
                            {!signUp ? "Sign-In" : "Sign-Up"}
                        </div>
                    </div>
                    <div className="row h-100 justify-content-center align-items-center">
                        <div className="col-10 col-md-8 col-lg-6">
                            <Form onSubmit={handleAuth}>
                                {signUp && (
                                    <>
                                        <Form.Label>Personal Details</Form.Label>
                                        <div className="d-flex">
                                            <div className="col-6 py-3">
                                                <input
                                                    type="text"
                                                    className="form-control input-text-box"
                                                    placeholder="First Name"
                                                    name="firstName"
                                                    value={firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-6 py-3">
                                                <input
                                                    type="text"
                                                    className="form-control input-text-box"
                                                    placeholder="Last Name"
                                                    name="lastName"
                                                    value={lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="col-12 py-3">
                                    <input
                                        type="email"
                                        className="form-control input-text-box"
                                        placeholder="Email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 py-3">
                                    <input
                                        type="password"
                                        className="form-control input-text-box"
                                        placeholder="Password and length > 5"
                                        name="password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                </div>
                                {signUp && (
                                    <div className="col-12 py-3">
                                        <input
                                            type="password"
                                            className="form-control input-text-box"
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                                <div className="col-12 py-3 text-center">
                                    <button
                                        className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"}`}
                                        type="submit"
                                    >
                                        {!signUp ? "Sign-in" : "Sign-up"}
                                    </button>
                                </div>
                            </Form>
                            <div>
                                {!signUp ? (
                                    <>
                                        <div className="text-center justify-content-center mt-2 pt-2">
                                            <p className="small fw-bold mt-2 pt-1 mb-0">
                                                Don't have an account ?&nbsp;
                                                <span
                                                    className="link-danger"
                                                    style={{ textDecoration: "none", cursor: "pointer" }}
                                                    onClick={() => setSignUp(true)}
                                                >
                                                    Sign Up
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center justify-content-center mt-2 pt-2">
                                            <p className="small fw-bold mt-2 pt-1 mb-0">
                                                Already have an account ?&nbsp;
                                                <span
                                                    style={{
                                                        textDecoration: "none",
                                                        cursor: "pointer",
                                                        color: "#298af2",
                                                    }}
                                                    onClick={() => setSignUp(false)}
                                                >
                                                    Sign In
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth