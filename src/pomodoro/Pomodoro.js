import React, { useEffect, useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import Break from "./Break";
import Focus from "./Focus";
import TimeLeft from "./TimeLeft";
import { minutesToDuration, secondsToDuration } from "../utils/duration";

function Pomodoro() {
  const [currentSessionType, setCurrentSessionType] = useState("Focus");
  const [currentState, setCurrentState] = useState("Focusing");
  const [focusLength, setFocusLength] = useState(1500);
  const [breakLength, setBreakLength] = useState(300);
  const [timeLeft, setTimeLeft] = useState(focusLength);
  const [duration, setDuration] = useState(focusLength);
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState("");
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [disabled, setDisabled] = useState(true)

  //Focus Length Decrementation / Incrementation

  const decrementFocusLengthByOne = () => {
    const newFocusLength = focusLength - 300;
    if (newFocusLength < 300) {
      setFocusLength(300);
    } else {
      setFocusLength(newFocusLength);
    }
  };

  const incrementFocusLengthByOne = () => {
    const newFocusLength = focusLength + 300;
    if (newFocusLength > 3600) {
      setFocusLength(3600);
    } else {
      setFocusLength(newFocusLength);
    }
  };

  // Break Length Decrementation / Incrementation

  const decrementBreakLengthByOne = () => {
    const newBreakLength = breakLength - 60;
    if (newBreakLength < 60) {
      setBreakLength(60);
    } else {
      setBreakLength(newBreakLength);
    }
  };

  const incrementBreakLengthByOne = () => {
    setBreakLength(breakLength + 60);
  };

  // TimeLeft

  useEffect(() => {
    setTimeLeft(focusLength);
  }, [focusLength]);

  useEffect(() => {
    setDuration(focusLength);
  }, [focusLength]);

  // Break Length Formatization

  let formattedBreakLength = secondsToDuration(breakLength);

  // Focus Length formatization

  let formattedFocusLength = minutesToDuration(focusLength / 60);

  //TimeLeft formatization

  let formattedTimeLeftInSeconds = secondsToDuration(timeLeft);

  const formattedDurationInMinutes = minutesToDuration(duration / 60);

  // Interval

  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running

      if (timeLeft > 0 && currentSessionType === "Focus") {
        setTimeLeft(timeLeft - 1);
        setProgress(progress + 100 / focusLength);
      } else if (timeLeft > 0 && currentSessionType === "Break") {
        setTimeLeft(timeLeft - 1);
        setProgress(progress + 100 / breakLength);
      } else if (currentSessionType === "Focus") {
        new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
        setProgress(0);
        setCurrentSessionType("Break");
        setCurrentState("On Break");
        setTimeLeft(breakLength);
        setDuration(breakLength);

        //setTimeLeft to breakTimeLength
      } else if (timeLeft === 0 && currentSessionType === "Break") {
        //Switch back to focusTime
        new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
        setProgress(0);
        setCurrentSessionType("Focus");
        setCurrentState("Focusing");
        setTimeLeft(focusLength);
        setDuration(focusLength);
      }
    },
    isTimerRunning ? 1000 : null
  );

  // Pause Button

  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    setDisabled(false)
    if (!isTimerRunning) {
      setIsPaused("");
      setHidden(true);
    } else {
      setIsPaused("Paused");
    }
  }

  // Stop Button
  const handleStopButton = () => {
    //clear the timeout interval
    setDisabled(true)
    setTimeLeft(focusLength);
    setIsTimerRunning(false);
    setHidden(false);
    setProgress(0);
    setCurrentSessionType("Focus");
    setCurrentState("Focus");
    // set the interval null
    // set the sessiontype to 'Session'
  };
  
  //Play Audio

  return (
    <div className="pomodoro">
      <div className="row">
        <Focus
          formattedFocusLength={formattedFocusLength}
          decrementFocusLengthByOneMinute={decrementFocusLengthByOne}
          incrementFocusLengthByOne={incrementFocusLengthByOne}
        />
        <Break
          formattedBreakLength={formattedBreakLength}
          decrementBreakLengthByOne={decrementBreakLengthByOne}
          incrementBreakLengthByOne={incrementBreakLengthByOne}
        />
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause} 
              
              >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={!disabled&&handleStopButton}
              disabled={disabled}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <TimeLeft
        currentState={currentState}
        formattedFocusLength={formattedFocusLength}
        formattedDurationInMinutes={formattedDurationInMinutes}
        formattedTimeLeftInSeconds={formattedTimeLeftInSeconds}
        isPaused={isPaused}
        hidden={hidden}
        progress={progress}
      />
    </div>
  );
}

export default Pomodoro;

