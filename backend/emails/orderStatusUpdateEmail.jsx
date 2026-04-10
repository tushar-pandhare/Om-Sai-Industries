// emails/OrderStatusUpdateEmail.jsx
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Row, Column } from '@react-email/components';
import { emailStyles } from '../styles/emailStyles.js';

const OrderStatusUpdateEmail = ({ orderId, userName, oldStatus, newStatus, shopName = "Om Sai Industries", estimatedDelivery }) => {
  const getHeaderStyle = () => {
    const statusLower = newStatus?.toLowerCase();
    if (statusLower === 'confirmed') return emailStyles.headerSuccess;
    if (statusLower === 'cancelled') return emailStyles.headerDanger;
    if (statusLower === 'shipped') return emailStyles.headerWarning;
    return emailStyles.header;
  };

  const getStatusMessage = () => {
    const statusLower = newStatus?.toLowerCase();
    if (statusLower === 'confirmed') {
      return 'Your order has been confirmed and is being prepared for shipping.';
    }
    if (statusLower === 'shipped') {
      return `Great news! Your order is on its way${estimatedDelivery ? ` and expected to arrive by ${estimatedDelivery}` : ''}.`;
    }
    if (statusLower === 'cancelled') {
      return 'We regret to inform you that your order has been cancelled.';
    }
    if (statusLower === 'delivered') {
      return 'Your order has been delivered. We hope you enjoy your purchase!';
    }
    return `Your order status has been updated to ${newStatus}.`;
  };

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f1f5f9', margin: 0, padding: '24px' }}>
        <Container style={emailStyles.container}>
          <Section style={getHeaderStyle()}>
            <Text style={{ ...emailStyles.logo, color: '#ffffff' }}>📦 {shopName}</Text>
            <Text style={emailStyles.title}>Order Status Update</Text>
            <Text style={emailStyles.subtitle}>Order #{orderId}</Text>
          </Section>
          
          <Section style={emailStyles.content}>
            <Text style={emailStyles.greeting}>Dear {userName || 'Valued Customer'},</Text>
            <Text style={emailStyles.text}>{getStatusMessage()}</Text>
            
            <Section style={emailStyles.card}>
              <Text style={emailStyles.cardTitle}>Status Update</Text>
              <Row style={{ textAlign: 'center' }}>
                <Column>
                  <div style={{ 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'inline-block',
                    width: '100%'
                  }}>
                    <Text style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Previous Status</Text>
                    <Text style={{ fontSize: '16px', fontWeight: '500', color: '#64748b', margin: 0 }}>
                      {oldStatus?.charAt(0).toUpperCase() + oldStatus?.slice(1)}
                    </Text>
                  </div>
                </Column>
                <Column style={{ width: 'auto', padding: '0 8px' }}>
                  <Text style={{ fontSize: '24px', color: '#94a3b8' }}>→</Text>
                </Column>
                <Column>
                  <div style={{ 
                    backgroundColor: newStatus === 'confirmed' ? '#d1fae5' : newStatus === 'shipped' ? '#fed7aa' : '#e0e7ff',
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'inline-block',
                    width: '100%'
                  }}>
                    <Text style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Current Status</Text>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>
                      {newStatus?.charAt(0).toUpperCase() + newStatus?.slice(1)}
                    </Text>
                  </div>
                </Column>
              </Row>
            </Section>
            
            <Section style={{ textAlign: 'center', marginTop: '28px' }}>
              <a href={`${process.env.FRONTEND_URL}/orders/${orderId}`} style={emailStyles.button}>
                View Order Details →
              </a>
            </Section>
          </Section>
          
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>Questions about your order? Contact us at {process.env.ADMIN_EMAIL}</Text>
            <Text style={emailStyles.footerText}>© {new Date().getFullYear()} {shopName}. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusUpdateEmail;