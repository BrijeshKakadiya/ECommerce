import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let dispatch = useDispatch();

  // const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    setEmail(window.localStorage.getItem("email"));
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const auth = getAuth();

    // auth.currentUser;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("email");
          // console.log(result);
          // const idTokenResult = user.getIdTokenResult();
          const user = auth.currentUser;
          const newPassword = password;

          updatePassword(user, newPassword)
            .then((response) => {
              toast("Successfully your password has been updated");
              user
                .getIdTokenResult()
                .then((idTokenResult) => {
                  createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                      dispatch({
                        type: "LOGGED_IN_USER",
                        payload: {
                          name: res.data.name,
                          email: res.data.email,
                          token: idTokenResult.token,
                          role: res.data.role,
                          _id: res.data._id,
                        },
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
              history.push("/login");
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const CompleteRegistrationForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          placeholder="Email"
          disabled
        />
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
        <br />

        <button type="submit" className="btn btn-raised">
          Complete Registration
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {CompleteRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
