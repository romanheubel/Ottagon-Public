// IMPORTS
import React from 'react';
import Button from './Button';
import useEmailsContext from '../hooks/useEmailsContext';

// COMPONENT TO DISPLAY THE JUDGE BUTTONS
/* This component uses the custom hook useEmailsContext to access the selected email and the judgeEmail function */
function Judge() {
  const { judgeEmail, selectedEmail, setShowFeedback } = useEmailsContext();

  const handleOnClick = async (isPhish) => {
    /* When users click on the judge buttons the selected email is judged and the API responds with feedback which is displayed to the user */
    await judgeEmail(selectedEmail.id, isPhish);
    setShowFeedback(true);
  };

  return (
    <div className="judge">
      <Button text={'Trust'} onClick={() => handleOnClick(false)} />
      <Button text={'Phish'} onClick={() => handleOnClick(true)} />
    </div>
  );
}

export default Judge;
