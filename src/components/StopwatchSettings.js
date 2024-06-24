import {
  Button,
  Checkbox,
  ColorInput,
  Divider,
  Flex,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toSecondsFromDuration, toTimeString } from "../utils/utils";

const StopwatchSettings = ({
  seconds,
  setSeconds,
  inputRef,
  interval,
  hourlyNotificationSessionId,
  hourlyNotification,
  setHourlyNotification,
  hexColorSessionId,
  hexColor,
  setHexColor,
  colorClassSessionId,
  colorClass,
  setColorClass,
}) => {
  const handleHourlyNotificationChange = (e) => {
    const value = e.currentTarget.checked;
    setHourlyNotification(value);
    window.sessionStorage.setItem(hourlyNotificationSessionId, value);
  };

  const handleSetBtnClick = () => {
    setSeconds(toSecondsFromDuration(inputRef.current.value));
  };

  const handleColorVeilChange = (value) => {
    setHexColor(value);
    window.sessionStorage.setItem(hexColorSessionId, value);
  };

  const handleClockClassChange = (value) => {
    setColorClass(value);
    window.sessionStorage.setItem(colorClassSessionId, value);
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
      <Flex gap="md" align="flex-end">
        <TextInput
          ref={inputRef}
          name="duration"
          // value={toTimeString(seconds)}
          radius="md"
          size="md"
          variant="filled"
          label="Set time"
          description="Click set to change start time. Format is hours:mm:ss. Unlimited hours. Min and sec less than 60"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
          disabled={interval.active}
          onChange={(e) => setSeconds(toTimeString(e.target.value))}
          {...form.getInputProps("duration")}
        />
        <Button
          variant="light"
          radius="md"
          aria-label="Set"
          onClick={handleSetBtnClick}
          disabled={interval.active}
          color="gray"
        >
          Set
        </Button>
      </Flex>
      <Divider />
      <ColorInput
        label="Pick a veil color"
        description="Transparent veil in front of clock"
        placeholder="hex color"
        format="hex"
        swatchesPerRow={5}
        swatches={[
          "#2e2e2e",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
          "#ffffff",
        ]}
        styles={{
          input: { textAlign: "center", color: "gray" },
          root: { textAlign: "center" },
          label: { color: "gray" },
        }}
        value={hexColor}
        onChange={handleColorVeilChange}
      />
      <Radio.Group
        value={colorClass}
        onChange={handleClockClassChange}
        name="CockClass"
        label="Select color effect"
        description="Revamp the clockface texture"
        styles={{
          input: { textAlign: "center", color: "gray" },
          root: { textAlign: "center" },
          label: { color: "gray" },
        }}
      >
        <Radio
          value=""
          label="Standard"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
        />
        <Radio
          value="roseish"
          label="Roseish"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
        />
        <Radio
          value="yellowish"
          label="Yellowish"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
        />
        <Radio
          value="blueish"
          label="Blueish"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
        />
        <Radio
          value="greenish"
          label="Greenish"
          styles={{
            input: { textAlign: "center", color: "gray" },
            root: { textAlign: "center" },
            label: { color: "gray" },
          }}
        />
      </Radio.Group>
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
