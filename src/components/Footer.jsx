import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
                        <h5>Contact Information</h5>
                        <p>Email: thisisanexample@example.com</p>
                    </Col>
                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <h5>Follow Me</h5>
                        <a href="https://www.facebook.com" className="text-white mx-2">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://www.twitter.com" className="text-white mx-2">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://www.linkedin.com" className="text-white mx-2">
                            <FaLinkedin size={24} />
                        </a>
                        <a href="https://www.github.com" className="text-white mx-2">
                            <FaGithub size={24} />
                        </a>
                    </Col>
                    <Col md={4} className="text-center text-md-right">
                        <small>created by </small>
                        <h5>Debanjan Roy Chaudhury</h5>
                        <p>© 2024 All Rights Reserved</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
