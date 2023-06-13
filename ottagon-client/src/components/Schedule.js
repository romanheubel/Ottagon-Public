// IMPORTS
import React, { useEffect } from 'react';
import useUser from '../hooks/useUser';

// COMPONENT THAT DISPLAYS JUDY'S SCHEDULE
/* This component uses the custom hook useUser to access the user's current challenge to adjust the displayed schedule accordingly */
function Schedule() {
  const { fetchUserChallenge, challenge } = useUser();

  useEffect(() => {
    fetchUserChallenge();
  }, [fetchUserChallenge]);

  return (
    <div className="schedule-container">
      {challenge !== null && <div className={`week${challenge}`}></div>}
    </div>
  );
}

export default Schedule;
