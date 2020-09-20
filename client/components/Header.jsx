import Link from "next/link";
export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "My orders", href: "/orders" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "Sign out", href: "/auth/signout" },
  ];
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex justify-content-end ml-auto">
          <ul className="nav d-flex align-items-center">
            {links.map(
              (link) =>
                link && (
                  <li className="nav-item" key={link.href}>
                    <Link href={link.href}>
                      <a className="nav-link">{link.label}</a>
                    </Link>
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
