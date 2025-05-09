export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^[0-9]{13,19}$/.test(cleaned);
  };
  
  export const validateExpiryDate = (expiryDate: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
    return expiry > new Date();
  };
  
  export const validateCVC = (cvc: string): boolean => {
    return /^[0-9]{3,4}$/.test(cvc);
  };