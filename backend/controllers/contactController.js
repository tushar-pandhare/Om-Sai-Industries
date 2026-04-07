const Contact = require('../models/Contact');

const getContactInfo = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Create default contact info if none exists
      contact = await Contact.create({
        phone: '+91 1234567890',
        email: 'info@omsaiindustries.com',
        address: '123 Business Park, Mumbai, India',
        businessHours: 'Monday - Friday: 9:00 AM - 7:00 PM<br/>Saturday: 10:00 AM - 4:00 PM<br/>Sunday: Closed'
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContactInfo = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    if (contact) {
      Object.assign(contact, req.body);
      contact.updatedBy = req.user._id;
      contact.updatedAt = Date.now();
      
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      const newContact = new Contact({
        ...req.body,
        updatedBy: req.user._id
      });
      const savedContact = await newContact.save();
      res.json(savedContact);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContactInfo, updateContactInfo };