import { Button } from 'antd';
import React from 'react';

const Header = () => (
  <div className="wrapper">
    <div className="header">
      <div className="logo">
        <div className="brand">300<span>.team</span></div>
        <div className="motto"><span>Communities Made Simple</span></div>
      </div>
      <div className="auth">
        <Button type="primary" size="large">Sign in with Discord</Button>
      </div>
    </div>
  </div>
)

export default Header;
