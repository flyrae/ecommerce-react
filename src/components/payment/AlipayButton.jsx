import React from 'react';
import PropTypes from 'prop-types';

const AlipayButton = ({ amount, onSuccess }) => {
  const handleAlipayPayment = async () => {
    try {
      // 这里应该调用你的后端API来创建支付宝订单
      const response = await fetch('/api/create-alipay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Alipay order');
      }

      const { orderString } = await response.json();

      // 在实际场景中，这里应该重定向到支付宝支付页面
      // 或者使用支付宝SDK来处理支付流程
      console.log('Redirect to Alipay with order string:', orderString);

      // 模拟支付成功
      setTimeout(() => {
        onSuccess({ orderId: 'mock-order-id', status: 'success' });
      }, 2000);

    } catch (error) {
      console.error('Alipay payment error:', error);
    }
  };

  return (
    <button
      className="alipay-button"
      onClick={handleAlipayPayment}
    >
      Pay with Alipay
    </button>
  );
};

AlipayButton.propTypes = {
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AlipayButton;