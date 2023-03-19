import mongoose from 'mongoose';
import { MONGO_URI } from "../constants/config.const.js"

//takes Mongo URI from env file and creates connection
const connectDB = async () => {
	try {
		console.log('mongoURI - ', process.env.MONGO_URI);
		const connection = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB Connected: ${connection.connection.host}`);
	} catch (error) {
		console.log(`Logged DB Error: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;