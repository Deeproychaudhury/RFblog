import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const UserComments = ({ blogId, commentId, name, body, createdAt, msg, userId, handleDelete }) => {
    const [userImage, setUserImage] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [currUser, setCurrUser] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId) {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserImage(userData.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
                }
            }
        };
        const fetchCurrentUser = () => {
            const user = auth.currentUser;
            if (user) {
                setCurrUser(user);
            }
        };

        fetchUserProfile();
        fetchCurrentUser();
    }, [userId]);

    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="comments-list">
                        <div className="media">
                            {msg ? (
                                <h4 className="mt-5">{msg}</h4>
                            ) : (
                                <>
                                    <div className="media-left">
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
                                    <div className="media-body">
                                        <h3 className="text-start media-heading user_name">
                                            {name} <small>{createdAt.toDate().toDateString()}</small>
                                        </h3>
                                        <p className="text-start">{body}</p>
                                        {currUser && currUser.uid === userId && handleDelete && (
                                            <button onClick={() => handleDelete(commentId)} className="btn btn-danger btn-sm">Delete</button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserComments;
