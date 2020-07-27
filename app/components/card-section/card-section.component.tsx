import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  classes: {
    base: 'ant-input',
  },
  style: {
    base: {
      color: 'rgba(255, 255, 255, 0.65)',
      fontSize: '18px',
      fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto',
      fontWeight: '400',
    },
  },
};

const CardSection: React.FC = () => {
  return (
    <div className="stripe-300 ant-form-item-control-input">
      <div className="ant-form-item-control-input-content">
        <style jsx global>{`
          .stripe-300 .ant-input {
            padding: 20px;
          }
        `}</style>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </div>
  );
};

export default CardSection;
