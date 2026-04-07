// components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHome, FaBox, FaTags, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaShoppingBag, FaUserAlt, FaComments, FaHeadset, FaHeart } from 'react-icons/fa';
import { fetchContactInfo } from '../features/contact/contactSlice';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const { contactInfo, loading } = useSelector((state) => state.contact);
  
  useEffect(() => {
    dispatch(fetchContactInfo());
  }, [dispatch]);
  
  const quickLinks = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Products', path: '/products', icon: FaBox },
    { name: 'Offers', path: '/offers', icon: FaTags },
    { name: 'Contact', path: '/contact', icon: FaEnvelope },
  ];

  const customerLinks = [
    { name: 'Orders', path: '/orders', icon: FaShoppingBag },
    { name: 'Complaint', path: '/complaint', icon: FaHeadset },
    { name: 'Feedback', path: '/feedback', icon: FaComments },
    { name: 'Profile', path: '/profile', icon: FaUserAlt },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: contactInfo?.socialMedia?.facebook || '#', color: 'hover:bg-[#1877f2]' },
    { name: 'Instagram', icon: FaInstagram, url: contactInfo?.socialMedia?.instagram || '#', color: 'hover:bg-[#e4405f]' },
    { name: 'Twitter', icon: FaTwitter, url: contactInfo?.socialMedia?.twitter || '#', color: 'hover:bg-[#1da1f2]' },
    { name: 'LinkedIn', icon: FaLinkedin, url: contactInfo?.socialMedia?.linkedin || '#', color: 'hover:bg-[#0a66c2]' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Om Sai Industries
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Quality products at best prices since 2010.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    <link.icon className="w-3 h-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-md font-semibold mb-2">Support</h3>
            <ul className="space-y-1.5">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    <link.icon className="w-3 h-3" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-md font-semibold mb-2">Contact</h3>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <FaPhone className="w-3 h-3 text-blue-400" />
                <span>{loading ? '...' : (contactInfo?.phone || '+91 1234567890')}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <FaEnvelope className="w-3 h-3 text-purple-400" />
                <span className="truncate">{loading ? '...' : (contactInfo?.email || 'info@omsai.com')}</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <FaMapMarkerAlt className="w-3 h-3 text-pink-400 mt-0.5" />
                <span>{loading ? '...' : (contactInfo?.address || 'Mumbai, India')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} Om Sai Industries. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button - Only show after scroll */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 opacity-90 hover:opacity-100"
        aria-label="Back to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;