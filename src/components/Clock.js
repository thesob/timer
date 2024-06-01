import { useEffect, useRef, useState } from "react"
import './clock.css'
import hour_hand from "../images/hours_hand_38x173_19x156.webp"
import minute_hand from "../images/minutes_hand_38x231_18x213.webp"
import second_hand from "../images/seconds_hand_24x236_12x177.webp"
import { CloseButton } from "@mantine/core"

const Clock = ({ counter, visible = true }) => {
  const hoursRef = useRef(null)
  const minutesRef = useRef(null)
  const secondsRef = useRef(null)
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    if (!isVisible) return

    const seconds = counter % 60
    const minutes = (counter % 3600) / 60
    const hours = counter / 3600
    const secondsAngle = seconds * 6
    const minutesAngle = minutes * 6
    const hoursAngle = hours * 15

    hoursRef.current.style.webkitTransform = `rotateZ(${hoursAngle}deg)`
    minutesRef.current.style.webkitTransform = `rotateZ(${minutesAngle}deg)`
    secondsRef.current.style.webkitTransform = `rotateZ(${secondsAngle}deg)`

    hoursRef.current.style.transform = `rotateZ(${hoursAngle}deg)`
    minutesRef.current.style.transform = `rotateZ(${minutesAngle}deg)`
    secondsRef.current.style.transform = `rotateZ(${secondsAngle}deg)`
  }, [counter, isVisible]);

  const handleClick = () => {
    setIsVisible(!isVisible)
  }

  return (
      <>
      <CloseButton onClick={handleClick}/>
      {isVisible 
      ?
      (
        <div id="clock">
          <div id="hours_container" ref={hoursRef}>
            <img src={hour_hand} id="hours_img" alt="Hour hand" />
          </div>
          <div id="minutes_container" ref={minutesRef}>
            <img src={minute_hand} id="minutes_img" alt="Minute hand" />
          </div>
          <div id="seconds_container" ref={secondsRef}>
            <img src={second_hand} id="seconds_img" alt="Second hand" />
          </div>
         </div>
      ) 
      : null}
      </>
  );
};

export default Clock;
