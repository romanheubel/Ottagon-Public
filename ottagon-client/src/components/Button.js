// IMPORTS
import React from 'react';

// DEFAULT BUTTON COMPONENT
/* The button receives the following props:
 * - text: the text to be displayed on the button
 * - onClick: the function to be called when the button is clicked
 * - disabled: a boolean indicating whether the button should be disabled or not
 */
function Button({ text, onClick, disabled }) {
  const iconName = text.toLowerCase();
  return (
    <div className={`button ${disabled ? 'disabled' : ''}`} onClick={onClick}>
      <img src={`icons/ico-button-${iconName}.svg`} alt="button-icon" />
      <span>{text}</span>
    </div>
  );
}

export default Button;
