import {
  ActionIcon,
  Code,
  Flex,
  Group,
  Popover,
  Stack,
  TextInput,
} from "@mantine/core";
import Clock from "./Clock";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "@mantine/hooks";
import StopwatchSettings from "./StopwatchSettings";
import {
  SESSION_PROJECT_NAME_BASE,
  SESSION_COUNT_BASE,
  SESSION_HOURLY_NOTIFICATION_BASE,
  SESSION_COLOR_BASE,
  SESSION_COLOR_CLASS_BASE,
  toTimeString,
} from "../utils/utils";
import { FaCreativeCommonsZero, FaPlay, FaStop } from "react-icons/fa6";
import { IoEye, IoEyeOff, IoSettingsSharp } from "react-icons/io5";
import Emitter from "../utils/Emitter";

const Stopwatch = ({ defaultName, id, parentId, clockVisible = true}) => {
  const addIdTo = (label) => label + "_" + id;
  const SESSION_PROJECT_NAME = addIdTo(SESSION_PROJECT_NAME_BASE);
  const SESSION_COUNT = addIdTo(SESSION_COUNT_BASE);
  const SESSION_HOURLY_NOTIFICATION = addIdTo(SESSION_HOURLY_NOTIFICATION_BASE);
  const SESSION_COLOR = addIdTo(SESSION_COLOR_BASE)
  const SESSION_COLOR_CLASS = addIdTo(SESSION_COLOR_CLASS_BASE)

  const [seconds, setSeconds] = useState(0);
  const [projectName, setProjectName] = useState(defaultName);
  const [hourlyNotification, setHourlyNotification] = useState(false);
  const [isClockVisible, setIsClockVisible] = useState(clockVisible);
  const [hexVeilColor, setHexVeilColor] = useState('')
  const [colorClass, setColorClass] = useState('');
  
  useEffect(() => {
    const sName = window.sessionStorage.getItem(SESSION_PROJECT_NAME);
    const sCount = window.sessionStorage.getItem(SESSION_COUNT);
    const sHourlyNotification = window.sessionStorage.getItem(SESSION_HOURLY_NOTIFICATION) === "true";
    const sHexColor = window.sessionStorage.getItem(SESSION_COLOR);
    const sColorClass = window.sessionStorage.getItem(SESSION_COLOR_CLASS);

    sName && setProjectName(sName);
    sCount && setSeconds(Number.parseInt(sCount));
    sHourlyNotification && setHourlyNotification(sHourlyNotification);
    sHexColor && setHexVeilColor(sHexColor)
    sColorClass && setColorClass(sColorClass)
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    /** Handle second increments to update document title and count on session */
    if (!parentId)
      document.title = `${projectName} - ${interval.active ? "🏃" : "✋"} | ${toTimeString(seconds)}`;
    // console.log(id, seconds)
    window.sessionStorage.setItem(SESSION_COUNT, seconds);
    if (!hourlyNotification) return;
    const residual = seconds % 3600;
    if (residual === 0 && seconds > 0) {
      const hours = ~~(seconds / 3600);
      const voiceMsg = `${hours} ${
        hours > 1 ? "hours" : "hour"
      } elapsed on project ${projectName}`;
      const utterance = new SpeechSynthesisUtterance(voiceMsg);
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[0];
      speechSynthesis.speak(utterance);
    }
    // eslint-disable-next-line
  }, [seconds]);
  
  useEffect(() => {
    /** Handle event messaging between stopwatches */
    const onStartCounter = (eventData) => {
      // console.log(id, 'received', eventData)
      // Stop the clock for running projects
      if (
        eventData.willBeActive &&
        eventData.id !== id &&
        eventData.parentId !== id
      ) {
        interval.stop();
      }
      // Start the clock for the parent
      if (eventData.willBeActive && eventData.parentId === id) {
        interval.start();
      }
      // Stop the clock for the children
      if (!eventData.willBeActive && eventData.id === parentId) {
        interval.stop();
      }
    };
    const listener = Emitter.addListener("StartCounter", onStartCounter);
    
    return () => listener.remove();
  });
  
  const inputRef = useRef(null);

  const handleIntervalTick = () => {
    setSeconds((s) => s + 1);
  };

  const interval = useInterval(handleIntervalTick, 1000);

  const handleStartBtnClick = () => {
    const willBeActive = !interval.active;
    document.documentElement.style.setProperty(
      "--logo-animation-state",
      `${willBeActive ? "running" : "paused"}`
    );

    // Send start/stop event to other stopwatches
    const payload = { willBeActive, id, parentId, created_at: Date() };
    // console.log('sent', payload)
    Emitter.emit("StartCounter", payload);

    interval.toggle();
  };

  const handleProjectNameChange = (e) => {
    const value = e.currentTarget.value;
    setProjectName(value);
    window.sessionStorage.setItem(SESSION_PROJECT_NAME, value);
  };

  const handleResetBtnClick = () => {
    setSeconds(0);
  };

  const handleEyeBtnClick = () => {
    setIsClockVisible(!isClockVisible);
  };

  return (
    <Stack align="center">
      <Group align="middle">
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
        </Group>
      <Stack align="center" gap="xs">
        {isClockVisible 
          ? <Clock 
              counter={seconds} 
              colorClass={colorClass} 
              veilColor={hexVeilColor}
            /> 
          : null}
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
              <FaStop style={{ width: "70%", height: "70%", color:'red' }} />
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
                disabled={interval.active}
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
                hexColorSessionId={SESSION_COLOR}
                hexColor={hexVeilColor}
                setHexColor={setHexVeilColor}
                colorClassSessionId={SESSION_COLOR_CLASS}
                colorClass={colorClass}
                setColorClass={setColorClass}
              />
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Reset"
            onClick={handleResetBtnClick}
            disabled={interval.active}
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
