import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("brijeshkakadiya4@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  const roleBasedRedirect = (res) => {
    //check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

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
                roleBasedRedirect(res);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });

        // history.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const googleLogin = async () => {
    const auth = getAuth();

    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
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
                    token: credential.accessToken,
                    role: res.data.role,
                    _id: res.data._id,
                  },
                });
                roleBasedRedirect(res);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        // dispatch({
        //   type: "LOGGED_IN_USER",
        //   payload: {
        //     email: result.user.email,
        //     token: credential.token,
        //   },
        // });
        // history.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoFocus
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoFocus
          />
        </div>

        <br />
        <Button
          onClick={handleSubmit}
          type="submit"
          className="mb-3"
          block
          shape="round"
          icon={<MailOutlined />}
          size="large"
          disabled={!email || password.length < 6}
        >
          Login with Email/Password
        </Button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
