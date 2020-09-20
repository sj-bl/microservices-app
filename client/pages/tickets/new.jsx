import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";
const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(null);
  const { errors, doRequest } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    doRequest();
  };

  const roundPrice = () => {
    // const value = parseFloat(price.toFixed(2));
    setPrice(parseFloat(price).toFixed(2));
    // setPrice(value);
  };

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmit(e)} className="col-6 mt-5 pl-0 ml-0">
        <h1>Create Ticket</h1>
        <div className="form-group">
          <label htmlFor="email">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label htmlFor="password">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            min={0}
            value={price}
            onBlur={roundPrice}
            onChange={(e) => setPrice(e.target.value)}
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
          Create Ticket
        </button>
      </form>
    </div>
  );
};
export default NewTicket;
