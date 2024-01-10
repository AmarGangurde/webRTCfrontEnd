import React, { useEffect } from 'react';

function GooglePayPage() {
  useEffect(() => {
    const loadGooglePayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = onGooglePayLoaded;
      document.body.appendChild(script);

      return () => {
        // Cleanup: remove the script when the component unmounts
        document.body.removeChild(script);
      };
    };

    loadGooglePayScript();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  const onGooglePayLoaded = () => {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
      .then(response => {
        if (response.result) {
          addGooglePayButton();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getGoogleIsReadyToPayRequest = () => {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [baseCardPaymentMethod]
    };
  };

  const getGooglePaymentDataRequest = () => {
    const paymentDataRequest = { ...baseRequest };
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
      merchantName: 'Example Merchant'
    };
    return paymentDataRequest;
  };

  const getGooglePaymentsClient = () => {
    if (paymentsClient === null) {
      paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
    }
    return paymentsClient;
  };

  const onGooglePaymentButtonClicked = () => {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
      .then(paymentData => {
        processPayment(paymentData);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const addGooglePayButton = () => {
    const paymentsClient = getGooglePaymentsClient();
    const button = paymentsClient.createButton({
      onClick: onGooglePaymentButtonClicked,
      allowedPaymentMethods: [baseCardPaymentMethod]
    });
    document.getElementById('container').appendChild(button);
  };

  const getGoogleTransactionInfo = () => {
    return {
      countryCode: 'US',
      currencyCode: 'USD',
      totalPriceStatus: 'FINAL',
      totalPrice: '1.00'
    };
  };

  const processPayment = (paymentData) => {
    console.log(paymentData);
    // @todo pass payment token to your gateway to process payment
    // @note DO NOT save the payment credentials for future transactions,
    // unless they're used for merchant-initiated transactions with user
    // consent in place.
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
  };

  // Base request and card payment method definitions
  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      'gateway': 'example',
      'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
  };

  const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks
    }
  };

  const cardPaymentMethod = {
    ...baseCardPaymentMethod,
    tokenizationSpecification: tokenizationSpecification
  };

  let paymentsClient = null;

  return (
    <div id="container"></div>
  );
}

export default GooglePayPage;
