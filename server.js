const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models');
const app = express();
app.get('/sync',(req,res)=>{
  models.sequelize.sync({ force: false }).then(()=>{
    console.log("Sync successfully")
  })
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});