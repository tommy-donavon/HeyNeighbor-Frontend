export default class PayPalClient {
  static getToken = async () => {
    let buf = Buffer.from(
      `${process.env.VUE_APP_PAYPAL_CLIENT}:${process.env.VUE_APP_PAYPAL_SECRET}`,
    );
    let authHead = buf.toString('base64');
    try {
      const tokenResponse = await fetch(
        `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHead}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `${encodeURIComponent('grant_type')}=${encodeURIComponent(
            'client_credentials',
          )}`,
        },
      );
      const data = await tokenResponse.json();
      if (!tokenResponse.ok) {
        const data = await tokenResponse.json();
        const error = new Error(data.message || `Failed to get token`);
        error.response = data;
        throw error;
      }
      return data.access_token;
    } catch (err) {
      console.error(err);
    }
  };

  static getActionUrl = async() => {
    const token = await this.getToken()
    try {
      const actionResponse = await fetch('https://api-m.sandbox.paypal.com/v2/customer/partner-referrals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partner_details)
      }) 
      const data = await actionResponse.json();
      console.log(data)
      if (!actionResponse.ok) {
        const data = await actionResponse.json();
        const error = new Error(data.message || `Failed to get action url`);
        error.response = data;
        throw error;
      }
      return data.links[1].href;
    }catch(err){
      console.error(err)
    }
  }
}

const partner_details = {
  operations: [
    {
      operation: "API_INTEGRATION",
      api_integration_preference: {
        rest_api_integration: {
          integration_method: "PAYPAL",
          integration_type: "THIRD_PARTY",
          third_party_details: {
            features: [
              "PAYMENT",
              "REFUND"
            ]
          }
        }
      }
    }
  ],
  products: [
    "EXPRESS_CHECKOUT"
  ],
  legal_consents: [
    {
      type: "SHARE_DATA_CONSENT",
      granted: true,
    }
  ]
}
