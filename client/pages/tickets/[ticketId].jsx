import React from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

export default function TicketDetails({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`),
  });

  return (
    <div className="container mt-5">
      <h1>Title : {ticket.title}</h1>
      <h4>Price : ₹ {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary mt-3">
        Purchase
      </button>
    </div>
  );
}
TicketDetails.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
