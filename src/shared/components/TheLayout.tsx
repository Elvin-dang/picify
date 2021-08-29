import React, { ReactElement } from "react";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { auth } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { setUserState } from "../slices/user.slice";
import { setSignInState } from "../../components/SignIn/SignIn.slice";

function TheLayout(): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(
          setUserState({
            accessToken: token,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            uid: user.uid,
          }),
        );
      } else {
        history.push("/sign-in");
      }
    });
  }, [history, dispatch]);
  return (
    <div>
      <button
        onClick={() => {
          signOut(auth).then(() => {
            dispatch(
              setSignInState({
                loading: false,
                error: "",
                signInSuccess: false,
              }),
            );
            history.push("/");
          });
        }}
      >
        logout
      </button>
    </div>
  );
}

export default TheLayout;
