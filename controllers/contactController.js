const Contact = require('../models/Contact');
const createHttpError = require('http-errors');
const cloudinary = require('../config/cloudinary');

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      status: 200,
      message: 'Contacts retrieved successfully.',
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, user: req.user._id });
    
    if (!contact) {
      throw createHttpError(404, 'Contact not found.');
    }

    res.json({
      status: 200,
      message: 'Contact retrieved successfully.',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    let photoUrl = null;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'contacts',
          width: 300,
          crop: 'scale'
        });
        photoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        throw createHttpError(500, 'Failed to upload image.');
      }
    }

    const contact = new Contact({
      name,
      email,
      phone,
      photo: photoUrl,
      user: req.user._id
    });

    await contact.save();

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully.',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, user: req.user._id });
    
    if (!contact) {
      throw createHttpError(404, 'Contact not found.');
    }

    const { name, email, phone } = req.body;
    let photoUrl = contact.photo;

    if (req.file) {
      try {
        if (contact.photo) {
          const publicId = contact.photo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`contacts/${publicId}`);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'contacts',
          width: 300,
          crop: 'scale'
        });
        photoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        throw createHttpError(500, 'Failed to upload image.');
      }
    }

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.photo = photoUrl;

    await contact.save();

    res.json({
      status: 200,
      message: 'Contact updated successfully.',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, user: req.user._id });
    
    if (!contact) {
      throw createHttpError(404, 'Contact not found.');
    }

    if (contact.photo) {
      try {
        const publicId = contact.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`contacts/${publicId}`);
      } catch (deleteError) {
        console.error('Cloudinary delete error:', deleteError);
      }
    }

    await contact.deleteOne();

    res.json({
      status: 200,
      message: 'Contact deleted successfully.',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
}; 