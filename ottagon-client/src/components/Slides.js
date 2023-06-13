// IMPORTS
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import Button from './Button';
import '../Slides.css';
import slidesets from '../slidesets';

// COMPONENT THAT DISPLAYS THE SLIDE SETS FOR TRAINING AND INTRUCTIONS
/* This component receives the following props from its parent (App.js):
 * - set: the name of the set to be displayed
 * - startSlide: the index of the slide to start with
 * - handleSlidesClose: the function to be called when the slides are closed
 */
//CHATGPT was consulted on how to structure the slides component
function Slides({ set, startSlide, handleSlidesClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  let slides = slidesets[set];

  useEffect(() => {
    setCurrentSlide(startSlide);
  }, [startSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleSlidesClose(set);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <>
      <div className="slides-header">
        <Logo />
      </div>
      <div className="slides">
        <div className="slides-left">
          <div className="slides-container">
            <div className="slides-card">
              <h2
                dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: slides[currentSlide].content,
                }}
              />
            </div>
          </div>
          <div className="slides-navigation">
            <Button
              text={'Back'}
              onClick={handlePrevious}
              disabled={currentSlide === 0}
            />
            <Button
              text={'Next'}
              disabled={currentSlide === slides.length - 1 && set === 'end'}
              onClick={handleNext}
            />
          </div>
        </div>
        {slides[currentSlide].hasImage ? (
          <div
            className="slides-right"
            style={{
              backgroundImage: `url(img/slides/img-${set}-${currentSlide}.webp)`,
            }}
          ></div>
        ) : null}
      </div>
    </>
  );
}

export default Slides;
