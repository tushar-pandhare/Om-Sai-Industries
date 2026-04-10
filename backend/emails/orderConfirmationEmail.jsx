// emails/OrderConfirmationEmail.jsx
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Hr, Row, Column } from '@react-email/components';
import { emailStyles } from '../styles/emailStyles.js';

const OrderConfirmationEmail = ({ orderId, userName, items, total, status, shopName = "Om Sai Industries", orderDate }) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f1f5f9', margin: 0, padding: '24px' }}>
        <Container style={emailStyles.container}>
          <Section style={status === 'confirmed' ? emailStyles.headerSuccess : emailStyles.header}>
            <Text style={{ ...emailStyles.logo, color: '#ffffff' }}>✨ {shopName}</Text>
            <Text style={emailStyles.title}>
              {status === 'confirmed' ? 'Order Confirmed!' : 'Order Placed Successfully!'}
            </Text>
            <Text style={emailStyles.subtitle}>Order #{orderId}</Text>
          </Section>
          
          <Section style={emailStyles.content}>
            <Text style={emailStyles.greeting}>Dear {userName || 'Valued Customer'},</Text>
            <Text style={emailStyles.text}>
              Thank you for your purchase! We're pleased to confirm that your order has been{' '}
              <strong>{status === 'confirmed' ? 'confirmed' : 'received'}</strong> and is being processed.
            </Text>
            
            <Section style={emailStyles.card}>
              <Text style={emailStyles.cardTitle}>Order Summary</Text>
              {items?.map((item, index) => (
                <Row key={index} style={{ marginBottom: '12px' }}>
                  <Column style={{ width: '55%' }}>
                    <Text style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{item.name}</Text>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#718096' }}>Quantity: {item.quantity}</Text>
                  </Column>
                  <Column style={{ width: '25%', textAlign: 'center' }}>
                    <Text style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>₹{item.price}</Text>
                  </Column>
                  <Column style={{ width: '20%', textAlign: 'right' }}>
                    <Text style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>₹{item.price * item.quantity}</Text>
                  </Column>
                </Row>
              ))}
              <Hr style={emailStyles.divider} />
              <Row>
                <Column style={{ width: '70%' }}>
                  <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Order Total</Text>
                  {orderDate && <Text style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Placed on {orderDate}</Text>}
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' }}>
                  <Text style={{ fontSize: '20px', fontWeight: '700', color: '#0f3460', margin: 0 }}>₹{total}</Text>
                </Column>
              </Row>
            </Section>
            
            <Section style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px', marginTop: '16px', border: '1px solid #bbf7d0' }}>
              <Text style={{ margin: 0, fontSize: '13px', color: '#166534', textAlign: 'center' }}>
                📦 You'll receive shipping confirmation once your order is dispatched.
              </Text>
            </Section>
            
            <Section style={{ textAlign: 'center', marginTop: '28px' }}>
              <a href={`${process.env.FRONTEND_URL}/orders/${orderId}`} style={emailStyles.button}>
                Track Your Order →
              </a>
            </Section>
          </Section>
          
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>Need assistance? Contact our support team at {process.env.ADMIN_EMAIL}</Text>
            <Text style={emailStyles.footerText}>© {new Date().getFullYear()} {shopName}. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;