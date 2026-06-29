import React from 'react';

const TermsOfService = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Terms of Service</h1>
      <p style={styles.metaText}>Last Updated: June 24, 2026</p>
      
      <p style={styles.paragraph}>
        Welcome to <strong>HomeNeeds</strong>! These Terms of Service ("Terms") govern your use of our website and the purchase of any products from our platform. By accessing or using our website, you agree to be bound by these Terms.
      </p>

      <hr style={styles.divider} />

      <section style={styles.section}>
        <h2 style={styles.subHeading}>1. Account Creation and Security</h2>
        <p style={styles.paragraph}>
          To make a purchase, you may be required to create an account. You must provide accurate and complete information. You are entirely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>2. Product Information and Pricing</h2>
        <p style={styles.paragraph}>
          We strive to be as accurate as possible with product descriptions, categories (including Electronics, Mobiles, Fashion, Grocery, Home & Kitchen, etc.), and images. All prices are displayed and processed in Indian Rupees (₹), unless stated otherwise.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>3. Shipping and Returns</h2>
        <p style={styles.paragraph}>
          We offer free standard shipping on orders total over <strong>₹1,499</strong>. Orders under this amount will be subject to shipping fees calculated at checkout. We provide an easy <strong>30-day return window</strong> for eligible products. Items must be returned in their original condition and packaging.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>4. Limitation of Liability</h2>
        <p style={styles.paragraph}>
          HomeNeeds and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or the inability to use our services or products purchased through the platform.
        </p>
      </section>
    </div>
  );
};

// Simple clean styling object
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
    color: '#1e3932', // Matches the deep green/earthy theme of your site
    marginBottom: '12px',
  },
  paragraph: {
    marginBottom: '20px',
    textAlign: 'justify',
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

export default TermsOfService;