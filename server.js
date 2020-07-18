const express = require('express');
const models = require('./models');
const app = express();
app.get('/sync',(req,res)=>{
  models.sequelize.sync({ force: false }).then(()=>{
    console.log("Sync successfully")
  })
})
//Use body parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Config route 
app.use("/api",require('./routes/auth.route'));
app.use("/api/user",require('./routes/user.route'));
app.use("/api",require('./routes/post.route'));
const port = process.env.PORT || 8002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});