import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Privacy Policy</h1>
      <p style={styles.metaText}>Last Updated: June 24, 2026</p>
      
      <p style={styles.paragraph}>
        At <strong>HomeNeeds</strong>, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our site or complete a transaction.
      </p>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.subHeading}>1. Information We Collect</h2>
        <p style={styles.paragraph}>We collect information you provide directly to us when using HomeNeeds, including:</p>
        <ul style={styles.list}>
          <li><strong>Identity Data:</strong> Name, username, and profile details.</li>
          <li><strong>Contact Data:</strong> Email address, shipping address, and phone number.</li>
          <li><strong>Transaction Data:</strong> Details about payments and products you have purchased.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, and navigation behaviors.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>2. How We Use Your Information</h2>
        <p style={styles.paragraph}>We use your data to provide a seamless shopping experience, specifically to:</p>
        <ul style={styles.list}>
          <li>Process and deliver your orders, including verifying eligibility for free shipping over ₹1,499.</li>
          <li>Manage your account and process returns within our 30-day policy.</li>
          <li>Send order updates or promotional materials (with option to unsubscribe).</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>3. Data Protection</h2>
        <p style={styles.paragraph}>
          We implement robust security measures to protect your personal data from unauthorized access, alteration, or disclosure. We do not sell your personal data to third parties. We only share necessary information with trusted service providers (like payment gateways and delivery partners).
        </p>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#333',
    lineHeight: '1.6',
  },
  mainHeading: {
    fontSize: '2.5rem',
    color: '#111',
    marginBottom: '10px',
  },
  metaText: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '30px',
  },
  subHeading: {
    fontSize: '1.5rem',
    color: '#1e3932',
    marginBottom: '12px',
  },
  paragraph: {
    marginBottom: '15px',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '30px',
  },
  divider: {
    border: '0',
    borderTop: '1px solid #eee',
    margin: '30px 0',
  }
};

export default PrivacyPolicy;