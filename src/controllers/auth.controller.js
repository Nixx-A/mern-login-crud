import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json({ message: 'User already exists' })

    const passwordHashed = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: passwordHashed })

    const userSaved = await newUser.save()
    const token = await createAccessToken({ id: userSaved._id })
    res.cookie('token', token)
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      updatedAt: userSaved.updatedAt,
      createdAt: userSaved.createdAt
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const userFound = await User.findOne({ email })

    if (!userFound) return res.status(404).json({ message: 'User not found' })


    const isMatch = await bcrypt.compare(password, userFound.password)

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = await createAccessToken({ id: userFound._id })

    res.cookie('token', token)
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      updatedAt: userFound.updatedAt,
      createdAt: userFound.createdAt
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id)

  if (!userFound) return res.status(404).json({ message: 'User not found' })
  console.log(userFound);
  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    updatedAt: userFound.updatedAt,
    createdAt: userFound.createdAt
  })
}

export const verifyToken = async (req, res) => {
  const { token } = req.cookies

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' })

    const userFound = await User.findById(user.id)
    if (!userFound) return res.status(404).json({ message: 'Unauthorized' })

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    })
  })
}