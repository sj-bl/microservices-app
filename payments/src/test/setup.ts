import request from "supertest";
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Mongoose } from "mongoose";


let mongo: any;

jest.mock('../natsWrapper')

declare global {
  namespace NodeJS {
    interface Global {
      getcookie(userId?: string): string[];
    }
  }
}

process.env.STRIPE_SECRET = 'sk_test_51Gw3jiEnwVW1SW8r1KnmeTfRNkNWJOFOfnOGIfLjvzeTBTLkJx7g2CE4jGQiSBSTGcTRKskkemuXqQxKkHggrBxK00b1aB0HWn'

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "idontknow";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to database')
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getcookie = (userId?: string) => {
  const email = "test@test.com";
  const id = userId || new mongoose.Types.ObjectId().toHexString();

  const token = jwt.sign({ email, id }, process.env.JWT_KEY!)
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64Encoded = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${base64Encoded}`];
};
