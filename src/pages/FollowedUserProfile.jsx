import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Row, Col, ListGroup, Spinner, Modal, Button } from 'react-bootstrap';
import BlogSection from '../components/BlogSection';

const FollowedUserProfile = ({ user }) => {
    const { userId } = useParams();
    const [followedUser, setFollowedUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        const fetchFollowedUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setFollowedUser(userDoc.data());
                }

                const blogsQuery = query(collection(db, 'blogs'), where('userId', '==', userId));
                const blogsSnapshot = await getDocs(blogsQuery);
                const userBlogs = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogs(userBlogs);

                const followersSnapshot = await getDocs(collection(db, 'follows'));
                let followerCount = 0;
                followersSnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.following && data.following.includes(userId)) {
                        followerCount++;
                    }
                });
                setFollowers(followerCount);
            } catch (error) {
                console.error("Error fetching followed user data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedUserData();
    }, [userId]);
    const handleCloseModal = () => setShowModal(false);
    if (loading) {
        return <Spinner />;
    }

    return (
        <Container>
            <h1>{followedUser.firstName || followedUser.displayName || "Followee"}'s Profile </h1>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>RFBlog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The followed user may not have completed their profile. Some information may be missing. Be sure to complete your own profile so that your followers don't face this issue.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {followedUser ? (
                <>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <ListGroup>
                                <ListGroup.Item>Display Name: {followedUser.displayName}</ListGroup.Item>
                                <ListGroup.Item>Email: {followedUser.email}</ListGroup.Item>
                                <ListGroup.Item>
                                    <img src={followedUser.imageUrl} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                </ListGroup.Item>
                                <ListGroup.Item>Followers: {followers}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <h2 className="text-center my-4">User's Blogs</h2>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            {blogs.map(blog => (
                                <BlogSection key={blog.id} user={user} {...blog} />
                            ))}
                        </Col>
                    </Row>
                </>
            ) : (
                <p>User data not available</p>
            )}
        </Container>
    );
};

export default FollowedUserProfile;
