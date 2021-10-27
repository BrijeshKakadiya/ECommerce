import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Register = ({ history }) => {
  const [email, setEmail] = useState("brijeshkakadiya4@gmail.com");
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    const auth = getAuth();
    console.log(auth);

    sendSignInLinkToEmail(auth, email, config)
      .then(() => {
        toast.success(
          `Email is send to ${email}. click the link to complete your registeration `
        );
        window.localStorage.setItem("email", email);
        setEmail("");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />

        <br />
        <button type="submit" className="btn btn-raised">
          Register
        </button>
      </form>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
