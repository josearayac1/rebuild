import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('JWT_SECRET no está configurado')
}

export const generateToken = (user) => {
  console.log('Generating token for user:', {
    id: user.id,
    email: user.email,
    userType: user.userType
  })
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token verified:', decoded)
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return null
  }
} 