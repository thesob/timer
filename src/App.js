import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { useInterval } from '@mantine/hooks';
import { Stack, Button, TextInput, Title, Flex, Accordion, Text, Footer } from '@mantine/core';
import { useForm } from '@mantine/form'

const App = () => {
  const [seconds, setSeconds] = useState(0)
  const inputRef = useRef(null)
  const [project, setProject] = useState('Timer')
  useEffect(() => {
    document.title = `${project} - ${interval.active ? 'Running' : 'Stopped'} | ${toTimeString(seconds)}`
  })
  const padify = (number) => String(number).padStart(2, '0')
  const toTimeString = (s) => `${padify(~~(s / 3600))}:${padify(~~((s % 3600) / 60))}:${padify(s % 60)}`

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
      duration: (value) => /^\d+:[0-5]\d:[0-5]\d$/.test(value) ? null : 'Must be hours:mm:ss'
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
      <TextInput
        radius="lg"
        size="xl"
        //variant="filled"
        styles={{ input: { textAlign: 'center', color: 'gray' }, root: { textAlign: 'center', marginTop: 20 }, label: { color: 'gray' } }}
        disabled={interval.active}
        onChange={e => setProject(e.currentTarget.value)} value={project}
        />
      <img src={logo} className="App-logo" alt="logo" width={350}/>
      <Title order={1} c='darkgray'>{toTimeString(seconds)}</Title>
      <Button
        variant="outline"
        color={interval.active ? 'red' : 'teal'}
        radius="lg"
        size="lg"
        onClick={handleClick}
        >
        {interval.active ? 'Stop' : 'Start'} counting
      </Button>
      <Accordion variant="default" radius="md">
        <Accordion.Item value="customization">
          <Accordion.Control><Text color='dimmed'>Set start time</Text></Accordion.Control>
          <Accordion.Panel>
            <Flex gap='md'>
              <TextInput
                ref={inputRef}
                name='duration'
                value={toTimeString(seconds)}
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
            <ul style={interval.active ? { color: 'lightgray' } : { color: 'gray' }}>
              <li>Format is hours:mm:ss</li>
              <li>Hours can be unlimited</li>
              <li>Min and sec less than 60</li>
            </ul>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Footer><a href='https://github.com/thesob/timer' target='blank' rel='external'>Github</a></Footer>
    </Stack>
  );
}

export default App;
