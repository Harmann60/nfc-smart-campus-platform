const express = require('express');
const router = express.Router();


// Direct imports to bypass the "undefined" model issue
const LibraryTransaction = require('../models/LibraryTransaction');
const Book = require('../models/Book');


// 1. GET ALL LOGS
router.get('/transactions', async (req, res) => {
    try {
        console.log("Frontend is requesting logs...");
        const transactions = await LibraryTransaction.findAll({
            order: [['issue_date', 'DESC']]
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SCAN LOGIC
router.post('/scan', async (req, res) => {
    const { rfid_uid, user_uid } = req.body;
    try {
        // Validation: Verify book exists
        const bookExists = await Book.findOne({ where: { book_uid: rfid_uid } });
        
        if (!bookExists) {
            return res.status(404).json({ 
                message: `Denied: Book ${rfid_uid} is not in the system.` 
            });
        }

        const activeIssue = await LibraryTransaction.findOne({
            where: { book_uid: rfid_uid, status: 'ISSUED' }
        });

        if (activeIssue) {
            // RETURN
            activeIssue.status = 'RETURNED';
            activeIssue.return_date = new Date();
            await activeIssue.save();
            return res.json({ message: "Book Returned!" });
        } else {
            // ISSUE
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            await LibraryTransaction.create({
                book_uid: rfid_uid,
                user_uid: user_uid,
                status: 'ISSUED',
                issue_date: new Date(),
                due_date: dueDate,
                fine_amount: 0
            });
            return res.json({ message: "Book Issued!" });
        }
    } catch (err) {
        console.error("Scan Error:", err.message);
        res.status(500).json({ message: "Error: " + err.message });
    }
});

// 3. CLEAR FINE
router.post('/clear-fine/:id', async (req, res) => {
    try {
        const transaction = await LibraryTransaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Log not found" });
        transaction.fine_amount = 0;
        await transaction.save();
        res.json({ message: "Fine cleared!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;