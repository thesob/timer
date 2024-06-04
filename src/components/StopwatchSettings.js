import {
  ActionIcon,
  Checkbox,
  Divider,
  Flex,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toSecondsFromDuration, toTimeString } from "../utils/utils";
import { FaCheck } from "react-icons/fa6";
import { useEffect } from "react";

const StopwatchSettings = ({
  seconds,
  setSeconds,
  inputRef,
  interval,
  hourlyNotificationSessionId,
  hourlyNotification,
  setHourlyNotification,
}) => {
  useEffect(() => {});
  const handleHourlyNotificationChange = (e) => {
    const value = e.currentTarget.checked;
    setHourlyNotification(value);
    window.sessionStorage.setItem(hourlyNotificationSessionId, value);
  };

  const handleSetBtnClick = () => {
    setSeconds(toSecondsFromDuration(inputRef.current.value));
  };

  const form = useForm({
    validateInputOnChange: ["duration"],
    initialValues: { duration: toTimeString(seconds) },
    validate: {
      duration: (value) =>
        /^\d+:[0-5]\d:[0-5]\d$/.test(value) ? null : "Must be hours:mm:ss",
    },
  });

  return (
    <Stack gap="md" align="left">
      <Stack gap="sm">
        <Flex gap="md" align="center">
          <TextInput
            ref={inputRef}
            name="duration"
            // value={toTimeString(seconds)}
            radius="md"
            size="md"
            variant="filled"
            label="Set time"
            description="Set time and click check to change start time"
            styles={{
              input: { textAlign: "center", color: "gray" },
              root: { textAlign: "center" },
              label: { color: "gray" },
            }}
            disabled={interval.active}
            onChange={(e) => setSeconds(toTimeString(e.target.value))}
            {...form.getInputProps("duration")}
          />
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Set"
            onClick={handleSetBtnClick}
            disabled={interval.active}
          >
            <FaCheck style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
        </Flex>
        <ul
          style={interval.active ? { color: "lightgray" } : { color: "gray" }}
        >
          <li>Format is hours:mm:ss</li>
          <li>Hours can be unlimited</li>
          <li>Min and sec less than 60</li>
        </ul>
      </Stack>
      <Divider />
      <Checkbox
        checked={hourlyNotification}
        label="Hourly sound alert"
        onChange={handleHourlyNotificationChange}
        styles={{ label: { color: "gray" } }}
        disabled={interval.active}
      />
    </Stack>
  );
};

export default StopwatchSettings;
