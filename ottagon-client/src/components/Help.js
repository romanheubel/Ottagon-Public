// IMPORTS
import React from 'react';

// COMPONENT TO DISPLAY THE HELP TOOLTIP
/* This component receives the following props from its parent (App.js):
 * - setShowHelp: the function to be called when the help tooltip is clicked
 */
function Help({ setShowHelp }) {
  return (
    <div className="help-tooltip" onClick={() => setShowHelp(false)}>
      Your task is to select an email in the list of emails to your left. Then
      read through its content and hit either the "trusted" or the "spam" button
      depending on what you think.{' '}
    </div>
  );
}

export default Help;
