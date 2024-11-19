const express = require('express');
const router = express.Router();
const db = require('./db');  // Import the database connection from db.js

// Add Deposit Route
router.post('/add-deposit', (req, res) => {
    const { amount } = req.body;

    // Calculate daily income (1.5% of deposit amount)
    const dailyIncome = (amount * 1.5) / 100;
    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + 365);  // Set maturity date to 365 days ahead

    // Format the date in 'YYYY-MM-DD' format to match MySQL DATE format
    const formattedMaturityDate = maturityDate.toISOString().split('T')[0]; 

    console.log(`Inserting deposit: Amount = ${amount}, Daily Income = ${dailyIncome}, Maturity Date = ${formattedMaturityDate}`);

    // MySQL query to insert the new deposit into the deposits table
    const query = `
        INSERT INTO deposits (amount, daily_income, total_balance, maturity_date)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [amount, dailyIncome, amount, formattedMaturityDate], (err) => {
        if (err) {
            console.error('Error adding deposit:', err);  // Log the error
            res.status(500).send('Error adding deposit');
            return;
        }
        res.redirect('/deposits');  // Redirect to the deposits page after the deposit is added
    });
});

// Get all deposits (to display in a table)
router.get('/deposits', (req, res) => {
    // Query to select all deposits from the database
    const query = 'SELECT * FROM deposits';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving deposits:', err);  // Log the error
            res.status(500).send('Error retrieving deposits');
            return;
        }

        // Construct the HTML table to display the deposit data
        let html = `
            <html>
                <head>
                    <title>Deposits Table</title>
                    <link rel="stylesheet" type="text/css" href="/styles.css">
                </head>
                <body>
                    <h1>Deposits Table</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Amount</th>
                                <th>Daily Income</th>
                                <th>Total Balance</th>
                                <th>Maturity Date</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        // Loop through the results and add them to the HTML table
        results.forEach(deposit => {
            html += `
                <tr>
                    <td>${deposit.id}</td>
                    <td>${deposit.amount}</td>
                    <td>${deposit.daily_income}</td>
                    <td>${deposit.total_balance}</td>
                    <td>${deposit.maturity_date}</td>
                </tr>
            `;
        });

        html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

        // Send the HTML table with deposit data as the response
        res.send(html);
    });
});

module.exports = router;
