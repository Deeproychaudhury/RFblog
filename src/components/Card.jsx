import React from "react";
import { Link } from "react-router-dom";
const excerpt = (str, count) => {
    if (str.length > count) {
        str = str.substring(0, count) + " ... ";
    }
    return str;
};
const Card = ({ title, description, imgUrl, id, likes, comments }) => {
    return (
        <div className="col-sm-6 col-lg-4 mb-5" >
            <div className="related-content card text-decoration-none overflow-hidden h-100">
                <img className="related-img card-img-top" src={imgUrl} alt={title} />
                <div className="related-body card-body p-4" style={{ backgroundColor: '#C0C0C0' }}>
                    <h5 className="title text-start py-2">{title}</h5>
                    {/* Render the excerpted description as HTML */}
                    <div
                        className="short-description text-start"
                        dangerouslySetInnerHTML={{
                            __html: excerpt(description, 220)
                        }}
                    />
                    <div className="d-flex justify-content-between" >
                        <Link to={`/detail/${id}`} style={{ textDecoration: "none" }}>
                            <span className="text-primary">Read More...</span>
                        </Link>
                        <div>
                            👍
                            {likes.length}
                            💬
                            {comments.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;