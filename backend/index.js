const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const machinesRoutes = require('./routes/machines');
app.use('/machines', machinesRoutes);

if (require.main === module) {
  app.listen(port, () => console.log(`WaitLift backend running on port ${port}`));
}

module.exports = app;

