// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri = "MONGO_URI=mongodb://armyforlife857:kritikajain14@ac-hu4gkk9-shard-00-00.dk6a9pb.mongodb.net:27017,ac-hu4gkk9-shard-00-01.dk6a9pb.mongodb.net:27017,ac-hu4gkk9-shard-00-02.dk6a9pb.mongodb.net:27017/?ssl=true&replicaSet=atlas-hu4gkk9-shard-0&authSource=admin&retryWrites=true&w=majority"
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// export async function connectDB() {
//   try {
//     await client.connect();
//     console.log("Connected successfully!");
//   } catch (err) {
//     console.error(err);
//   }
// }
import dns from 'node:dns';
import mongoose from 'mongoose';

dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;