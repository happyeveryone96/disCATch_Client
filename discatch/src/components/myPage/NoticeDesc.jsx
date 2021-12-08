// LIBRARY
import React from "react";
import { useSelector } from "react-redux";

// MOMENT
import moment from "moment";

// STYLE
import styled from "styled-components";

const NoticeDesc = () => {
  const noticeDetail = useSelector((state) => state.mypage.noticedetail);
  const modifiedAt = moment(noticeDetail.modifiedAt).format("YYYY-M-D");

  if (!noticeDetail) {
    return <div></div>;
  }
  let codes = noticeDetail.contents;
  return (
    <Wrap>
      <Header>
        <p>{noticeDetail.title}</p>
        <p>{modifiedAt}</p>
      </Header>
      <Body>
        <p dangerouslySetInnerHTML={{ __html: codes }}></p>
      </Body>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  margin-top: 10px;
`;
const Header = styled.div`
  height: 45px;
  border-bottom: 0.5px solid #b5bb19;
  justify-content: space-between;
  padding: 0px 10px;
  p {
    margin: 0px;
    font-size: 16px;
    font-weight: 900;
    :nth-child(2) {
      font-size: 12px;
      font-weight: 700;
    }
    @media screen and (max-width: 320px) {
      font-size: 12px;
      :nth-child(2) {
        font-size: 10px;
      }
    }
  }
  @media screen and (max-width: 320px) {
    height: 30px;
  }
`;
const Body = styled.div`
  padding: 10px;
  p {
    margin: 5px;
    line-height: 20px;
    font-size: 14px;
    word-break: break-all;
    white-space: normal;
    @media screen and (max-width: 320px) {
      font-size: 12px;
    }
  }
`;

export default NoticeDesc;
