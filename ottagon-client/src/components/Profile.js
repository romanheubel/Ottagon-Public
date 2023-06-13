// IMPORTS
import React from 'react';
import Button from './Button';

// COMPONENT THAT DISPLAYS JUDY'S PROFILE AND SCHEDULE BUTTON
/* This component receives the following props from its parent (FolderList.js):
 * - setShowSchedule: the function to be called when the schedule button is clicked
 * - calendarIndicator: a boolean that indicates whether the schedule button should be displayed
 */
function Profile({ setShowSchedule, calendarIndicator }) {
  const handleScheduleClick = () => {
    console.log('Schedule button clicked');
    setShowSchedule(true);
  };

  return (
    <div className="profile-container">
      <img
        className="avatar"
        width="255px"
        src="/img/img-profile.webp"
        alt="Judy's meeting schedule for the current week"
      ></img>
      {calendarIndicator ? (
        <Button text={'Schedule'} onClick={handleScheduleClick} />
      ) : null}
    </div>
  );
}

export default Profile;
