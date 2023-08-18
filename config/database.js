const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

mongoose
.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => { console.log("Connected to MongoDB")})
.catch(() => { console.log("Failed to connect to MongoDB")});
