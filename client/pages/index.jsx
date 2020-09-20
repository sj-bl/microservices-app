import Link from "next/link";

const LoadingPage = ({ currentUser, tickets }) => {
  const RenderTickets = tickets.map((ticket) => (
    <div class="card-body border border-1 p-3 " key={ticket.id}>
      <h5 class="card-title">{ticket.title}</h5>
      <p class="card-text">Price : ₹ {ticket.price}</p>
      <Link href={`/tickets/${ticket.id}`}>
        <a class="btn btn-outline-primary">View</a>
      </Link>
    </div>
  ));

  return (
    <div className="container mt-5">
      <h1>Tickets </h1>
      <br />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "1rem",
        }}
      >
        {RenderTickets}
      </div>
    </div>
  );
};

LoadingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LoadingPage;
