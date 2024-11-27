const multer = require('multer');
const xlsx = require('xlsx');
const Contact = require('../../models/contact');
const fs = require('fs');
const validator = require('validator');

// Function to process and normalize headers
const normalizeHeader = (header) => {
  const trimmedHeader = header.trim().toLowerCase();

  // Check for "phone" in the header but exclude non-phone headers like "address"
  if (trimmedHeader.includes('phone') && !trimmedHeader.includes('address')) {
    return trimmedHeader.replace(/phone/g, '').trim(); // Remove "phone" and normalize
  }
  return trimmedHeader; // Return as-is for other headers
};

const uploadExcelContactList = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const filePath = req.file.path;

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    // Normalize headers
    const headers = data[0].map(normalizeHeader);
    data = data.slice(1).map((row) => {
      const obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });

    // Normalize phone and email functions
    const normalizePhone = (phone) => {
      if (!phone || phone.trim().toLowerCase() === 'n/a') return null;
      return phone.replace(/\D/g, ''); // Remove non-numeric characters
    };

    const normalizeEmail = (email) => {
      if (!email || email.trim().toLowerCase() === 'n/a') return null;
      return validator.isEmail(email) ? email.trim().toLowerCase() : null;
    };

    // Map and validate contacts
    const contacts = data.map((row) => {
      const { first, last, cell, home, email } = row;

      if (!first || !last || !cell) {
        throw new Error(`Missing required fields for contact: ${JSON.stringify(row)}`);
      }

      return {
        name: {
          first: first.trim(),
          last: last.trim(),
        },
        phone: {
          cell: normalizePhone(cell),
          home: normalizePhone(home),
        },
        email: normalizeEmail(email),
      };
    });

    // Save contacts to the database
    const savedContacts = await Contact.insertMany(contacts);
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Contacts saved successfully',
      savedContacts,
    });
  } catch (error) {
    console.error('Error uploading contacts', error);
    res.status(500).json({ message: 'Error uploading contacts', error });
  }
};

module.exports = uploadExcelContactList;
