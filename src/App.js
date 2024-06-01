import './App.css'
import { Stack, Footer, Header} from '@mantine/core'
import Stopwatch from './components/Stopwatch'
import logo from './images/PS_logo.png'

const App = () => {

  return (
    <>
      <Header>
        <img src={logo} className="App-logo" alt="logo" />
      </Header>
        <Stopwatch defaultName='Project X' id={1}/>
        <Footer align='bottom'>
          <a href='https://github.com/thesob/timer' target='blank' rel='external'>Github</a>
        </Footer>
    </>
  );
}

export default App;
