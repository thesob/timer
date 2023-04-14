import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';
import { useInterval } from '@mantine/hooks';
import { Stack, Button, TextInput, Title, Text, Flex } from '@mantine/core';
import { useForm } from '@mantine/form'

const App = () => {
  const [seconds, setSeconds] = useState(0)
  const inputRef = useRef(null)

  const toTimeString = (s) => new Date(s * 1000).toISOString().substring(11, 19)

  const handleIntervalTick = () => setSeconds((s) => s + 1)
  const interval = useInterval(handleIntervalTick, 1000)

  /** Calculates total seconds from a timestamp shaped "HH:mm:ss"
   *  where seconds and minutes need to be less than 60
   */
  function toSecondsFromDuration(duration) {
    const [hours, minutes, seconds] = duration.split(':')
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
    return (totalSeconds)
  }

  const form = useForm({
    validateInputOnChange:
      ['duration'],
    initialValues: {
      duration: '00:00:00'
    },
    validate: {
      duration: (value) => /^\d\d:[0-5]\d:[0-5]\d$/.test(value) ? null : 'Must be hh:mm:ss, \nwhere mm & ss are < 60'
    }
  })

  const handleClick = () => {
    const newCountingState = !interval.active
    //if (newCountingState) { setSeconds(toSecondsFromDuration(inputRef.current.value)) }
    document.documentElement.style.setProperty('--logo-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    interval.toggle()
  }


  return (
    <Stack align="center">
      <img src={logo} className="App-logo" alt="logo" />
      <Text fz='lg' c='dimmed'>Elapsed time</Text>
      <Title order={1} c='darkgray'>{toTimeString(seconds)}</Title>
      <Button
        variant="outline"
        color={interval.active ? 'red' : 'teal'}
        radius="lg"
        size="lg"
        onClick={handleClick}
      //disabled={!form.isValid()}
      >
        {interval.active ? 'Stop' : 'Start'} counting
      </Button>
      <form>
        <Flex gap='md'>
          <TextInput
            ref={inputRef}
            name='duration'
            value={toTimeString(seconds)}
            //description={toTimeString(seconds)}
            label='Set elapsed time'
            radius="lg"
            size="l"
            variant="filled"
            styles={{ input: { textAlign: 'center', color: 'gray' }, root: { textAlign: 'center' }, label: { color: 'gray' } }}
            disabled={interval.active}
            onChange={e => setSeconds(toTimeString(e.target.value))}
            {...form.getInputProps('duration')}
          />
          <Button
            variant="light"
            radius="md"
            size="s"
            color='gray'
            onClick={() => setSeconds(toSecondsFromDuration(inputRef.current.value))}
            disabled={!form.isValid() || interval.active}
            compact
          >
            Set
          </Button>
        </Flex>
      </form>
    </Stack>
  );
}

export default App;
