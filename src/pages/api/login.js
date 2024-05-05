const { createConnection } = require('mysql2');

const DATABASE_PW = process.env.DATABASE_PW;

const connection = createConnection({
    host: 'database-1.cjc4wsmhzhgd.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: DATABASE_PW,
    database: 'logging'
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let data = req.body;
        connection.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [data.username, data.password],
            (error, results) => {
                if(error){
                    res.status(500).json({error: "Internal Server Error"});
                    return;
                }
                if (results.length === 0) {
                    res.status(401).json({ error: "User not found or invalid credentials" });
                    return;
                }
                res.status(200).json({message: "Login successfully"});
            }
        );
    }
};