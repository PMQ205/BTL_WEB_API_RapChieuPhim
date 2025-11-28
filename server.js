const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./Sources/config/db'); // chỉ để chạy kết nối

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: 'API RAPCHIEUPHIM đang chạy!' });
});


const phimRoutes = require('./Sources/Routes/filmRouter');
app.use('/api/film', phimRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
