const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors')
const userRoutes = require('./src/routes/userRoutes')
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./src/utils/swagger-json.json');
const connectDB = require('./src/utils/connectDb');
const app = express()

const port = process.env.PORT // dotenv PORT
const url = process.env.API      // dotenv URL

//CORS Policy and json
app.use(express.json())
app.use(cors())

//Middlewares
//Swagger Ui Interface
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson))
// app.use((req, res, next) => {
//     console.log(req, "Request")
//     next()
// })
//Handles User Route
app.use(`${url}/users`, userRoutes)
// app.use(`${url}/users`, (req, res) => {
//     res.send("USERS PATH")
// })


//If user intereact with base path redirect to main path
app.get('/', (req, res) => {
    res.redirect(`${url}/users`)
})

// Not found route 
app.get('*', (req, res) => {
    res.send("NOT FOUND")
})
// Start server after connecting mongodb server
connectDB().then((res => {
    console.log("Database connected successfully")
    app.listen("https://gutargu-3tib.onrender.com", () => {
        console.log(`Server is running on https://gutargu-3tib.onrender.com`);
    });
})).catch(err => console.log(err + 'error'))


