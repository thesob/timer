import {
  Button,
  Checkbox,
  Flex,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Stopwatch from "./Stopwatch";
import { toSecondsFromDuration, toTimeString } from "../utils/utils";

const StopwatchSettings = ({
  seconds,
  setSeconds,
  inputRef,
  interval,
  hourlyNotification,
  setHourlyNotification,
}) => {
  const handleHourlyNotificationChange = (e) => {
    const value = e.currentTarget.checked;
    setHourlyNotification(value);
    window.sessionStorage.setItem(Stopwatch.SESSION_HOURLY_NOTIFICATION, value);
  };

  const handleSetBtnClick = () => {
    setSeconds(toSecondsFromDuration(inputRef.current.value));
  };

  const handleResetBtnClick = () => {
    setSeconds(0);
    inputRef.current.value = "00:00:00";
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
          size="l"
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
        <Button
          variant="light"
          radius="md"
          size="s"
          color="gray"
          onClick={handleSetBtnClick}
          disabled={!form.isValid() || interval.active}
          compact
          title="Set main counter to duration in field"
        >
          Set
        </Button>
        <Button
          variant="light"
          radius="md"
          size="s"
          color="gray"
          onClick={handleResetBtnClick}
          disabled={!form.isValid() || interval.active}
          compact
          title="Set counter to 0"
        >
          Reset
        </Button>
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
