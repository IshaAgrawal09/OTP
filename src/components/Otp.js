/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Otp = ({ otpDigits, otpTime }) => {
  const [verifyOtp, setVerifyOtp] = useState();
  const [attempt, setAttempt] = useState(4);
  const [current, setCurrent] = useState([]);
  const [validOtp, setValidOtp] = useState(null);
  const [otpFilled, setOtpFilled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [sec, setSec] = useState(otpTime % 60);
  const [min, setMin] = useState(Math.floor(otpTime / 60));

  const inputRef = useRef();
  const navigate = useNavigate();

  // NEW OTP
  const verify = () => {
    let temp = "";
    Array(otpDigits)
      .fill(0)
      .forEach(() => {
        temp += Math.floor(Math.random() * 10);
      });
    setVerifyOtp(temp);
    setActiveIndex(0);
  };

  // SET TIMER
  const Timing = () => {
    if (sec > 0) {
      setSec(sec - 1);
    } else if (sec === 0 && min > 0) {
      setSec(59);
      if (min > 0) {
        setMin(min - 1);
      }
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(Timing, 1000);
    if (sec === 0 && min === 0) {
      clearTimeout(timeOut);
    }
  }, [sec]);

  useEffect(() => {
    verify();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeIndex]);

  // RESEND BTN
  const resend = () => {
    setAttempt(attempt - 1);
    if (attempt > 0) {
      verify();
      setSec(otpTime % 60);
      setMin(Math.floor(otpTime / 60));
      const timeOut = setTimeout(Timing, 1000);

      if (sec === 0 && min === 0) {
        clearTimeout(timeOut);
      }
    }
  };

  // OTP IS VERIFIED OR NOT
  const validOtpFunc = (otpArr) => {
    let otpFilledBool = false;
    otpFilledBool = otpArr.every((item) => {
      return item !== "";
    });

    if (otpArr.length === otpDigits && otpFilledBool) {
      let text = otpArr.join("");
      if (verifyOtp === text) {
        if (min === 0 && sec === 0) setError("Your time limit exceeds!");
        else {
          setValidOtp(true);
          setError("");
        }
      } else {
        setValidOtp(false);
        setError("");
      }
    }
    setOtpFilled(otpFilledBool);
  };

  const pasteOtp = (val) => {
    const tempArr = val.split("");
    setCurrent([...tempArr]);
    validOtpFunc(tempArr);
  };

  // ONCHANGE FUNC
  const otpVal = (event, index) => {
    let digitVal = event.currentTarget.value;
    // if (/^[0-9]+$/.test(digitVal)) {
      console.log("&&&&");
      if (digitVal.length === otpDigits) {
        pasteOtp(digitVal);
        return;
      } else if (digitVal.length > otpDigits) return;

      var tempArr = [...current];

      tempArr[index] = digitVal.substring(digitVal.length - 1);
      setCurrent([...tempArr]);

      // FORWARD & BACKWARD FUNC
      if (digitVal) {
        setActiveIndex(index + 1);
      } else {
        setActiveIndex(index - 1);
      }
      validOtpFunc(tempArr);
    // }
  };

  const backward = (event, index) => {
    if (event.key === "backspace") setActiveIndex(index - 1);
  };

  return (
    <div className="otpLayout">
      <p id="error">{error}</p>
      <h2>
        Verify Email Address <span>({verifyOtp})</span>
      </h2>
      <hr />

      <h3>Enter {otpDigits} digits verification code</h3>

      {Array(otpDigits)
        .fill(0)
        .map((item, index) => {
          return (
            <input
              key={index}
              ref={index === activeIndex ? inputRef : null}
              id={index}
              type="number"
              className={
                current.length === otpDigits && otpFilled
                  ? validOtp
                    ? "valid"
                    : "invalid"
                  : null
              }
              onKeyDown={(event) => backward(event, index)}
              onChange={(event) => otpVal(event, index)}
              value={current[index]}
            ></input>
          );
        })}
      <section>
        <div>
          <button
            className="resend-btn"
            onClick={resend}
            disabled={min !== 0 || sec !== 0 || attempt === 0}
          >
            Resend One-time Passcode
          </button>
          <span>({attempt} attempts left)</span>
        </div>
        <div className="time">
          {min < 10 ? "0" + min : min}:{sec < 10 ? "0" + sec : sec}
        </div>
      </section>
    </div>
  );
};
export default Otp;
