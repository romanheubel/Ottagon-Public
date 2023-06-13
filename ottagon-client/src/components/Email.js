// IMPORTS
import React from 'react';
import useEmailsContext from '../hooks/useEmailsContext';
import DOMPurify from 'dompurify';

// SINGLE EMAIL IN LIST COMPONENT
/* This component receives the following props from its parent (EmailList.js):
 * - email: the email object to be displayed
 * - handleEmailClick: the function to be called when the email is clicked
 */

function Email({ email, handleEmailClick }) {
  const { selectedEmail } = useEmailsContext();
  //CHATGPT was consulted to create the preview text functionality
  const previewText = email.content.substring(0, 140) + '...';
  const cleanPreviewText = DOMPurify.sanitize(previewText, {
    USE_PROFILES: { html: false },
  });

  return (
    <div
      className={`email${selectedEmail === email ? ' active' : ''}`}
      onClick={handleEmailClick}
    >
      <div className="sender">{email.senderName}</div>
      <div className="time">{email.timestamp}</div>
      <div className="subject">{email.subject}</div>
      <div className="preview">{cleanPreviewText}</div>
    </div>
  );
}

export default Email;
