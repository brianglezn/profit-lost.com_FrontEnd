import Footer from "../../../components/layout/Footer";
import "./Policy.scss";

export default function Privacy() {
  return (
    <div className="privacy">
      <a href="/" className="backHome no-select">
        --HOME
      </a>
      <div>
        <h1>Privacy Policy</h1>
        <p>This Privacy Policy describes how we collect, use, and protect the personal information of users of our personal finance management application.</p>

        <h2>Information We Collect</h2>
        <p>We collect the following personal information when users create an account in our application:</p>
        <ul>
          <li>Username: To identify users on our platform.</li>
          <li>First Name: To personalize the user experience.</li>
          <li>Last Name: To complete the user profile.</li>
          <li>Email: For sending notifications and account recovery.</li>
          <li>Password: To protect access to the user's account.</li>
        </ul>

        <h2>Use of Information</h2>
        <p>We use this information solely to provide users with personal finance management on a visual level. This includes:</p>
        <ul>
          <li>Creating and managing user accounts.</li>
          <li>Providing access to application features.</li>
          <li>Sending notifications related to the account and application updates.</li>
        </ul>
        <p>We do not share this information with third parties.</p>

        <h2>Data Retention</h2>
        <p>Personal data will be retained until the user decides to delete their account. Once the account is deleted, all data will be permanently removed from our systems.</p>

        <h2>User Rights</h2>
        <p>Users have the right to:</p>
        <ul>
          <li>Access: Request access to their personal data.</li>
          <li>Rectification: Request correction of inaccurate data.</li>
          <li>Deletion: Request deletion of their account and personal data.</li>
        </ul>
        <p>They can exercise these rights through the options available in their user profile within the application.</p>

        <h2>Security</h2>
        <p>We implement appropriate security measures to protect users personal information, including:</p>
        <ul>
          <li>Using encryption for passwords.</li>
          <li>HTTPS protocols for secure communication.</li>
          <li>Access controls to limit who can access personal information.</li>
        </ul>

        <h2>Jurisdiction</h2>
        <p>Our application operates globally. By using our application, users agree that their personal data may be processed and stored in any country where we operate. We are committed to complying with applicable data protection laws.</p>

        <h2>Changes to this Policy</h2>
        <p>We reserve the right to modify this Privacy Policy at any time. Changes will be notified to users through the application or by email. It is recommended to review this policy periodically.</p>
      </div>
      <Footer />
    </div>
  );
}
