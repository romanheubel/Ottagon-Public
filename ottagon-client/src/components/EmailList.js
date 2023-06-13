// IMPORTS
import React from 'react';
import useEmailsContext from '../hooks/useEmailsContext';
import Email from './Email';

// COMPONENT THAT RENDERS THE LIST OF EMAILS
/* This component receives the following props from its parent (App.js):
 * - selectedFolder: the name of the currently selected folder
 * - setSelectedEmail: the function to be called when an email is clicked
 */
function EmailList({ selectedFolder, setSelectedEmail }) {
  const { emails, setShowFeedback } = useEmailsContext();

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setShowFeedback(false);
  };

  const selectedFolderName = selectedFolder.toString().toLowerCase();

  //CHECK IF FOLDER IS EMPTY
  if (emails.length === 0) {
    return (
      <div className="email-list-column">
        <div className="email-list-header">
          <img
            src={`icons/ico-folder-${selectedFolderName}.svg`}
            alt="folder-icon"
          />
          <div className="folder-name">{selectedFolder}</div>
        </div>
        <div className="email-list">
          <div className="empty-folder"></div>
          <div className="empty-folder-text">
            Nothing to see here! <br />
          </div>
        </div>
      </div>
    );
  }

  const renderedEmails = emails.map((email) => {
    return (
      <Email
        key={email.id}
        email={email}
        handleEmailClick={() => handleEmailClick(email)}
      />
    );
  });

  return (
    <div className="email-list-column">
      <div className="email-list-header">
        <img
          src={`icons/ico-folder-${selectedFolderName}.svg`}
          alt="folder-icon"
        />
        <div className="folder-name">{selectedFolder}</div>
      </div>
      <div className="email-list">{renderedEmails}</div>
    </div>
  );
}

export default EmailList;
