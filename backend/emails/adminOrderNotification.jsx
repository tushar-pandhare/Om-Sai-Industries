// emails/AdminOrderNotification.jsx
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Row, Column, Hr } from '@react-email/components';
import { emailStyles } from '../styles/emailStyles.js';

const AdminOrderNotification = ({ orderId, customerName, items, total, status, customerEmail, customerPhone, orderDate }) => {
  const getStatusBadge = () => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'confirmed') {
      return { ...emailStyles.badge, ...emailStyles.badgeConfirmed };
    }
    if (statusLower === 'cancelled') {
      return { ...emailStyles.badge, ...emailStyles.badgeCancelled };
    }
    if (statusLower === 'shipped') {
      return { ...emailStyles.badge, ...emailStyles.badgeShipped };
    }
    return { ...emailStyles.badge, ...emailStyles.badgePending };
  };

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f1f5f9', margin: 0, padding: '24px' }}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.header}>
            <Text style={{ ...emailStyles.logo, color: '#ffffff' }}>🛍️ Admin Portal</Text>
            <Text style={emailStyles.title}>New Order Alert</Text>
            <Text style={emailStyles.subtitle}>Action Required</Text>
          </Section>
          
          <Section style={emailStyles.content}>
            <Text style={emailStyles.greeting}>New Order Received</Text>
            <Text style={emailStyles.text}>
              A new order has been placed and requires your attention. Please review the details below and process the order promptly.
            </Text>
            
            <Section style={emailStyles.card}>
              <Text style={emailStyles.cardTitle}>Order Information</Text>
              <Row style={emailStyles.row}>
                <Column style={{ width: '40%' }}>
                  <Text style={emailStyles.label}>Order ID</Text>
                  <Text style={emailStyles.value}>#{orderId}</Text>
                </Column>
                <Column style={{ width: '30%' }}>
                  <Text style={emailStyles.label}>Status</Text>
                  <span style={getStatusBadge()}>{status || 'Pending'}</span>
                </Column>
                <Column style={{ width: '30%' }}>
                  <Text style={emailStyles.label}>Date</Text>
                  <Text style={emailStyles.value}>{orderDate || new Date().toLocaleDateString()}</Text>
                </Column>
              </Row>
              
              <Hr style={emailStyles.divider} />
              
              <Text style={emailStyles.label}>Customer Details</Text>
              <Text style={emailStyles.value}><strong>{customerName}</strong></Text>
              {customerEmail && <Text style={emailStyles.textSmall}>📧 {customerEmail}</Text>}
              {customerPhone && <Text style={emailStyles.textSmall}>📞 {customerPhone}</Text>}
            </Section>
            
            <Section style={emailStyles.card}>
              <Text style={emailStyles.cardTitle}>Order Items</Text>
              {items?.map((item, index) => (
                <Row key={index} style={{ marginBottom: '12px' }}>
                  <Column style={{ width: '60%' }}>
                    <Text style={{ margin: 0, fontSize: '14px', color: '#1a1a2e' }}>{item.name}</Text>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#718096' }}>Qty: {item.quantity}</Text>
                  </Column>
                  <Column style={{ width: '40%', textAlign: 'right' }}>
                    <Text style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>₹{item.price * item.quantity}</Text>
                  </Column>
                </Row>
              ))}
              <Hr style={emailStyles.divider} />
              <Row>
                <Column style={{ width: '70%' }}>
                  <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Total Amount</Text>
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' }}>
                  <Text style={{ fontSize: '18px', fontWeight: '700', color: '#0f3460', margin: 0 }}>₹{total}</Text>
                </Column>
              </Row>
            </Section>
            
            <Section style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href={`${process.env.ADMIN_URL}/orders/${orderId}`} style={emailStyles.button}>
                View & Process Order →
              </a>
            </Section>
          </Section>
          
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>This is an automated notification from your admin system.</Text>
            <Text style={emailStyles.footerText}>© {new Date().getFullYear()} Om Sai Industries. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminOrderNotification;