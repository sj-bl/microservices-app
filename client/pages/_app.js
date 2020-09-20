import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../apis/buildClient";
import Header from "../components/Header";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </>
  );
};

AppComponent.getInitialProps = async (appcontext) => {
  const client = buildClient(appcontext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps;
  if (appcontext.Component.getInitialProps) {
    pageProps = await appcontext.Component.getInitialProps(
      appcontext.ctx,
      client,
      data.currentUser
    );
  }
  // console.log(data);
  return { ...data, pageProps };
};
export default AppComponent;
