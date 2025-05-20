import { Container, Navbar, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logout } from '../app/features/auth/authSlice.js'

const Header = () => {
  const dispatch = useDispatch()
  const { username } = useSelector((state) => state.auth)
  const { t } = useTranslation()

  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="me-3">
          Hexlet Chat
        </Navbar.Brand>

        <div className="user-info d-flex align-items-center">
          {username && (
            <>
              <p className="username mb-0 me-3">{username}</p>
              <Button
                variant="outline-primary"
                onClick={() => dispatch(logout())}
                className="logout-btn"
                aria-label="logout"
              >
                {t('ui_interface.logout')}
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  )
}

export default Header
