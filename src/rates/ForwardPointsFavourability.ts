const processForwardPointsFavourability = (tenorRates: any[]): any[] => {
    return tenorRates.map((rate) => {
      let forwardPointsFavourability = '';
  
      if (rate.premiumDiscount === 'Discount' && rate.hedgedExposure === 'Negative')
        forwardPointsFavourability = 'Favourable';
      else if (rate.premiumDiscount === 'Discount' && rate.hedgedExposure === 'Positive')
        forwardPointsFavourability = 'Unfavourable';
      else if (rate.premiumDiscount === 'Premium' && rate.hedgedExposure === 'Positive')
        forwardPointsFavourability = 'Favourable';
      else if (rate.premiumDiscount === 'Premium' && rate.hedgedExposure === 'Negative')
        forwardPointsFavourability = 'Unfavourable';
  
      return { ...rate, forwardPointsFavourability };
    });
  };
  
  export default processForwardPointsFavourability;
  