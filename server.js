const  express  = require("express")
const app  = express();
const PORT =  process.env.PORT || 3005
const db =  require("./config/db")
const users =  require("./routes/user")
const auth =  require("./routes/auth")
const cors  = require("cors")
const a =  1
//add cross origin function
app.use(cors())
app.use(express.urlencoded (),express.json())
//connection to database
db();


// set up routes
app.use('/api/users',users);
app.use("/api/auth",auth);



app.listen(PORT, ()=>{
     console.log(`Listening on port ${PORT}`)
})

