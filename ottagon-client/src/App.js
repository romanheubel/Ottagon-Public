// IMPORTS
import React, { useEffect, useState } from 'react';
import FolderList from './components/FolderList';
import EmailList from './components/EmailList';
import EmailViewer from './components/EmailViewer';
import Feedback from './components/Feedback';
import Slides from './components/Slides';
import Schedule from './components/Schedule';
import Help from './components/Help';
import useEmailsContext from './hooks/useEmailsContext';
import useUser from './hooks/useUser';
import './App.css';

// MAIN APP COMPONENT
function App() {
  const {
    fetchEmails,
    selectedFolder,
    setSelectedFolder,
    foldersUpdated,
    setFoldersUpdated,
    folders,
    selectedEmail,
    setSelectedEmail,
    showFeedback,
    setShowFeedback,
    result,
  } = useEmailsContext();

  const { fetchUserPoints, points } = useUser();

  //CONFIGURATION PAREMETERS
  const testEnded = false;
  const secondSession = false;

  const [showIntroduction, setShowIntroduction] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showEndCard, setShowEndCard] = useState(false);
  const trainingIndicator = localStorage.getItem('showTrainingIndicator');
  const calendarIndicator = localStorage.getItem('showCalendarIndicator');

  // FETCH EMAILS ON FOLDER CHANGE
  useEffect(() => {
    if (result.nextChallenge) {
      return;
    } else if (foldersUpdated) {
      fetchEmails(selectedFolder);
      fetchUserPoints();
    }
  }, [
    fetchEmails,
    selectedFolder,
    foldersUpdated,
    setFoldersUpdated,
    result.nextChallenge,
    fetchUserPoints,
  ]);

  /* If users changed their device or browser in between challenges, this ensures that they continue with the second challenge */
  useEffect(() => {
    if (secondSession) {
      localStorage.setItem('passedFirstSession', 'true');
      localStorage.setItem('hasPassedIntro', 'true');
      localStorage.setItem('hasPassedTraining', 'true');
      localStorage.setItem('showTrainingIndicator', 'true');
      localStorage.setItem('showCalendarIndicator', 'true');
    }

    //CHATGPT was consulted to create the timeout function
    /* After a user completed the active challenge, the end card (slide set) is displayed after a delay of 3 seconds */
    if (result.end) {
      const delay = 3000;
      const timeout = setTimeout(() => {
        localStorage.setItem('passedFirstSession', 'true');
        setShowEndCard(true);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (result.nextChallenge) {
      const delay = 3000;
      const timeout = setTimeout(() => {
        localStorage.setItem('TrainingInProgress', 'true');
        localStorage.setItem('TrainingCurrentSlide', '0');
        setShowTraining(true);
        setSelectedEmail(null);
        setShowFeedback(false);
        localStorage.setItem('showTrainingIndicator', 'true');
        localStorage.setItem('showCalendarIndicator', 'true');
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [
    result,
    setShowTraining,
    setShowFeedback,
    setSelectedEmail,
    secondSession,
  ]);

  useEffect(() => {
    // Check if the introduction has been shown
    const hasPassedIntro = localStorage.getItem('hasPassedIntro');
    if (!hasPassedIntro) {
      // Set the flag to indicate the introduction will be shown
      setShowIntroduction(true);
    }
  }, []);

  // CLOSE SLIDES
  const handleSlidesClose = (set) => {
    if (set === 'intro') {
      localStorage.setItem('hasPassedIntro', 'true');
      setShowIntroduction(false);
    } else if (set === 'training') {
      // REMOVE CHALLENGE FLAG
      result.nextChallenge = false;
      localStorage.setItem('TrainingInProgress', 'false');
      localStorage.setItem('TrainingCurrentSlide', '0');
      // NOW FETCH EMAILS
      setFoldersUpdated(true);
      localStorage.setItem('hasPassedTraining', 'true');
      setShowTraining(false);
    } else if (set === 'end') {
      return;
    }
  };
  // RE-OPEN SLIDES ON USER REQUEST
  const handleTrainingClick = () => {
    localStorage.setItem('TrainingInProgress', 'true');
    localStorage.setItem('TrainingCurrentSlide', '3');
    setShowTraining(true);
  };

  //CHATGPT was consulted to handle the Overlay needed for the help tooltip
  const handleOverlayClick = () => {
    setShowHelp(false);
    setShowSchedule(false);
  };

  //CHECK IF THE INTRODUCTION OR TRAINING SHOULD BE SHOWN
  if (showIntroduction)
    return (
      <Slides
        set={'intro'}
        startSlide={0}
        handleSlidesClose={handleSlidesClose}
      />
    );
  if (showTraining || localStorage.getItem('TrainingInProgress') === 'true') {
    let currentSlide = +localStorage.getItem('TrainingCurrentSlide');
    return (
      <Slides
        set={'training'}
        startSlide={currentSlide}
        handleSlidesClose={handleSlidesClose}
      />
    );
  }
  // DISPLAY THE END CARD
  if (showEndCard)
    return (
      <Slides
        set={'end'}
        startSlide={0}
        handleSlidesClose={handleSlidesClose}
      />
    );

  // IF THE APP IS DISABLED, SHOW THIS MESSAGE
  if (testEnded) {
    return (
      <div className="signup-page">
        <div className="logo">
          <img src="/img/img-ottagon-logo.svg" alt="" />
        </div>
        <div className="signup-form-container">
          <p>This test has ended. Thank you to everyone who participated! </p>
        </div>
      </div>
    );
  }
  // DEFAULT APP STATE WITH NO ACTIVE SLIDES
  return (
    <div className="App">
      <div className="container">
        <div className="toolbar">
          <div
            className={`overlay ${showHelp || showSchedule ? 'show' : ''}`}
            onClick={() => handleOverlayClick()}
          />
          {trainingIndicator ? (
            <div
              className="training-indicator"
              onClick={() => handleTrainingClick()}
            >
              <img src="/icons/ico-training.svg" alt="help-icon"></img>Train
              again
            </div>
          ) : null}
          {showHelp ? (
            <Help showHelp={showHelp} setShowHelp={setShowHelp} />
          ) : (
            <div className="help-indicator" onClick={() => setShowHelp(true)}>
              <img src="/icons/ico-help.svg" alt="help-icon"></img>What should I
              do?
            </div>
          )}
          <div className="points-indicator">
            <img src="/icons/ico-phish.svg" alt="phish-points-icon"></img>
            {points}
          </div>
        </div>
        {showSchedule ? <Schedule /> : null}
        <FolderList
          folders={folders}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          setShowSchedule={setShowSchedule}
          calendarIndicator={calendarIndicator}
        />
        <EmailList
          selectedFolder={selectedFolder}
          setSelectedEmail={setSelectedEmail}
        />
        {showFeedback ? (
          <Feedback result={result} />
        ) : (
          <EmailViewer
            selectedEmail={selectedEmail}
            selectedFolder={selectedFolder}
          />
        )}
      </div>
    </div>
  );
}

export default App;
