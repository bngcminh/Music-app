import mongoose from "mongoose";

export const connectDB = async function () {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connect MongoDB Success!');
    }catch (error) {
        console.log('Connect MongoDB Failure!');
        console.log(error);
        process.exit(1);
    }
}