import Router from "next/router";
import React from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
export default function OrderId({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = React.useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (data) => Router.push("/orders"),
  });
  React.useEffect(() => {
    const count = () => {
      const time = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(time / 1000));
    };
    count();
    const intervalId = setInterval(count, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div className="container">
        <div class="card-body border border-1 p-3 col-6 mt-5 alert alert-danger">
          <h3>Order Expired !</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="mt-5">Order Details</h1>
      <div class="card-body border border-1 p-3 col-6 mt-3">
        <h5 class="card-title">Order ID : {order.id}</h5>
        <p class="card-text">Title {order.ticket.title}</p>
        <p class="card-text">Price : ₹ {order.ticket.price}</p>
        <h6>Time left to Order : {timeLeft} seconds</h6>
        {errors}
      </div>
      {/* <button class="btn btn-outline-primary mt-2">Pay</button> */}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        amount={order.ticket.price * 100}
        stripeKey="pk_test_51Gw3jiEnwVW1SW8rR9VYXHPlv1tWEgIjN4mmhfNuFCxmgJAzneWbogpRPKClwx7DNs07t0leALf7HLkshykGHjvs00LXsl7q3Q"
        email={currentUser.email}
      />
    </div>
  );
}

OrderId.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
