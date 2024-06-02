import './App.css'
import { Flex, Stack} from '@mantine/core'
import Stopwatch from './components/Stopwatch'
import logo from './images/PS_logo.png'

const App = () => {

  return (
    <Stack align='center' justify='center'>
      <img src={logo} className="App-logo" alt="logo" />
      <Flex direction={'row'}>
        <Stopwatch defaultName='Project X' id={1}/>
      </Flex>
      <footer>
        <a href='https://github.com/thesob/timer' target='blank' rel='external'>Github</a>
      </footer>
    </Stack>
  )
}

export default App;
