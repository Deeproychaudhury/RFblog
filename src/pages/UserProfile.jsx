import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Container, Row, Col, Form, ListGroup, Spinner } from 'react-bootstrap';

const UserProfile = ({ user }) => {
    const [editable, setEditable] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [followedUsers, setFollowedUsers] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [allUsers, setAllUsers] = useState([]); // To store all users
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setDisplayName(user.displayName);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setImageUrl(userData.imageUrl || "");
                }
            }
        };

        const fetchAllUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setAllUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        const fetchFollowData = async () => {
            if (user) {
                const followsDocRef = doc(db, 'follows', user.uid);
                const followedSnapshot = await getDoc(followsDocRef);
                if (followedSnapshot.exists()) {
                    setFollowedUsers(followedSnapshot.data().following || []);
                }

                const followersSnapshot = await getDocs(collection(db, 'follows'));
                let followerCount = 0;
                followersSnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.following && data.following.includes(user.uid)) {
                        followerCount++;
                    }
                });
                setFollowers(followerCount);
            }
        };

        const fetchData = async () => {
            try {
                await fetchUserData();
                await fetchAllUsers();
                await fetchFollowData();
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleSave = async () => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName,
                email: user.email,
                imageUrl
            });
            await updateProfile(user, { displayName, photoURL: imageUrl }); // Ensure displayName and photoURL are updated in auth profile
            setEditable(false);
        }
    };

    const handleFollow = async (userId) => {
        if (user) {
            const followsDocRef = doc(db, 'follows', user.uid);
            const followedSnapshot = await getDoc(followsDocRef);
            let newFollowedUsers = followedUsers;
            if (followedSnapshot.exists()) {
                newFollowedUsers = followedSnapshot.data().following || [];
            }
            if (!newFollowedUsers.includes(userId)) {
                newFollowedUsers.push(userId);
            } else {
                newFollowedUsers = newFollowedUsers.filter(id => id !== userId);
            }
            await setDoc(followsDocRef, { following: newFollowedUsers });
            setFollowedUsers(newFollowedUsers);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setImageUrl(downloadURL);
            await updateProfile(user, { photoURL: downloadURL });
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container>
            <h1 className="text-center my-4">User Profile</h1>
            {user ? (
                <Row className="justify-content-center">
                    <Col md={6}>
                        <ListGroup>
                            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                            <ListGroup.Item>UserID:{user.uid}</ListGroup.Item>
                            <ListGroup.Item>
                                Display Name:
                                {editable ? (
                                    <Form.Control
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                ) : (
                                    displayName
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Profile Image:
                                {editable ? (
                                    <Form.Control
                                        type="file"
                                        onChange={handleImageUpload}
                                    />
                                ) : (
                                    <img src={imageUrl} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>Followers: {followers}</ListGroup.Item>
                        </ListGroup>
                        {editable ? (
                            <Button className="mt-3" onClick={handleSave}>Save</Button>
                        ) : (
                            <Button className="mt-3" onClick={handleEdit}>Edit</Button>
                        )}
                    </Col>
                </Row>
            ) : (
                <p>User data not available</p>
            )}
            <h2 className="text-center my-4">All Users</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    <ListGroup>
                        {allUsers.map((otherUser) => (
                            <ListGroup.Item key={otherUser.id} className="d-flex justify-content-between align-items-center">
                                {otherUser.displayName || `${otherUser.firstName} ${otherUser.lastName}`}
                                {followedUsers.includes(otherUser.id) ? (
                                    <Button variant="danger" onClick={() => handleFollow(otherUser.id)}>Unfollow</Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleFollow(otherUser.id)}>Follow</Button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
            <h2 className="text-center my-4">Followed Users</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    <ListGroup>
                        {followedUsers.map((userId) => {
                            const followedUser = allUsers.find(u => u.id === userId);
                            return followedUser ? (
                                <ListGroup.Item key={userId}>
                                    {followedUser.displayName || `${followedUser.firstName} ${followedUser.lastName}`}
                                </ListGroup.Item>
                            ) : null;
                        })}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
