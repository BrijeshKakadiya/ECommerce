import React, { useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { getAuth, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(password);
    const auth = getAuth();

    const user = auth.currentUser;

    updatePassword(user, password)
      .then(() => {
        setLoading(false);
        setPassword("");
        toast.success("Password Updated");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      });

    // await auth.currentUser
    //   .updatePassword(password)
    //   .then(() => {
    //     setLoading(false);
    //     setPassword("");
    //     toast.success("Password Updated");
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     toast.error(error.message);
    //     console.log(error);
    //   });
  };

  const passwordUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter new password"
            disabled={loading}
            value={password}
          />
          <button
            className="btn btn-primary"
            disabled={!password || password.length < 6 || loading}
          >
            Submit
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Password Update</h4>
          )}

          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
