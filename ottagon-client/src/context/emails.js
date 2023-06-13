// IMPORTS
import { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// This created the context which can then be consumed by other components using the useContext hook
const EmailsContext = createContext();

function Provider({ children }) {
  const [selectedFolder, setSelectedFolder] = useState('Inbox');
  const [foldersUpdated, setFoldersUpdated] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    feedback: '',
    nextChallenge: false,
  });
  const [emails, setEmails] = useState([]);
  const folders = ['Inbox', 'Trusted', 'Spam'];
  const params = useParams();
  const navigate = useNavigate();

  const authHeader = params.hash;

  axios.defaults.headers.common['Authorization'] = `Bearer ${authHeader}`;

  // Main function that fetches the emails of the selected folder from the backend API
  const fetchEmails = useCallback(
    async (folder) => {
      try {
        await axios
          // This is the URL of the backend API + the route to the folder endpoint
          .get(
            `https://future-api.ottagon.com/emails/folder/${folder.toLowerCase()}`
          )
          .then((response) => {
            setEmails(response.data);
            setFoldersUpdated(false);
          });
      } catch (error) {
        navigate('/signup');
      }
    },
    [navigate]
  );
  // Function that handles email judgements
  const judgeEmail = useCallback(
    async (emailID, isPhish) => {
      try {
        await axios
          // This is the URL of the backend API + the route to the judge endpoint
          .post(`https://future-api.ottagon.com/emails/judge`, {
            emailID,
            isPhish,
          })
          .then((response) => {
            console.log(response.data);
            setResult(response.data);
            setFoldersUpdated(true);
          });
      } catch (error) {
        console.log(error);
      }
    },
    [setResult]
  );

  // This object defines all the values that can be accessed from components consuming the context
  const valueToShare = {
    emails,
    fetchEmails,
    selectedFolder,
    setSelectedFolder,
    foldersUpdated,
    setFoldersUpdated,
    folders,
    selectedEmail,
    setSelectedEmail,
    judgeEmail,
    showFeedback,
    setShowFeedback,
    result,
  };

  return (
    <EmailsContext.Provider value={valueToShare}>
      {children}
    </EmailsContext.Provider>
  );
}

export { Provider };
export default EmailsContext;
