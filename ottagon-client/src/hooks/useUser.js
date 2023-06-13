// IMPORTS
import { useCallback, useState } from 'react';
import axios from 'axios';

// CUSTOM HOOK TO ACCESS THE USER'S POINTS AND CHALLENGE
function useUser() {
  const [points, setPoints] = useState(0);
  const [challenge, setChallenge] = useState(0);
  // Function that fetches the user's current points
  const fetchUserPoints = useCallback(async () => {
    try {
      await axios
        .get(`https://future-api.ottagon.com/users/points`)
        .then((response) => {
          setPoints(response.data.points);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  // Function that fetches the user's current challenge
  const fetchUserChallenge = useCallback(async () => {
    try {
      await axios
        // This is the URL of the backend API + the route to the challenge endpoint
        .get(`https:/future-api.ottagon.com/users/challenge`)
        .then((response) => {
          setChallenge(response.data.challenge);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  // This return statement defines all the values that can be accessed from components consuming the hook
  return {
    points,
    challenge,
    fetchUserPoints,
    fetchUserChallenge,
  };
}

export default useUser;
