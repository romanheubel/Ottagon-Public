// IMPORTS
import React from 'react';
import Button from './Button';
import useEmailsContext from '../hooks/useEmailsContext';
import Lottie from 'lottie-react';
import checkmarkAnimation from './animations/checkmark.json';
import crossedAnimation from './animations/crossed.json';

// COMPONENT THAT DISPLAYS THE FEEDBACK MESSAGE AFTER THE USER CLASSIFIED AN EMAIL
/* This component receives the following props from its parent (App.js):
 * - result: the result object returned by the API
 */
function Feedback({ result }) {
  const { setShowFeedback, setSelectedEmail, emails } = useEmailsContext();
  const score = result.score;
  const feedback = result.feedback;
  const id = result.id;

  const handleOnClick = () => {
    setShowFeedback(false);
    //FIND INDEX OF CURRENT EMAIL
    const index = emails.findIndex((email) => email.id === id);
    //SET NEXT EMAIL AS SELECTED EMAIL IF THERE IS A NEXT ONE
    if (index === emails.length - 1) setSelectedEmail(null);
    else setSelectedEmail(emails[index + 1]);
  };

  return (
    <div className="email-viewer-column">
      <div className="content">
        <div className="feedback">
          {score === 1 ? (
            <Lottie
              animationData={checkmarkAnimation}
              loop={false}
              playsegments={[0, 119]}
            />
          ) : (
            <Lottie
              animationData={crossedAnimation}
              loop={false}
              playsegments={[0, 119]}
            />
          )}
          <p>
            <strong>Feedback:</strong> {feedback}
          </p>
          <Button text={'Next'} onClick={handleOnClick} />
        </div>
      </div>
    </div>
  );
}

export default Feedback;
