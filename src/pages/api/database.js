const {createConnection} = require('mysql2');

const DATABASE_PW = process.env.DATABASE_PW

const connection = createConnection({
    host: 'database-1.cjc4wsmhzhgd.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: DATABASE_PW,
    database: 'logging'
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Extract data from the request body
        let data = req.body;

        // Insert data into the database
        connection.query(
            'INSERT INTO logging (username,session, timestamp, role, message) VALUES (?)',
            [[data.username, data.session, data.timestamp, data.role, data.message]],
            (error, results) => {
                if (error) {
                    res.status(500).json({error: "Internal Server Error"});
                    return;
                }
                res.status(201).json({message: "Data inserted successfully", id: results.insertId});
            }
        );
    } else if (req.method === 'GET') {
        // Handle GET request
        connection.query('SELECT * FROM your_table', (error, results) => {
            if (error) {
                res.status(500).json({error: "Internal Server Error"});
                return;
            }
            res.status(200).json(results);
        });
    }
}
