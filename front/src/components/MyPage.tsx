import React, { useEffect, useState } from 'react';
import './MyPage.css';

interface UserInfo {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  username: string;
  address: string;
}

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [newInfo, setNewInfo] = useState({ first_name: '', last_name: '', phone_number: '', email: '', password: '', address: '' });
  const [newPassword, setNewPassword] = useState({ currentPassword: '', newPassword: '', reEnterPassword: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:8080/user-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInfo({ ...newInfo, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:8080/update-user-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newInfo)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to update info: ${error.message}`);
        return;
      }

      const data = await response.json();
      alert('Info updated successfully');
      // userInfo를 새로 업데이트
      const updatedUserInfo = {
        ...userInfo,
        first_name: newInfo.first_name,
        last_name: newInfo.last_name,
        phone_number: newInfo.phone_number,
        email: newInfo.email,
        address: newInfo.address,
        username: userInfo?.username || ''
      };
      setUserInfo(updatedUserInfo as UserInfo);
    } catch (error) {
      console.error('Error updating info:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.newPassword !== newPassword.reEnterPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:8080/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPassword)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to change password: ${error.message}`);
        return;
      }

      alert('Password changed successfully');
      setNewPassword({ currentPassword: '', newPassword: '', reEnterPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mypage-container">
      <h2>My Page</h2>

      <div className="user-info">
        <h3>User Info</h3>
        <p><strong>Name:</strong> {`${userInfo.first_name} ${userInfo.last_name}`}</p>
        <p><strong>Phone Number:</strong> {userInfo.phone_number}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Address:</strong> {userInfo.address}</p>
      </div>

      <div className="purchase-history">
        <h3>Purchase History</h3>
        <ul>
          <li>Order #12345 - Date: 2023-01-01 - Total: $100.00</li>
          <li>Order #67890 - Date: 2023-02-15 - Total: $50.00</li>
          <li>Order #11121 - Date: 2023-03-20 - Total: $75.00</li>
        </ul>
      </div>

      <div className="personal-info-change">
        <h3>Change Personal Info</h3>
        <form onSubmit={handleUpdateInfo}>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="first_name" placeholder="Enter new first name" defaultValue={userInfo.first_name} onChange={handleInfoChange} />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" placeholder="Enter new last name" defaultValue={userInfo.last_name} onChange={handleInfoChange} />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phone_number" placeholder="Enter new phone number" defaultValue={userInfo.phone_number} onChange={handleInfoChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter new email" defaultValue={userInfo.email} onChange={handleInfoChange} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" placeholder="Enter new address" defaultValue={userInfo.address} onChange={handleInfoChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" placeholder="Enter your password" value={newInfo.password} onChange={handleInfoChange} />
          </div>
          <button type="submit">Update Info</button>
        </form>
      </div>

      <div className="change-password-page">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label>Current Password:</label>
            <input type="password" name="currentPassword" placeholder="Enter your current password" value={newPassword.currentPassword} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input type="password" name="newPassword" placeholder="Enter your new password" value={newPassword.newPassword} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label>Re-enter Password:</label>
            <input type="password" name="reEnterPassword" placeholder="Re-enter your new password" value={newPassword.reEnterPassword} onChange={handlePasswordChange} />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default MyPage;
