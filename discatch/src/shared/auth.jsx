/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from "react";
/* == Redux - actions */
import { useDispatch } from "react-redux";
import { userActions } from "../redux/modules/user";
/**src/component/Router.js
 * Page 			: 해당 라우트에서 보여줄 페이지
 * checkAuth 	: 해당 라우트 AuthCheck 여부 (boolean)
 * return			: 해당 페이지와 react-router props(history, match, location)
 */
export default (Page, checkAuth) => {
  const AuthCheck = (props) => {
    const dispatch = useDispatch();
    const token = document.cookie;
    console.log(token);
    const isLoggedIn = token !== undefined ? true : false;

    useEffect(() => {
      dispatch(userActions._setLogin());
      // 로그인을 하지 않았는데 로그인 필요한 페이지에 있을 경우
      if (isLoggedIn && checkAuth) {
        props.history.push("/login");
      }
      // 로그인을 이미 했는데 로그인 페이지 / 로그인 랜딩 페이지에 있을 경우 메인페이지로 이동
      else if (isLoggedIn && !checkAuth) {
        props.history.push("/");
      }
    }, []);

    return <Page {...props} />;
  };
  return AuthCheck;
};
