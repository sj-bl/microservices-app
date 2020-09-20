import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { errors, doRequest } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmit(e)} className="col-6 mt-5 pl-0 ml-0">
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* {error.length > 0 && (
          <div className="alert alert-danger">
            {error.map((e) => {
              return e.field === "email" ? e.message : null;
            })}
          </div>
        )} */}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {error.length > 0 && (
          <div className="alert alert-danger">
            {error.map((e) => {
              return e.field === "password" ? e.message : null;
            })}
          </div>
        )} */}
        </div>
        {errors}
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};
