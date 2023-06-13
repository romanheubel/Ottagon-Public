// IMPORTS
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../Signup.css';
import Lottie from 'lottie-react';
import checkmarkAnimation from './animations/checkmark.json';

// COMPONENT THAT DISPLAYS THE SIGNUP FORM
// It uses the react-hook-form library to handle form validation
// It uses the axios library to make the POST request to the backend
// It uses the lottie-react library to display the checkmark animation
export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signUpDisabled = false;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        // This is the URL of the backend API + the route to the signup endpoint
        'http://localhost:3001/users/create',
        data
      );
      console.log(response.data);
      setSuccess(true);
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      console.log(errors);
      setErrorMessage(error.response.data);
      setSubmitting(false);
    }
  };

  return signUpDisabled ? (
    <div className="signup-page">
      <div className="logo">
        <img src="/img/img-ottagon-logo.svg" alt="" />
      </div>
      <div className="signup-form-container">
        <p>The registration period for this test has ended. </p>
      </div>
    </div>
  ) : (
    <div className="signup-page">
      <div className="logo">
        <img src="/img/img-ottagon-logo.svg" alt="" />
      </div>
      <div className="signup-form-container">
        {success ? (
          <div className="success-message">
            <Lottie
              animationData={checkmarkAnimation}
              loop={false}
              playSegments={[0, 119]}
            />
            Awesome! <br /> Please check your email. <br /> You can close this
            browser tab.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="half-width"
              type="text"
              placeholder="First name"
              required
              {...register('firstname', { required: true, maxLength: 80 })}
            />
            <input
              className="half-width"
              type="text"
              placeholder="Last name"
              required
              {...register('lastname', { required: true, maxLength: 100 })}
            />
            <input
              className="full-width"
              type="text"
              placeholder="Email"
              required
              {...register('email', {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
            />
            <input
              className="half-width"
              type="number"
              placeholder="Age"
              required
              {...register('age', { required: true, max: 120, min: 18 })}
            />
            <select
              className="half-width"
              placeholder="Gender"
              required
              {...register('gender', { required: true })}
            >
              <option value="" disabled selected>
                {' '}
                Gender{' '}
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            <h3>Do you have a background in IT?</h3>
            <p>
              You for example studied computer science or work in an IT related
              field.{' '}
            </p>
            <span>Yes</span>
            <input
              {...register('itexperience', {
                required: true,
              })}
              type="radio"
              value="true"
              required
            />
            <span>No</span>
            <input
              {...register('itexperience', {
                required: true,
              })}
              type="radio"
              value="false"
            />
            <br />
            <input
              type="checkbox"
              name="acceptTerms"
              required
              {...register('terms', { required: true })}
            />
            I agree to the following terms:
            <label htmlFor="acceptTerms" className="form-check-label">
              The data I put in this form will be stored in my account
              information and is linked to the answers I provide on the
              platform. I agree to my anonymized answers on the Ottagon platform
              being used for research purposes and future publications. This
              research might be published in multiple different ways after the
              thesis submission. My name and personal information will not be
              disclosed in any way. My responses will be used for the thesis and
              research publications in anonymized and/or aggregated form only.
            </label>
            <br />
            <br />
            <input className="button" type="submit" disabled={submitting} />
          </form>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}
