import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const excerpt = (str, count) => {
    if (str.length > count) {
        str = str.substring(0, count) + " ... ";
    }
    return str;
};
const BlogSection = ({
    id,
    title,
    description,
    category,
    imgUrl,
    userId,
    author,
    timestamp,
    user,
    handleDelete,
}) => {
    return (
        <div>
            <div className="row pb-4" key={id}>
                <div className="col-md-5">
                    <div className="hover-blogs-img">
                        <div className="blogs-img">
                            <img src={imgUrl} alt={title} />
                            <div></div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="text-start">
                        <h6 className="category catg-color">{category}</h6>
                        <span className="title py-2">{title}</span>
                        <span className="meta-info">
                            <p className="author">{author}</p> -&nbsp;
                            {timestamp.toDate().toDateString()}
                        </span>
                    </div>
                    <div className="short-description text-start">
                        {excerpt(description, 220)}
                    </div>
                    <Link to={`/detail/${id}`}>
                        <button className="btn btn-read">Read More</button>
                    </Link>
                    {user && user.uid === userId && (
                        <div style={{ float: "right" }}>
                            <Button
                                name="trash"
                                size="2x" variant="outline-danger" style={{ border: "none", margin: "5px" }}
                                onClick={() => handleDelete(id)}
                            >🗑️</Button>
                            <Link to={`/update/${id}`}>
                                <Button
                                    name="edit"
                                    variant="outline-dark"
                                    style={{ border: "none" }}
                                    size="2x"
                                >✍🏼</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogSection;