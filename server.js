let express = require('express');
const path = require('path');

let app = express();
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});
app.listen(3000, '0.0.0.0');