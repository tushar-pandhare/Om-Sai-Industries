// emails/WelcomeEmail.jsx
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Row, Column } from '@react-email/components';
import { emailStyles } from '../styles/emailStyles.js';

const WelcomeEmail = ({ userName, shopName = "Om Sai Industries" }) => {
  const benefits = [
    { icon: '🛍️', title: 'Exclusive Products', description: 'Access our curated collection of premium products' },
    { icon: '🚚', title: 'Fast Shipping', description: 'Quick and reliable delivery to your doorstep' },
    { icon: '💳', title: 'Secure Payments', description: 'Multiple payment options with 100% security' },
    { icon: '🎁', title: 'Special Offers', description: 'Member-only discounts and early access to sales' },
  ];

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f1f5f9', margin: 0, padding: '24px' }}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={{ ...emailStyles.logo, color: '#ffffff' }}>🏭 {shopName}</Text>
            <Text style={emailStyles.title}>Welcome Aboard! 🎉</Text>
            <Text style={emailStyles.subtitle}>We're thrilled to have you with us</Text>
          </Section>
          
          <Section style={emailStyles.content}>
            <Text style={emailStyles.greeting}>Hello {userName || 'Valued Customer'},</Text>
            <Text style={emailStyles.text}>
              Thank you for choosing <strong>{shopName}</strong>! We're delighted to welcome you to our community of satisfied customers.
            </Text>
            <Text style={emailStyles.text}>
              As a valued member, you now have access to our complete range of quality products, personalized recommendations, and exclusive member benefits.
            </Text>
            
            <Section style={emailStyles.card}>
              <Text style={emailStyles.cardTitle}>✨ What You Can Expect</Text>
              {benefits.map((benefit, index) => (
                <Row key={index} style={{ marginBottom: '16px' }}>
                  <Column style={{ width: '40px' }}>
                    <Text style={{ fontSize: '24px', margin: 0 }}>{benefit.icon}</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' }}>
                      {benefit.title}
                    </Text>
                    <Text style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      {benefit.description}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
            
            <Section style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href={`${process.env.FRONTEND_URL}/products`} style={emailStyles.button}>
                Start Shopping →
              </a>
              <div style={{ marginTop: '16px' }}>
                <a href={`${process.env.FRONTEND_URL}/categories`} style={emailStyles.buttonOutline}>
                  Browse Categories
                </a>
              </div>
            </Section>
          </Section>
          
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              Have questions? We're here to help! Reach out to us at {process.env.ADMIN_EMAIL}
            </Text>
            <Text style={emailStyles.footerText}>
              Follow us on social media for updates and exclusive offers
            </Text>
            <Text style={emailStyles.footerText}>
              © {new Date().getFullYear()} {shopName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;