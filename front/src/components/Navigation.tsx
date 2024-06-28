import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavigationProps {
    isAuthenticated: boolean;
    userFirstName: string | null;
    handleLogout: () => void;
  }

  const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, userFirstName, handleLogout }) => {
    const navigate = useNavigate();

    const onLogout = () => {
      handleLogout();
      navigate('/view');
    };

    return (
      <nav>
        <ul>
          <li><Link to="/view">Products</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/mypage">My Page</Link></li>
              <li><span>Hi, {userFirstName}!</span></li>
              <li><button onClick={onLogout} className="auth-button">Logout</button></li>
            </>
          )}
          {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
        </ul>
      </nav>
    );
  };

  export default Navigation;
