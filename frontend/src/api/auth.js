import { toast } from 'react-toastify'
import axios from 'axios'

const API_URL = '/api/v1'

const showAuthError = t => () => toast.error(t('notify.auth_error'))

const logError = message => error => console.error(message, error)

const handleLoginResponse = (response, t) => {
  if (response?.data?.token) {
    return response.data.token
  }
  throw new Error(t('errors.server_did_not_return_token'))
}

export const login = async (username, password, t) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password })
    return handleLoginResponse(response, t)
  }
  catch (error) {
    showAuthError(t)()
    logError('Auth error:')(error)
    throw error
  }
}

export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/channels`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.status === 200
  }
  catch (error) {
    logError('Token verification error:')(error)
    return false
  }
}

export const checkAuth = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    const isValid = await verifyToken(token)
    if (!isValid) {
      localStorage.removeItem('token')

      if (window.Rollbar) {
        window.Rollbar.warning('Invalid token detected and removed from localStorage')
      }
    }
  }
}
