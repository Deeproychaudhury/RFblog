import React, { useEffect, useRef } from 'react';

const AboutUs = () => {
    const headerRef = useRef(null);
    const paragraphsRef = useRef([]);

    useEffect(() => {
        const text = headerRef.current;
        const revealText = () => {
            let characters = text.textContent.split("");
            text.textContent = "";
            characters.forEach((char, index) => {
                setTimeout(() => {
                    text.textContent += char;
                }, index * 100);
            });
        };

        const revealParagraphs = () => {
            paragraphsRef.current.forEach((paragraph, index) => {
                setTimeout(() => {
                    paragraph.style.opacity = 1;
                }, index * 500);
            });
        };

        revealText();
        revealParagraphs();
    }, []);

    const headerStyle = {
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        fontSize: '2.5em',
        background: 'linear-gradient(45deg, #4b79a1, #283e51)',
        backgroundSize: '400% 400%',
        animation: 'gradient 5s ease infinite',
        textAlign: 'center',
        padding: '20px',
        color: 'transparent',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        marginBottom: '20px',
        borderRadius: '10px',
        overflow: 'hidden'
    };

    const paragraphStyle = {
        fontSize: '1.1em',
        textAlign: 'center',
        padding: '20px',
        color: '#333',
        backgroundColor: '#EFEFEF',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 2s ease-in-out',
        maxWidth: '80vw',
        margin: '0 auto'
    };

    const individualParagraphStyle = {
        opacity: 0,
        transition: 'opacity 1s ease-in-out'
    };

    return (
        <div className="container my-2">
            <style>
                {`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                `}
            </style>
            <div style={paragraphStyle}>
                <div style={headerStyle} ref={headerRef}>
                    RF Blog 🖊️
                </div>
                <hr />
                <p style={individualParagraphStyle} ref={el => paragraphsRef.current[0] = el}>A blog is a place to share your thoughts, ideas, and stories with the world.</p>
                <p style={individualParagraphStyle} ref={el => paragraphsRef.current[1] = el}>It's an online journal where you can write about anything that interests you.</p>
                <p style={individualParagraphStyle} ref={el => paragraphsRef.current[2] = el}>To write a great blog, be yourself, be authentic, and have fun!</p>
                <br></br>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTG1LW-o46L89kVB2prwNmWNpXYH5nU-2qeg&s" className="img-fluid" alt="Blog" />
            </div>

        </div>

    );
};
export default AboutUs;

