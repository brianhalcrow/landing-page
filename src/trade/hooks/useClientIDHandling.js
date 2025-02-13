const useClientIDHandling = (amplifyUsername, clientID, setClientIDModalMessageParent, setShowClientIDModalParent) => {
  const handleClientIDCheck = (clientID, amount) => {
    console.log('Hook amplifyUsername:', amplifyUsername);
    console.log('Hook clientID:', clientID);

    if (clientID === amplifyUsername) {
      return false;
    }

    if (clientID === 'Other') {
      setClientIDModalMessageParent('Please complete the Client Onboarding form.');
      setShowClientIDModalParent(true);
      return true;
    }

    if (clientID === 'TEST') {
      setClientIDModalMessageParent('ClientID check in process');
      setShowClientIDModalParent(true);

      setTimeout(() => {
        setClientIDModalMessageParent('ClientID unverified');
        setShowClientIDModalParent(true);
      }, 2000);
      return true;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return true;
    }

    return false;
  };

  const handleClientIDModalClose = () => {
    setShowClientIDModalParent(false);
  };

  return {
    handleClientIDCheck,
    handleClientIDModalClose,
  };
};

export default useClientIDHandling;

