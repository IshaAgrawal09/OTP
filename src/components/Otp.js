/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";

// USED ARRAY IN THIS...
const Otp = ({ otpDigits, otpTime }) => {
  const [verifyOtp, setVerifyOtp] = useState();
  const [attempt, setAttempt] = useState(4);
  const [current, setCurrent] = useState([]);
  const [validOtp, setValidOtp] = useState(null);
  const [otpFilled, setOtpFilled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [sec, setSec] = useState(otpTime % 60);
  const [min, setMin] = useState(Math.floor(otpTime / 60));

  const inputRef = useRef(null);

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

  // RESEND BTN
  const resend = () => {
    setCurrent([]);
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
        setValidOtp(true);
      } else {
        setValidOtp(false);
      }
    }
    setOtpFilled(otpFilledBool);
  };

  const pasteOtp = (val) => {
    let tempArr = val.split("");
    if (tempArr.length > otpDigits) {
      tempArr.shift();
    }
    console.log(tempArr, "After");
    setCurrent([...tempArr]);
    validOtpFunc(tempArr);
  };

  // ONCHANGE FUNC
  const otpVal = (event, index) => {
    console.log(event.key, "key");
    let digitVal = event.target.value;
    console.log(digitVal);
    if (/^\d+$/.test(event.target.value) || event.currentTarget.value === "") {
      if (digitVal.length >= otpDigits) {
        pasteOtp(digitVal);
        return;
      }
      var tempArr = [...current];
      if (digitVal) {
        tempArr[index] = digitVal.substring(digitVal.length - 1);
        setCurrent([...tempArr]);
        setActiveIndex(index + 1); //Forward
      }
    }
    if (tempArr.length === otpDigits) validOtpFunc(tempArr);
  };

  const backward = (event, index) => {
    console.log("back");
    let tempArr = [...current];
    if (event.key === "Backspace") {
      setActiveIndex(index - 1);
      tempArr[index] = "";
    }
    setCurrent([...tempArr]);
  };

  const handleFocus = useCallback(() => {
    if (
      current[activeIndex + 1] === "" &&
      activeIndex + 1 < otpDigits &&
      activeIndex > -1
    ) {
      inputRef.current.select();
    }
  }, [current]);

  return (
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
              onFocus={handleFocus}
              type="text"
              className={
                current.length === otpDigits && otpFilled
                  ? validOtp
                    ? "valid"
                    : "invalid"
                  : null
              }
              onKeyDown={(event) => backward(event, index)}
              onChange={(event) => otpVal(event, index)}
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
  );
};
export default Otp;
