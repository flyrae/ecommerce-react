import React, { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment from './CreditPayment';
import Total from './Total';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Name should be at least 4 characters.')
    .required('Name is required'),
  cardnumber: Yup.string()
    .min(13, 'Card number should be 13-19 digits long')
    .max(19, 'Card number should only be 13-19 digits long')
    .required('Card number is required.'),
  expiry: Yup.date()
    .required('Credit card expiry is required.'),
  ccv: Yup.string()
    .min(3, 'CCV length should be 3-4 digit')
    .max(4, 'CCV length should only be 3-4 digit')
    .required('CCV is required.'),
  type: Yup.string().required('Please select paymend mode')
});
const initialOptions = {"client-id":"Ac3o8lJweLsjvdPWC8P9osWr70mLhqo04y4qCnl0uuCwcOnHcG425Ms5AHzSIsHzr9MDT0CjYSnr5fey"};
const Payment = ({ shipping, payment, subtotal }) => {
  useDocumentTitle('Check Out Final Step | Odewm');
  useScrollTop();

  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'credit'
  };

  const onCreditCardSubmit = (values) => {
    // Handle credit card payment logic here
    console.log('Credit card payment:', values);
    displayActionMessage('Credit card payment processed', 'success');
  };

  const onPayPalSubmit = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: subtotal.toFixed(2),
          },
        },
      ],
    });
  };
  const styles = {
    shape: "rect",
    layout: "vertical",
};

  const onPayPalApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      console.log('PayPal payment completed:', details);
      displayActionMessage('PayPal payment processed', 'success');
    });
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }

  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onCreditCardSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="checkout-step-3">
            <div className="checkout-payment-wrapper">
              <div className="checkout-payment-method">
                <h3 className="underline">Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      checked={values.type === 'credit'}
                      onChange={() => setFieldValue('type', 'credit')}
                      type="radio"
                    />
                    <div className="payment-method-name">Credit Card</div>
                  </label>
                  <label className="payment-method">
                    <input
                      checked={values.type === 'paypal'}
                      onChange={() => setFieldValue('type', 'paypal')}
                      type="radio"
                    />
                    <div className="payment-method-name">PayPal</div>
                  </label>
                </div>
              </div>
              <div className="checkout-payment-details">
                {values.type === 'credit' ? (
                  <CreditPayment />
                ) : (
                  <div className="paypal-button-container">
                    {/* <PayPalButton
                      createOrder={onPayPalSubmit}
                      onApprove={onPayPalApprove}
                    /> */}
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons style={styles} />
                    </PayPalScriptProvider>
                  </div>
                )}
              </div>
            </div>
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);
