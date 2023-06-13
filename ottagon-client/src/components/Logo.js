// IMPORTS
import React from 'react';
import useEmailsContext from '../hooks/useEmailsContext';

// COMPONENT TO DISPLAY THE LOGO
// This component uses the custom hook useEmailsContext to access the selected email and folder
function Logo() {
  const { setSelectedEmail, setSelectedFolder } = useEmailsContext();

  const handleLogoClick = () => {
    // When users click on the logo the selected email and folder are reset to their default values
    setSelectedEmail(null);
    setSelectedFolder('Inbox');
  };

  return (
    <div className="logo" onClick={handleLogoClick}>
      <img src="img/img-ottagon-logo.svg" alt="Logo" />
    </div>
  );
}

export default Logo;
