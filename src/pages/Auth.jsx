import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { Form, Modal, Button } from "react-bootstrap";
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
    const [forgotPassword, setForgotPassword] = useState(false);

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
                } else {
                    alert("Fill all fields");
                }
            } else {
                if (password !== confirmPassword || password.length < 6) {
                    alert("Password must match and be at least 6 characters long");
                }
                if (firstName && lastName && email && password) {
                    const { user } = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
                    await setDoc(doc(db, 'users', user.uid), {
                        firstName,
                        lastName,
                        email,
                    });
                    setActive("home");
                } else {
                    alert("All fields must be filled");
                }
            }
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email address");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent");
            setForgotPassword(false);
        } catch (error) {
            alert(error.message);
        }
    };

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
                                        placeholder="Password (min length: 6)"
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
                            {!signUp && (
                                <div className="text-center">
                                    <button
                                        className="btn btn-link"
                                        onClick={() => setForgotPassword(true)}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                            <div>
                                {!signUp ? (
                                    <>
                                        <div className="text-center justify-content-center mt-2 pt-2">
                                            <p className="small fw-bold mt-2 pt-1 mb-0">
                                                Don't have an account?&nbsp;
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
                                                Already have an account?&nbsp;
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
            <Modal show={forgotPassword} onHide={() => setForgotPassword(false)} centered>
                <Modal.Header>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please enter your email address to receive a password reset link.</p>
                    <Form.Group>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            name="email"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setForgotPassword(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleForgotPassword}>
                        Send Reset Link
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Auth;