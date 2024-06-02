import {
  ActionIcon,
  Code,
  Flex,
  Popover,
  Stack,
  TextInput,
} from "@mantine/core";
import Clock from "./Clock";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "@mantine/hooks";
import StopwatchSettings from "./StopwatchSettings";
import {
  SESSION_COUNT_BASE,
  SESSION_HOURLY_NOTIFICATION_BASE,
  SESSION_PROJECT_NAME_BASE,
  toTimeString,
} from "../utils/utils";
import { FaCreativeCommonsZero, FaPlay, FaStop } from "react-icons/fa6";
import { IoEye, IoEyeOff, IoSettingsSharp } from "react-icons/io5";
import Emitter from "../utils/Emitter";

const Stopwatch = ({ defaultName, id, parentId, clockVisible=true }) => {
  const [seconds, setSeconds] = useState(0);
  const [projectName, setProjectName] = useState(defaultName);
  const inputRef = useRef(null);
  const [hourlyNotification, setHourlyNotification] = useState(false);
  const [isClockVisible, setIsClockVisible] = useState(clockVisible)

  const addIdTo = (label) => label + "_" + id;
  const SESSION_PROJECT_NAME = addIdTo(SESSION_PROJECT_NAME_BASE);
  const SESSION_COUNT = addIdTo(SESSION_COUNT_BASE);
  const SESSION_HOURLY_NOTIFICATION = addIdTo(SESSION_HOURLY_NOTIFICATION_BASE);
  
  const handleIntervalTick = () => {
    setSeconds((s) => s + 1);
  };
  
  const interval = useInterval(handleIntervalTick, 1000);

  useEffect(() => {
    const sName = window.sessionStorage.getItem(SESSION_PROJECT_NAME);
    const sCount = window.sessionStorage.getItem(SESSION_COUNT);
    const sHourlyNotification = window.sessionStorage.getItem(SESSION_HOURLY_NOTIFICATION) === "true";
    sName && setProjectName(sName);
    sCount && setSeconds(Number.parseInt(sCount));
    sHourlyNotification && setHourlyNotification(sHourlyNotification);
  }, [SESSION_HOURLY_NOTIFICATION, SESSION_PROJECT_NAME, SESSION_COUNT]);

useEffect(() => {
  const onStartCounter = (eventData) => {
    // console.log(id, 'received', eventData)
    // Stop the clock for running projects
    if (eventData.willBeActive && eventData.id !== id && eventData.parentId !== id) {
      interval.stop()
    }
    // Start the clock for the parent
    if (eventData.willBeActive && eventData.parentId === id) {
      interval.start()
    }
    // Stop the clock for the children
    if (!eventData.willBeActive && eventData.id === parentId) {
      interval.stop()
    }
  }
  const listener = Emitter.addListener('StartCounter', onStartCounter)

  return () => listener.remove()
  }, [id, interval, parentId])

  useEffect(() => {
    if (!parentId)
      document.title = `${projectName} - ${interval.active ? "🏃" : "✋"} | ${toTimeString(seconds)}`;
    window.sessionStorage.setItem(SESSION_COUNT, seconds);

    if (!hourlyNotification) return;
    const residual = seconds % 3600;
    if (residual === 0 && seconds > 0) {
      const hours = ~~(seconds / 3600);
      const voiceMsg = `${hours} ${hours > 1 ? "hours" : "hour"} elapsed on project ${projectName}`;
      const utterance = new SpeechSynthesisUtterance(voiceMsg);
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[0];
      speechSynthesis.speak(utterance);
    }
  });

  const handleStartBtnClick = () => {
    const willBeActive = !interval.active;
    document.documentElement.style.setProperty("--logo-animation-state", `${willBeActive ? "running" : "paused"}`);

    // Send start/stop event to other stopwatches
    const payload = {willBeActive, id, parentId, created_at: Date()}
    // console.log('sent', payload)
    Emitter.emit('StartCounter', payload)

    interval.toggle();
  }
  
  const handleProjectNameChange = (e) => {
    const value = e.currentTarget.value;
    setProjectName(value);
    window.sessionStorage.setItem(SESSION_PROJECT_NAME, value);
  }

  const handleResetBtnClick = () => {
    setSeconds(0);
  };

  const handleEyeBtnClick = () => {
    setIsClockVisible(!isClockVisible)
  }

  return (
    <Stack align="center">
      <TextInput
        radius="lg"
        size="sm"
        styles={{
          input: { textAlign: "center", color: "gray" },
          root: { textAlign: "center", marginTop: 20 },
          label: { color: "gray" },
        }}
        disabled={interval.active}
        onChange={handleProjectNameChange}
        value={projectName}
      />
      <Stack align="center" gap='xs' >
        {isClockVisible
          ? <Clock counter={seconds} />
          : null
        }
        <Code c="darkgray">
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "bolder",
              lineHeight: "0.2",
            }}
          >
            {toTimeString(seconds)}
          </h1>
        </Code>
        <Flex direction="row">
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Start/Stop"
            onClick={handleStartBtnClick}
          >
            {interval.active ? (
              <FaStop style={{ width: "70%", height: "70%" }} />
            ) : (
              <FaPlay style={{ width: "70%", height: "70%" }} />
            )}
          </ActionIcon>
          <Popover
            width={300}
            trapFocus
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <ActionIcon
                  variant="light"
                  radius="lg"
                  size="xl"
                  aria-label="Clock On/Off"
              >
                <IoSettingsSharp style={{ width: "70%", height: "70%" }} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <StopwatchSettings
                inputRef={inputRef}
                seconds={seconds}
                setSeconds={setSeconds}
                interval={interval}
                hourlyNotificationSessionId={SESSION_HOURLY_NOTIFICATION}
                hourlyNotification={hourlyNotification}
                setHourlyNotification={setHourlyNotification}
              />
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Reset"
            onClick={handleResetBtnClick}
          >
            <FaCreativeCommonsZero style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Clock On/Off"
            onClick={handleEyeBtnClick}
          >
            {isClockVisible ? (
              <IoEyeOff style={{ width: "70%", height: "70%" }} />
            ) : (
              <IoEye style={{ width: "70%", height: "70%" }} />
            )}
          </ActionIcon>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default Stopwatch;
