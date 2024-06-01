import { Button, Code, Stack, TextInput } from "@mantine/core"
import Clock from "./Clock"
import { useEffect, useRef, useState } from "react";
import { useInterval } from "@mantine/hooks";
import StopwatchSettings from "./StopwatchSettings";
import { SESSION_COUNT_BASE, SESSION_HOURLY_NOTIFICATION_BASE, SESSION_PROJECT_NAME_BASE, toTimeString } from "../utils/utils";

const Stopwatch = ({defaultName, id}) => {

  const [seconds, setSeconds] = useState(0)
  const [projectName, setProjectName] = useState(defaultName)
  const inputRef = useRef(null)
  const [hourlyNotification, setHourlyNotification] = useState(false);
  const addIdTo = (label) => label + '_' + id
  const SESSION_COUNT = addIdTo(SESSION_COUNT_BASE)
  const SESSION_HOURLY_NOTIFICATION = addIdTo(SESSION_HOURLY_NOTIFICATION_BASE)
  const SESSION_PROJECT_NAME = addIdTo(SESSION_PROJECT_NAME_BASE)

  useEffect(() => {
    const sName = window.sessionStorage.getItem(SESSION_PROJECT_NAME)
    const sCount = window.sessionStorage.getItem(SESSION_COUNT_BASE)
    const sHourlyNotification = window.sessionStorage.getItem(SESSION_HOURLY_NOTIFICATION) === 'true'
    sName && setProjectName(sName)
    sCount && setSeconds(Number.parseInt(sCount))
    sHourlyNotification && setHourlyNotification(sHourlyNotification)
  }, [SESSION_HOURLY_NOTIFICATION, SESSION_PROJECT_NAME])
  
  useEffect(() => {
    document.title = `${projectName} - ${interval.active ? '🏃' : '✋'} | ${toTimeString(seconds)}`
    window.sessionStorage.setItem(SESSION_COUNT, seconds)
    if (!hourlyNotification) return
    const residual = seconds % 3600
    if ( residual === 0 && seconds > 0) {
      const hours  = ~~(seconds / 3600)
      // console.log('hour elapsed:', hours)
      const voiceMsg = `${hours} ${hours > 1 ? 'hours' : 'hour'} elapsed on task ${projectName}`
      // console.log(voiceMsg)
      const utterance = new SpeechSynthesisUtterance(voiceMsg)
      const voices = speechSynthesis.getVoices()
      utterance.voice = voices[0]
      speechSynthesis.speak(utterance)
    }
  })

  const handleIntervalTick = () => {
    setSeconds((s) => s + 1)
  }

  const handleStartBtnClick = () => {
    const newCountingState = !interval.active
    document.documentElement.style.setProperty('--logo-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    document.documentElement.style.setProperty('--hands-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    interval.toggle()
  }

  const handleProjectNameChange = (e) => {
    const value = e.currentTarget.value
    setProjectName(value)
    window.sessionStorage.setItem(SESSION_PROJECT_NAME, value)
  }

  const interval = useInterval(handleIntervalTick, 1000)

  return (
    <Stack align="center" style={{position:'absolute', top: 0, left: '25%'}}>
      <TextInput
        radius="lg"
        size="xl"
        styles={{ input: { textAlign: 'center', color: 'gray' }, root: { textAlign: 'center', marginTop: 20 }, label: { color: 'gray' } }}
        disabled={interval.active}
        onChange={handleProjectNameChange}
        value={projectName}
      />
      <Clock counter={seconds} />
      <Code c="darkgray">
        <h1
          style={{ fontSize: "33px", fontWeight: "bolder", lineHeight: "0.2" }}
        >
          {toTimeString(seconds)}
        </h1>
      </Code>
      <Button
        variant="filled"
        color={interval.active ? "red" : "teal"}
        radius="lg"
        size="compact-lg"
        onClick={handleStartBtnClick}
      >
        {interval.active ? "Stop" : "Start"}
      </Button>
      <StopwatchSettings 
        inputRef={inputRef} 
        seconds={seconds} 
        setSeconds={setSeconds}
        interval={interval}
        hourlyNotification={hourlyNotification}
        setHourlyNotification={setHourlyNotification}
      />
    </Stack>
  );
};

export default Stopwatch;
