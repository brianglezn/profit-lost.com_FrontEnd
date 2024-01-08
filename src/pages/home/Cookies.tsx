import { Link } from "react-router-dom";

import "./Cookies.css";

import Footer from "../../components/landing/Footer";

function Cookies() {
  return (
    <>
      <Link to="/" className="backHome">
        --HOME
      </Link>
      <h1 className="title">COOKIES</h1>
      <section className="legal">
        <h3>COOKIE NOTICE</h3>
        <p>
          In compliance with the provisions of Article 22.2 of Law 34/2002, of July 11, Services of the Information Society and Electronic Commerce,{" "}<a href="https://profit-lost.com" target="_blank" rel="noreferrer"> profit-lost.com</a>{" "} informs you, in this section, about the policy of collection and treatment of cookies.
        </p>

        <h3>WHAT ARE COOKIES?</h3>.
        <p>
          A cookie is a file that is downloaded to your computer when you access certain web pages. Cookies allow a website, among other things, to store and retrieve information about the browsing habits of a user or their computer and, depending on the information they contain and the way you use your computer, can be used to recognize the user.
        </p>

        <h3>WHICH TYPES OF COOKIES DOES THIS WEBSITE USE?</h3>.
        <p>
          This website uses the following types of cookies: Cookies of analysis: These are those that are well treated by us or by third parties, allow us to quantify the number of users and thus carry out the statistical analysis of the use made by users of the service offered. use made by users of the service offered. To do this, we analyze your browsing on our website in order to  our website in order to improve the range of products or services we offer you. services that we offer.
        </p>
        <p>
          Technical Cookies: These are those that allow the user to navigate through the restricted area and the use of its different functions, such as, for example, to carry out the purchase process of an article.
        </p>
        <p>
          Personalization Cookies: These are those that allow the user to access the service with some general characteristics. access to the service with some general characteristics predefined according to predefined according to a series of criteria in the user's terminal such as the such as the language or the type of browser through which the user connects to the service. through which the user connects to the service.
        </p>
        <p>
          Advertising Cookies: These are those that, either treated by this website or by third parties, allow us to manage by third parties, allow to manage in the most efficient way possible the offer of advertising spaces on the website, adapting the content of the advertisement to the content of the service requested or the use you make of our website. In order to do so, we may analyze your Internet browsing habits. we can analyze your browsing habits on the Internet and we can show you advertising related to your browsing profile.
        </p>
        <p>
          Behavioral advertising cookies: These are those that allow the management, in the most management, in the most effective way possible, of the advertising spaces that, where appropriate, the that, where appropriate, the editor has included in a web page, application or platform from or platform from which the requested service is provided. This type of cookies store information on the behavior of visitors obtained through obtained through the continuous observation of their browsing habits, which allows the browsing habits, which makes it possible to develop a specific profile in order to display ads based on the same.
        </p>

        <h3>DISABLE COOKIES</h3>
        <p>
          You can allow, block or delete cookies installed on your computer by setting your browser by configuring the options of the browser installed on your computer. installed on your computer.
        </p>
        <p>
          Most web browsers offer the possibility to allow, block or delete cookies installed on your computer.
        </p>
        <p>
          Below you can access the configuration of browsers to accept, install or disable cookies: Configure cookies in Google Chrome Configure cookies in Microsoft Internet Explorer Set cookies in Mozilla Firefox Set cookies in Safari (Apple) Set cookies in Safari (Apple) cookies in Safari (Apple)
        </p>

        <h3>THIRD PARTY COOKIES</h3>
        <p>
          This website uses third party services to collect information for statistical information for statistical and web usage purposes. Cookies are used DoubleClick cookies are used to improve the advertising included on the website. website. They are used to target advertising according to the content that is relevant to a user, thereby relevant to a user, thus improving the quality of the user experience. in the use of the site.
        </p>
        <p>
          In particular, we use the services of Google Adsense and Google Analytics for our statistics and advertising. Some cookies are essential for the operation of the site, for example the built-in search engine. incorporated.
        </p>
        <p>
          Our site includes other functionality provided by third parties. third parties. You can easily share the content on social networks such as Facebook, Twitter or Google +, with the buttons we have included for this purpose. included for this purpose.
        </p>

        <h3>WARNING ABOUT DELETING COOKIES</h3>
        <p>
          You can delete and block all cookies from this site, but part of the site will not work or the quality of the web page may be affected. be affected.
        </p>
        <p>
          If you have any questions about our cookie policy, you can contact this website through our contact this website through our contact channels.
        </p>
      </section>
      <Footer />
    </>
  );
}

export default Cookies;
