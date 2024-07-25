import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

const Like = ({ handleLike, likes, userId }) => {

    const LikeStatus = () => {
        if (likes?.length > 0) {
            return likes.find((id) => id === userId) ? (
                <>
                    <i className="bi bi-hand-thumbs-up-fill" />
                    &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
                </>
            ) : (
                <>
                    <i className="bi bi-hand-thumbs-up" />
                    &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
                </>
            );
        }
        return (
            <>
                <i className="bi bi-hand-thumbs-up" />
                &nbsp;Like
            </>
        );
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Please Login to like post
        </Tooltip>
    );

    return (
        <>
            <span
                style={{ float: "right", cursor: "pointer", marginTop: "-7px" }}
                onClick={!userId ? null : handleLike}
            >
                {!userId ? (
                    <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip}
                    >
                        <Button variant="primary">
                            <LikeStatus />
                        </Button>
                    </OverlayTrigger>
                ) : (
                    <Button variant="primary">
                        <LikeStatus />
                    </Button>
                )}
            </span>
        </>
    );
};

export default Like;
