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

const Stopwatch = ({ defaultName, id, clockVisible=true }) => {
  const [seconds, setSeconds] = useState(0);
  const [projectName, setProjectName] = useState(defaultName);
  const inputRef = useRef(null);
  const [hourlyNotification, setHourlyNotification] = useState(false);
  const [isClockVisible, setIsClockVisible] = useState(clockVisible)

  const addIdTo = (label) => label + "_" + id;
  const SESSION_COUNT = addIdTo(SESSION_COUNT_BASE);
  const SESSION_HOURLY_NOTIFICATION = addIdTo(SESSION_HOURLY_NOTIFICATION_BASE);
  const SESSION_PROJECT_NAME = addIdTo(SESSION_PROJECT_NAME_BASE);

  useEffect(() => {
    const sName = window.sessionStorage.getItem(SESSION_PROJECT_NAME);
    const sCount = window.sessionStorage.getItem(SESSION_COUNT_BASE);
    const sHourlyNotification =
      window.sessionStorage.getItem(SESSION_HOURLY_NOTIFICATION) === "true";
    sName && setProjectName(sName);
    sCount && setSeconds(Number.parseInt(sCount));
    sHourlyNotification && setHourlyNotification(sHourlyNotification);
  }, [SESSION_HOURLY_NOTIFICATION, SESSION_PROJECT_NAME]);

  useEffect(() => {
    document.title = `${projectName} - ${
      interval.active ? "🏃" : "✋"
    } | ${toTimeString(seconds)}`;
    window.sessionStorage.setItem(SESSION_COUNT, seconds);
    if (!hourlyNotification) return;
    const residual = seconds % 3600;
    if (residual === 0 && seconds > 0) {
      const hours = ~~(seconds / 3600);
      // console.log('hour elapsed:', hours)
      const voiceMsg = `${hours} ${
        hours > 1 ? "hours" : "hour"
      } elapsed on task ${projectName}`;
      // console.log(voiceMsg)
      const utterance = new SpeechSynthesisUtterance(voiceMsg);
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[0];
      speechSynthesis.speak(utterance);
    }
  });

  const handleIntervalTick = () => {
    setSeconds((s) => s + 1);
  };

  const handleStartBtnClick = () => {
    const newCountingState = !interval.active;
    document.documentElement.style.setProperty(
      "--logo-animation-state",
      `${newCountingState ? "running" : "paused"}`
    );
    interval.toggle();
  };

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
  const interval = useInterval(handleIntervalTick, 1000);

  return (
    <Stack align="center" gap='sm'>
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
      <Stack align="center">
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
