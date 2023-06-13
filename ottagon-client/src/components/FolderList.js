// IMPORTS
import React from 'react';
import Logo from './Logo';
import Folder from './Folder.js';
import Profile from './Profile.js';
import useEmailsContext from '../hooks/useEmailsContext';

// COMPONENT TO DISPLAY THE FOLDER LIST
// This component uses the custom hook useEmailsContext to access the selected folder and the list of folders as well as the setSelectedFolder function
/* This component receives the following props from its parent (App.js):
 * - setShowSchedule: the function to be called when the schedule button is clicked
 * - calendarIndicator: a boolean to indicate whether the schedule button should be displayed or not
 */
function FolderList({ setShowSchedule, calendarIndicator }) {
  const { selectedFolder, setSelectedFolder, folders } = useEmailsContext();

  return (
    <div className="folder-list-column">
      <Logo />
      <div className="folder-list">
        {folders.map((folder) => (
          <Folder
            key={folder}
            folder={folder}
            setSelectedFolder={setSelectedFolder}
            selectedFolder={selectedFolder}
          />
        ))}
      </div>
      <Profile
        calendarIndicator={calendarIndicator}
        setShowSchedule={setShowSchedule}
      />
    </div>
  );
}

export default FolderList;
