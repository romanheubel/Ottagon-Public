// IMPORTS
import React from 'react';
import useEmailsContext from '../hooks/useEmailsContext';

// COMPONENT TO DISPLAY A SINGLE FOLDER IN THE LIST
/* This component receives the following props from its parent (FolderList.js):
 * - folder: the name of the folder to be displayed
 */
function Folder({ folder }) {
  const {
    selectedFolder,
    setSelectedFolder,
    setSelectedEmail,
    setFoldersUpdated,
    setShowFeedback,
  } = useEmailsContext();

  function handleFolderClick() {
    setSelectedFolder(folder);
    setFoldersUpdated(true);
    setSelectedEmail(null);
    setShowFeedback(false);
  }

  const foldername = folder.toString().toLowerCase();

  return (
    <>
      <li
        className={`folder${selectedFolder === folder ? ' active' : ''}`}
        onClick={handleFolderClick}
      >
        <img src={`icons/ico-folder-${foldername}.svg`} alt="folder-icon" />
        <div className="folder-name">{folder}</div>
      </li>
    </>
  );
}

export default Folder;
