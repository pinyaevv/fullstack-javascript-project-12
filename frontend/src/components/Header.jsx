import { Container, Navbar, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/auth/authSlice.js';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(state => state.auth);
  const { t } = useTranslation();

  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
      <Container fluid="md">
        <Navbar.Brand as={Link} to="/" className="me-3">
          Hexlet Chat
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="user-info ms-auto">
            {username && (
              <>
                <p className="username mb-0">{username}</p>
                <Button 
                  variant="outline-primary"
                  onClick={() => dispatch(logout())}
                  className="logout-btn"
                >
                  {t('ui_interface.logout')}
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
