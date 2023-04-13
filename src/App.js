import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';
import { useInterval } from '@mantine/hooks';
import { Stack, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form'

const App = () => {
  const [seconds, setSeconds] = useState(0)
  const interval = useInterval(() => setSeconds((s) => s + 1, 1000))
  const inputRef = useRef(null)

  const toTimeString = (s) => new Date(s * 1000).toISOString().substring(11, 19)

  function toSecondsFromDuration(s) {
    const [hours, minutes, seconds] = s.split(':')
    const counter = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
    return (counter)
  }

  const form = useForm({
    validateInputOnChange: ['duration'],
/*     initialValues: {
      duration: '00:00:00'
    }, */
    validate: {
      duration: (value) => /^\d\d:[0-5]\d:[0-5]\d$/.test(value) ? null : 'Must be hh:mm:ss'
    }
  })

  const handleClick = () => {
    interval.toggle()
    let newCountingState = !interval.active
    document.documentElement.style.setProperty('--logo-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    const sec = toSecondsFromDuration(inputRef.current.value)
    //console.log(sec);
    setSeconds(sec)
  }


  return (
    <Stack align="center">
      <img src={logo} className="App-logo" alt="logo" />
      <TextInput
        ref={inputRef}
        value={toTimeString(seconds)}
        label='Elapsed time'
        radius="lg"
        size="xl"
        variant="filled"
        styles={{ input: { textAlign: 'center' }, root: { textAlign: 'center' } }}
        disabled={interval.active}
        {...form.getInputProps('duration')}
      />
      <Button
        variant="outline"
        color={interval.active ? 'red' : 'teal'}
        radius="lg"
        size="lg"
        onClick={handleClick} 
        disabled={!form.isValid()}
      >
        {interval.active ? 'Stop' : 'Start'} counting
      </Button>
    </Stack>
  );
}

export default App;
