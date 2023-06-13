// IMPORTS
import React from 'react';
import DOMPurify from 'dompurify';
import Judge from './Judge';

// COMPONENT THAT DISPLAY EMAIL CONTENTS
/* This component receives the following props from its parent (App.js):
 * - selectedEmail: the email object to be displayed
 * - selectedFolder: the name of the currently selected folder
 */
function EmailViewer({ selectedEmail, selectedFolder }) {
  if (selectedEmail === null) {
    return <div className="email-viewer-column otis"></div>;
  }
  const { senderName, senderEmail, timestamp, subject, content } =
    selectedEmail;

  //CHATGPT
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['br', 'a', 'strong', 'b', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'width'],
  });

  return (
    <div className="email-viewer-column">
      <div className="email-viewer-column-header">
        <div className="email-viewer-column-header-left">
          <div className="sender">{senderName}</div>
          <br />
          <div className="sender-email">&lt;{senderEmail}&gt;</div>
          <br />
          <div className="time">{timestamp}</div>
          <div className="subject">{subject}</div>
        </div>
        <div className="email-viewer-column-header-right">
          {selectedFolder === 'Inbox' ? <Judge /> : null}
        </div>
      </div>
      <div className="email-wrapper">
        <div className="divider"></div>
        <div className="content"></div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </div>
    </div>
  );
}

export default EmailViewer;
