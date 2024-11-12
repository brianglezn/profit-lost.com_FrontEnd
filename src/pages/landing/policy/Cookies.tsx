import Footer from "../../../components/layout/Footer";
import "./Policy.scss";

export default function Cookies() {
  return (
    <div className="cookies">
      <a href="/" className="backHome no-select">
        --HOME
      </a>
      <div>
        <h1>Cookies Policy</h1>
        <p>In our application, we use cookies to improve the user experience and provide essential functionalities for login.</p>

        <h2>What are Cookies?</h2>
        <p>A cookie is a small text file stored in the user's browser when they access our application. These cookies allow our application to remember information about the user's session.</p>

        <h2>Use of Cookies</h2>
        <p>In our application, we use the following cookies:</p>
        <ul>
          <li>JWT: This cookie stores the Authentication Token (JWT) required for login. It allows users to remain authenticated during their session.</li>
        </ul>

        <h2>Consent</h2>
        <p>We do not require explicit consent for the use of this cookie, as it is necessary for the operation of the application and is not used for advertising or analytics purposes.</p>

        <h2>How to Disable Cookies</h2>
        <p>Users can configure their browser to block or delete cookies. However, this may affect the functionality of the application, especially login and access to personalized features.</p>

        <h2>Changes to this Cookies Policy</h2>
        <p>We reserve the right to modify this Cookies Policy at any time. Changes will be notified to users through the application. It is recommended to review this policy periodically.</p>
      </div>
      <Footer />
    </div>
  );
}
