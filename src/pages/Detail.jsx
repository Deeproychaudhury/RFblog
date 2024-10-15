import React, { useState, useEffect } from "react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    orderBy,
    where,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import Like from "../components/Like";
import FeatureBlogs from "../components/FeatureBlog";
import RelatedBlog from "../components/RelatedBlog";
import Tags from "../components/Tags";
import UserComments from "../components/UserComments";
import { db, auth } from "../firebase/firebase";
import Spinner from "../components/Spinner";
import { Button } from "react-bootstrap";

const Detail = ({ setActive, user }) => {
    const userId = user?.uid;
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [tags, setTags] = useState([]);
    const [comments, setComments] = useState([]);
    let [likes, setLikes] = useState([]);
    const [userComment, setUserComment] = useState("");
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getRecentBlogs = async () => {
            const blogRef = collection(db, "blogs");
            const recentBlogs = query(
                blogRef,
                orderBy("timestamp", "desc"),
                limit(5)
            );
            const docSnapshot = await getDocs(recentBlogs);
            setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        getRecentBlogs();
    }, []);

    useEffect(() => {
        id && getBlogDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const fetchCurrentUser = () => {
            const user = auth.currentUser;
            if (user) {
                setCurrentUser(user);
            }
        };

        fetchCurrentUser();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    const getBlogDetail = async () => {
        setLoading(true);
        const blogRef = collection(db, "blogs");
        const docRef = doc(db, "blogs", id);
        const blogDetail = await getDoc(docRef);
        const blogs = await getDocs(blogRef);
        let tags = [];
        blogs.docs.map((doc) => tags.push(...doc.get("tags")));
        let uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlog(blogDetail.data());
        const relatedBlogsQuery = query(
            blogRef,
            where("tags", "array-contains-any", blogDetail.data().tags),
            limit(3)
        );
        setComments(blogDetail.data().comments ? blogDetail.data().comments.map((comment, index) => ({ ...comment, commentId: `${id}-${index}` })) : []);
        setLikes(blogDetail.data().likes ? blogDetail.data().likes : []);
        const relatedBlogSnapshot = await getDocs(relatedBlogsQuery);
        const relatedBlogs = [];
        relatedBlogSnapshot.forEach((doc) => {
            relatedBlogs.push({ id: doc.id, ...doc.data() });
        });
        setRelatedBlogs(relatedBlogs);
        setActive(null);
        setLoading(false);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        comments.push({
            createdAt: Timestamp.fromDate(new Date()),
            userId,
            name: user?.displayName,
            body: userComment,
        });
        await updateDoc(doc(db, "blogs", id), {
            ...blog,
            comments,
            timestamp: serverTimestamp(),
        });
        setComments(comments);
        setUserComment("");
    };

    const handleLike = async () => {
        if (userId) {
            if (blog?.likes) {
                const index = likes.findIndex((id) => id === userId);
                if (index === -1) {
                    likes.push(userId);
                    setLikes([...new Set(likes)]);
                } else {
                    likes = likes.filter((id) => id !== userId);
                    setLikes(likes);
                }
            }
            await updateDoc(doc(db, "blogs", id), {
                ...blog,
                likes,
                timestamp: serverTimestamp(),
            });
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const blogDoc = await getDoc(doc(db, "blogs", id));
            const blogData = blogDoc.data();
            const updatedComments = blogData.comments.filter((comment, index) => `${id}-${index}` !== commentId);
            await updateDoc(doc(db, "blogs", id), { comments: updatedComments });
            setComments(updatedComments);
        } catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };

    const handleDownload = (blog) => {
        const element = document.createElement("a");
        const htmlContent = `
            <html>
                <head>
                    <title>${blog.title}</title>
                </head>
                <body>
                    <h1>${blog.title}</h1>
                    <img src="${blog?.imgUrl}" alt="${blog.title}" style="max-width: 100%; height: auto;" />
                    <p>${blog.description}</p>
                    <div>${blog.author} is the author</div>
                </body>
            </html>
        `;
        const file = new Blob([htmlContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `${blog.title}.html`;
        document.body.appendChild(element); // Required 
        element.click();
    };

    console.log("relatedBlogs", relatedBlogs);
    return (
        <div className="single">
            <div
                className="blog-title-box"
                style={{ backgroundImage: `url('${blog?.imgUrl}')`, objectFit: 'contain' }}
            >
                <div className="overlay"></div>
                <div className="blog-title">
                    <span>{blog?.timestamp.toDate().toDateString()}</span>
                    <h2>{blog?.title}</h2>
                </div>
            </div>
            <div className="container-fluid pb-4 pt-4 padding blog-single-content">
                <div className="container padding">
                    <div className="row mx-0">
                        <div className="col-md-8">
                            <span className="meta-info text-start">
                                By <p className="author">{blog?.author}</p> -&nbsp;
                                {blog?.timestamp.toDate().toDateString()}
                                <Like handleLike={handleLike} likes={likes} userId={userId} />
                            </span>
                            {/* Render the blog description as HTML */}
                            <div className="text-start">
                                <div
                                    className="blog-description"
                                    dangerouslySetInnerHTML={{ __html: blog?.description }}
                                />
                            </div>


                            <div className="text-start">
                                <Button variant="primary" className="my-2" onClick={() => handleDownload(blog)}>Dowload ⬇️</Button>
                                <Tags tags={blog?.tags} />
                            </div>
                            <br />
                            <div className="custombox">
                                <div className="scroll">
                                    <h4 className="small-title">{comments?.length} Comment{comments?.length !== 1 && 's'}</h4>
                                    {isEmpty(comments) ? (
                                        <UserComments
                                            msg={"No Comment yet posted on this blog. Be the first to comment"}
                                        />
                                    ) : (
                                        <>
                                            {
                                                comments.map((comment, commentId) => (
                                                    <UserComments
                                                        key={commentId}
                                                        {...comment}
                                                        blogId={id}
                                                        handleDelete={handleDelete}
                                                    />
                                                ))
                                            }
                                        </>
                                    )}
                                </div>
                            </div>

                            <CommentBox
                                userId={userId}
                                userComment={userComment}
                                setUserComment={setUserComment}
                                handleComment={handleComment}
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="blog-heading text-start py-2 mb-4">Tags</div>
                            <Tags tags={tags} />
                            <FeatureBlogs title={"Recent Blogs"} blogs={blogs} />
                        </div>
                    </div>
                    <RelatedBlog id={id} blogs={relatedBlogs} />
                </div>
            </div>
        </div>
    );
};

export default Detail;
