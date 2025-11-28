const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Quan175204@',
    database: 'RAPCHIEUPHIM'
});

db.connect((err) => {
    if (err) {
        console.log('Kết nối MySQL thất bại:', err);
        return;
    }
    console.log('Kết nối MySQL thành công');
});

module.exports = db;
