import React from 'react';
import './MyPage.css';

const MyPage: React.FC = () => {
  return (
    <div className="mypage-container">
      <h2>My Page</h2>

      <div className="user-info">
        <h3>User Info</h3>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Phone Number:</strong> +1234567890</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Username:</strong> johndoe</p>
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
        <form>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" placeholder="Enter new name" />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" placeholder="Enter new phone number" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="Enter new email" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button type="submit">Update Info</button>
        </form>
      </div>

      <div className="change-password-page">
        <h3>Change Password</h3>
          <div className="form-group">
            <label>New Password:</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-group">
            <label>Re-enter Password:</label>
            <input type="password" placeholder="Enter your password" />
          </div>
      </div>
      <button type="submit">Change Password</button>
    </div>
  );
}

export default MyPage;
