import { useContext } from 'react';
import EmailsContext from '../context/emails';

/* This custom hook avoids code repetition because the context can be used by simply calling this hook from other components */
function useEmailsContext() {
  return useContext(EmailsContext);
}

export default useEmailsContext;
