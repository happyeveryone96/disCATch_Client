// LIBRARY
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import Comment from "./Comment";
import CommentCard from "./CommentCard";

// STYLE
import { css } from "styled-components";

// ROUTE
import { useLocation } from "react-router-dom";

// ELEMENTS
import { Grid, Button, TextArea } from "../../elements/index";

// REDUX
import { addCommunityCommentDB } from "../../redux/modules/community";
import {
  __createCatComment,
  __createCatDetailComment,
} from "../../redux/modules/comment";

const CommentList = ({ props, path, catId, communityId }) => {
  const dispatch = useDispatch();
  const pathName = useLocation().pathname.split('/')[3];
  let community;

  const cCommunity = useSelector((state) => state.community.catInfo);
  const gCommunity = useSelector((state) => state.community.gathering);
  const sCommunity = useSelector((state) => state.community.sharing);

  if (pathName === 'catinfo') {
    community = cCommunity;
  } else if (pathName === 'gathering') {
    community = gCommunity;
  } else if (pathName === 'sharing') {
    community = sCommunity;
  }

  const [comments, setComment] = React.useState("");
  let commentList;

  if (path === "CatDetail" || path === "CatDetailInfo") {
    commentList = props;
  } else {
    commentList = community.data?.commentList;
  }

  const $comment = (event) => {
    setComment(event.target.value);
  };

  const addCommentBtn = () => {
    if (comments === '') {
      alert('댓글을 입력해주세요!');
    } else {
      if (path === "CatDetail") {
        dispatch(__createCatComment(catId, comments));
      } else if (path === "CatDetailInfo") {
        dispatch(__createCatDetailComment(catId, comments));
      } else {
        dispatch(addCommunityCommentDB(comments, communityId));
      }
      setComment("");
    }
  };

  return (
    <>
      <Comment path={path} />
      <Grid
        width="95%"
        margin="0 auto"
        height="auto"
        addstyle={() => {
          return css`
            display: flex;
          `;
        }}
      >
        <TextArea
          onChange={$comment}
          type="text"
          value={comments}
          placeholder="댓글 달기..."
          addstyle={() => {
            return css`
              position: relative;
              bottom: 20px;
              border: 1px solid rgb(${(props) => props.theme.palette.yellow});
              border-radius: 10px;
              resize: none;
              overflow-y: hidden;
              padding: 5px;
            `;
          }}
        />
        <Button
          width="40px"
          bgColor="yellow"
          clickEvent={addCommentBtn}
          addstyle={() => {
            return css`
              display: flex;
              position: relative;
              height: 30px;
              width: 50px;
              align-items: center;
              justify-content: center;
              padding: 5px;
              margin-left: 3px;
              bottom: 17px;
            `;
          }}
        >
          작성
        </Button>
      </Grid>
      {commentList &&
        commentList.map((comment, idx) => {
          return (
            <CommentCard
              key={idx}
              comment={comment}
              communityId={communityId}
            />
          );
        })}
    </>
  );
};

export default CommentList;
