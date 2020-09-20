import React from "react";

export default function index({ orders }) {
  const RenderOrders = orders.map((order) => (
    <div
      class={`alert alert-${
        order.status === "complete" ? "success" : "danger"
      } d-flex justify-content-between`}
      role="alert"
    >
      <span>
        <strong>Title </strong>: {order.ticket.title}
      </span>
      <strong> Status : {order.status}</strong>
    </div>
  ));
  return (
    <div className="container">
      <h1> Orders</h1>
      <div className="container mt-5">
        <h1>Tickets </h1>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "1rem",
          }}
        >
          {RenderOrders}
        </div>
      </div>
    </div>
  );
}

index.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};
