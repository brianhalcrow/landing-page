const processFDV = (tenorRates: any[]): any[] => {
    return tenorRates.map((rate) => {
      let fdv;
      
      if (rate.currency_pair.includes('JPY')) {
        fdv = 100;
      } else if (rate.currency_pair.includes('COP') || rate.currency_pair.includes('MXN')) {
        fdv = 1;
      } else {
        fdv = 10000;
      }
  
      return { ...rate, fdv };
    });
  };
  
  export default processFDV;
  