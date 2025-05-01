import { Container, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/features/auth/authSlice.js';

export const Header = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(state => state.auth);

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        {username && (
          <Button 
            variant="outline-primary" 
            onClick={() => dispatch(logout())}
          >
            Выйти
          </Button>
        )}
      </Container>
    </Navbar>
  );
};
