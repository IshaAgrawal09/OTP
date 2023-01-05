/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./otp.css";
import { useNavigate } from "react-router-dom";

// USED OBJECT IN THIS ...
const OtpLayout = ({ otpDigits, otpTime }) => {
  const [verifyOtp, setVerifyOtp] = useState();
  const [attempt, setAttempt] = useState(4);
  const [current, setCurrent] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [validOtp, setValidOtp] = useState(null);
  const [error, setError] = useState(null);

  const [sec, setSec] = useState(otpTime % 60);
  const [min, setMin] = useState(Math.floor(otpTime / 60));

  const inputRef = useRef();
  const timer = useRef();
  const Navigate = useNavigate();

  // NEW OTP
  const verify = () => {
    let temp = "";
    Array(otpDigits)
      .fill(0)
      .forEach(() => {
        temp += Math.floor(Math.random() * 10);
      });
    setVerifyOtp(temp);
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

  //   RESEND FUNC
  const resend = () => {
    setCurrent({});
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
  const validOtpFunc = (otpObj) => {
    clearTimeout(timer.current);
    if (Object.keys(otpObj).length === otpDigits) {
      timer.current = setTimeout(() => {
        let otpArr = Object.values(otpObj);
        let text = otpArr.join("");
        if (verifyOtp === text) {
          setValidOtp(true);
          Navigate("/dashboard");
        } else {
          setValidOtp(false);
          setActiveIndex(0);
          setError(true);
          setCurrent({});
        }
      }, 400);
    }
  };

  //   PASTE OTP FUNC
  const pasteOtp = (val) => {
    let tempArr = val.split("");
    if (tempArr.length > otpDigits) {
      tempArr.shift();
    }
    const obj = Object.assign({}, tempArr);
    setCurrent({ ...obj });
    validOtpFunc(obj);
  };

  //   ONCHANGE FUNC
  const otpVal = (event, index) => {
    setError(null);
    let digitVal = event.target.value;
    if (digitVal.length === otpDigits && current[index]?.length === undefined) {
      pasteOtp(digitVal);
      return;
    } else if (
      digitVal.length === otpDigits + 1 &&
      current[index]?.length !== undefined
    ) {
      pasteOtp(digitVal);
      return;
    }
    var temp = { ...current };
    if (
      digitVal.length <= 2 &&
      event.nativeEvent.inputType !== "insertFromPaste"
    ) {
      temp[index] = digitVal.substring(digitVal.length - 1);
      setCurrent({ ...temp });
      setActiveIndex(index + 1); //Forward
    }
    validOtpFunc(temp);
  };

  //   BACKWARD FUNC
  const backward = (event, index) => {
    let tempObj = { ...current };
    if (event.key === "Backspace") {
      delete tempObj[index];
      setActiveIndex(index - 1);
    }
    setCurrent({ ...tempObj });
  };

  return (
    <>
      <div className="otpLayout">
        <h2>
          Verify Email Address <span>({verifyOtp})</span>
        </h2>
        <hr />

        <h3>Enter {otpDigits} digits verification code</h3>

        {Array(otpDigits)
          .fill(0)
          .map((_, index) => {
            return (
              <input
                key={index}
                ref={index === activeIndex ? inputRef : null}
                id={index}
                autoComplete="off"
                type="text"
                className={
                  Object.keys(current).length === otpDigits
                    ? validOtp && "valid"
                    : error && "invalid"
                }
                onKeyDown={(event) => backward(event, index)}
                onChange={(event) => {
                  if (/^\d+$/.test(event.target.value)) otpVal(event, index);
                }}
                value={current[index] ?? ""}
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
    </>
  );
};

export default OtpLayout;
