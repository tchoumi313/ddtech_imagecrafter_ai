import mongoose from "mongoose";
// a function to connect to mongoDB database using mongoose package and express js
const connectDB = (url) => {
    mongoose.set('strictQuery', true);
    mongoose.connect(url).then(() => console.log('MongoDB connected')).catch(err => console.log(err));
}


export default connectDB;
