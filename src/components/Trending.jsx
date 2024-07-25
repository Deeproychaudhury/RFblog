import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Trending.css"; // Import the custom CSS file

const Trending = ({ blogs }) => {
    return (
        <>
            <div>
                <div className="blog-heading text-start py-2 mb-4">Trending</div>
            </div>
            <Carousel>
                {blogs?.map((item) => (
                    <Carousel.Item key={item.id} className="px-2">
                        <Link to={`/detail/${item.id}`}>
                            <div className="trending-img-position">
                                <div className="trending-img-size">
                                    <img
                                        src={item.imgUrl}
                                        alt={item.title}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        className="d-block"
                                    />
                                </div>
                                <div className="trending-caption">
                                    <span className="text-white">{item.title}</span>
                                    <div className="trending-meta-info text-white">
                                        {item.author} - {item.timestamp.toDate().toDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
};

export default Trending;
