import logo from './images/PS_logo.png'
import './App.css'
import { useState, useRef, useEffect } from 'react'
import { useInterval } from '@mantine/hooks'
import { Stack, Button, TextInput, Flex, Accordion, Text, Footer, Checkbox, Code} from '@mantine/core'
import { useForm } from '@mantine/form'
import Clock from './components/Clock'

export const SESSION_PROJECT_NAME = 'pname'
export const SESSION_COUNT = 'count'
export const SESSION_HOURLY_NOTIFICATION = 'hourly_sound'


const App = () => {
  const [seconds, setSeconds] = useState(0)
  const inputRef = useRef(null)
  const [project, setProject] = useState('Project X')
  const [hourlyNotification, setHourlyNotification] = useState(false);

  useEffect(() => {
    const sName = window.sessionStorage.getItem(SESSION_PROJECT_NAME)
    const sCount = window.sessionStorage.getItem(SESSION_COUNT)
    const sHourlyNotification = window.sessionStorage.getItem(SESSION_HOURLY_NOTIFICATION) === 'true'
    sName && setProject(sName)
    sCount && setSeconds(Number.parseInt(sCount))
    sHourlyNotification && setHourlyNotification(sHourlyNotification)
  }, [])
  
  useEffect(() => {
    document.title = `${project} - ${interval.active ? '🏃' : '✋'} | ${toTimeString(seconds)}`
    window.sessionStorage.setItem(SESSION_COUNT, seconds)
    if (!hourlyNotification) return
    const residual = seconds % 3600
    if ( residual === 0 && seconds > 0) {
      const hours  = ~~(seconds / 3600)
      // console.log('hour elapsed:', hours)
      const voiceMsg = `${hours} ${hours > 1 ? 'hours' : 'hour'} elapsed`
      // console.log(voiceMsg)
      const utterance = new SpeechSynthesisUtterance(voiceMsg)
      const voices = speechSynthesis.getVoices()
      utterance.voice = voices[0]
      speechSynthesis.speak(utterance)
    }
  })

  const handleIntervalTick = () => {
    setSeconds((s) => s + 1)
  }

  const handleStartBtnClick = () => {
    const newCountingState = !interval.active
    document.documentElement.style.setProperty('--logo-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    document.documentElement.style.setProperty('--hands-animation-state', `${newCountingState ? 'running' : 'paused'}`);
    interval.toggle()
  }

  const handleProjectNameChange = (e) => {
    const value = e.currentTarget.value
    setProject(value)
    window.sessionStorage.setItem(SESSION_PROJECT_NAME, value)
  }

  const handleHourlyNotificationChange = (e) => {
    const value = e.currentTarget.checked
    setHourlyNotification(value)
    window.sessionStorage.setItem(SESSION_HOURLY_NOTIFICATION, value)
  }

  const handleSetBtnClick = () => {
    setSeconds(toSecondsFromDuration(inputRef.current.value))
  }

  const handleResetBtnClick = () => {
    setSeconds(0)
    inputRef.current.value = '00:00:00'
  }

  const padify = (number) => String(number).padStart(2, '0')
  const toTimeString = (s) => `${padify(~~(s / 3600))}:${padify(~~((s % 3600) / 60))}:${padify(s % 60)}`

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

  return (
    <Stack align="center">
      <Flex 
        align='center'
        gap='lg'>
        <img src={logo} className="App-logo" alt="logo" />
        <TextInput
          radius="lg"
          size="xl"
          styles={{ input: { textAlign: 'center', color: 'gray' }, root: { textAlign: 'center', marginTop: 20 }, label: { color: 'gray' } }}
          disabled={interval.active}
          onChange={handleProjectNameChange}
          value={project}
          />
      </Flex>
      <Clock counter={seconds} />
      <Code c='darkgray'><h1 style={{fontSize: "33px", fontWeight: 'bolder', lineHeight: '0.2'}}>{toTimeString(seconds)}</h1></Code>
      <Button
        variant="outline"
        color={interval.active ? 'red' : 'teal'}
        radius="lg"
        size="lg"
        onClick={handleStartBtnClick}
        >
        {interval.active ? 'Stop' : 'Start'} counting
      </Button>
      <Accordion variant="default" radius="md">
        <Accordion.Item value="customization">
          <Accordion.Control><Text color='dimmed'>Settings</Text></Accordion.Control>
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
                //onChange={e => setSeconds(toTimeString(e.target.value))}
                {...form.getInputProps('duration')}
                />
              <Button
                variant="light"
                radius="md"
                size="s"
                color='gray'
                onClick={handleSetBtnClick}
                disabled={!form.isValid() || interval.active}
                compact
                title='Set main counter to duration in field'
                >
                Set
              </Button>
              <Button
                variant="light"
                radius="md"
                size="s"
                color='gray'
                onClick={handleResetBtnClick}
                disabled={!form.isValid() || interval.active}
                compact
                title='Set counter to 0'
                >
                Reset
              </Button>
            </Flex>
            <ul style={interval.active ? { color: 'lightgray' } : { color: 'gray' }}>
              <li>Format is hours:mm:ss</li>
              <li>Hours can be unlimited</li>
              <li>Min and sec less than 60</li>
            </ul>
            <Checkbox 
              checked={hourlyNotification}
              label='Hourly sound alert'
              onChange={handleHourlyNotificationChange}
              styles={{label: {color:'gray'}}}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Footer><a href='https://github.com/thesob/timer' target='blank' rel='external'>Github</a></Footer>
    </Stack>
  );
}

export default App;
