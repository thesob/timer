import {
  ActionIcon,
  Checkbox,
  Flex,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toSecondsFromDuration, toTimeString } from "../utils/utils";
import { FaCheck } from "react-icons/fa6";

const StopwatchSettings = ({
  seconds,
  setSeconds,
  inputRef,
  interval,
  hourlyNotificationSessionId,
  hourlyNotification,
  setHourlyNotification,
}) => {
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
    initialValues: {
      duration: "00:00:00",
    },
    validate: {
      duration: (value) =>
        /^\d+:[0-5]\d:[0-5]\d$/.test(value) ? null : "Must be hours:mm:ss",
    },
  });

  return (
    <>
      <Flex gap="md">
        <TextInput
          ref={inputRef}
          name="duration"
          value={toTimeString(seconds)}
          radius="lg"
          size="md"
          variant="filled"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
          disabled={interval.active}
          //onChange={e => setSeconds(toTimeString(e.target.value))}
          {...form.getInputProps("duration")}
        />
        <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Set"
            onClick={handleSetBtnClick}
        >
          <FaCheck style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Flex>
      <ul style={interval.active ? { color: "lightgray" } : { color: "gray" }}>
        <li>Format is hours:mm:ss</li>
        <li>Hours can be unlimited</li>
        <li>Min and sec less than 60</li>
      </ul>
      <Checkbox
        checked={hourlyNotification}
        label="Hourly sound alert"
        onChange={handleHourlyNotificationChange}
        styles={{ label: { color: "gray" } }}
      />
    </>
  );
};

export default StopwatchSettings;
