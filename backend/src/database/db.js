const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('DB Connected!')
    })
    .catch((err) => {
        console.log('DB Connecttion Error: ', err)
    })
}

module.exports = connectDB