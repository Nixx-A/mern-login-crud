import mongoose from 'mongoose'

export const connectDB = async () => {
try {
  await mongoose.connect('mongodb://localhost:27017/mern-login-crud')
  console.log('Connected to MongoDB')
} catch (err) {
  console.log(err)  
}
}