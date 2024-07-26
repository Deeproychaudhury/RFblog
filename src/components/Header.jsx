import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.scss';
import '../App.css';
//background: "linear-gradient(15deg, #669999 0%,#a3c2c2 15%,#669999 95%)"
const Header = ({ active, setActive, user, handleLogout }) => {
    const userId = user?.uid;
    const userImage = user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <Navbar collapseOnSelect expand="lg" variant="light" sticky="top" style={{
            background: "linear-gradient(15deg, #669999 0%,#a3c2c2 15%,#669999 95%)"
        }}>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src="https://5.imimg.com/data5/SELLER/Default/2020/10/PX/KF/AW/20193325/ink-pen-1000x1000.jpg" height="40" alt="logo" />
                    <span>RFBLOG</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className={`nav-item nav-link ${active === "home" ? "active" : ""}`} onClick={() => setActive("home")}>
                                <Link to="/" style={{ textDecoration: "none" }}>Home</Link>
                            </li>
                            <li className={`nav-item nav-link ${active === "blogs" ? "active" : ""}`} onClick={() => setActive("blogs")}>
                                <Link to="/blogs" style={{ textDecoration: "none" }}>Blogs</Link>
                            </li>
                            <li className={`nav-item nav-link ${active === "create" ? "active" : ""}`} onClick={() => setActive("create")}>
                                <Link to="/create" style={{ textDecoration: "none" }}>Create</Link>
                            </li>
                            <li className={`nav-item nav-link ${active === "about" ? "active" : ""}`} onClick={() => setActive("about")}>
                                <Link to="/about" style={{ textDecoration: "none" }}>About</Link>
                            </li>
                        </ul>
                    </Nav>
                    <Nav>
                        <ul className="navbar-nav">
                            {userId ? (
                                <>
                                    <div className="profile-logo">
                                        <img

                                            src={userImage}
                                            alt="profile"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                marginTop: "5px",
                                            }}
                                        />
                                    </div>
                                    <Link to="/profile" style={{ textDecoration: "none", color: "red" }}>
                                        <p style={{ marginTop: "12px", marginLeft: "5px" }}>
                                            {user?.displayName}
                                        </p>
                                    </Link>
                                    <li className="nav-item nav-link btn" onClick={handleLogout}>
                                        Logout
                                    </li>
                                </>
                            ) : (
                                <li className={`nav-item nav-link ${active === "login" ? "active" : ""}`} onClick={() => setActive("login")}>
                                    <Link to="/auth" style={{ textDecoration: "none" }}>Login</Link>
                                </li>
                            )}
                        </ul>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
