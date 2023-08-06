import { Router } from 'express'
import { login, register, logout, profile, verifyToken } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router()

router.get('/', (req, res) => {
  res.send('hello')
})

router.post('/login', validateSchema(loginSchema), login)

router.post('/register', validateSchema(registerSchema), register)

router.post('/logout', logout)

router.get('/profile', authRequired, profile)

router.get('/verify', verifyToken)
export default router