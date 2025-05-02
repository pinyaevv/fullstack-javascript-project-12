import { Container, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/auth/authSlice.js';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(state => state.auth);
  const { t } = useTranslation();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        {username && (
          <Button 
            variant="outline-primary"
            className="ms-auto"
            onClick={() => dispatch(logout())}
          >
            {t('logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};
