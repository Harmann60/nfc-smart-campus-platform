const Book = require('../models/Book');
const LibraryTransaction = require('../models/LibraryTransaction');

exports.handleLibraryScan = async (req, res) => {
  const { rfid_uid, user_uid } = req.body; // user_uid sent from frontend after student scans

  try {
    // 1. Find the book
    const book = await Book.findByPk(rfid_uid);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // 2. Check if book is already ISSUED
    const existingTx = await LibraryTransaction.findOne({
      where: { book_uid: rfid_uid, status: 'ISSUED' }
    });

    if (existingTx) {
      // --- RETURN LOGIC ---
      const today = new Date();
      const dueDate = new Date(existingTx.due_date);
      let fine = 0;

      if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Your requested fine logic
        if (diffDays > 15) {
          fine = (15 * 5) + ((diffDays - 15) * 10);
        } else if (diffDays > 7) {
          fine = diffDays * 5;
        }
      }

      await existingTx.update({ return_date: today, fine_amount: fine, status: 'RETURNED' });
      await book.update({ is_available: true });
      
      return res.json({ message: "Book Returned", fine });
    } else {
      // --- ISSUE LOGIC ---
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now

      await LibraryTransaction.create({
        book_uid: rfid_uid,
        user_uid: user_uid,
        due_date: dueDate
      });
      await book.update({ is_available: false });

      return res.json({ message: "Book Issued Successfully", dueDate });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};