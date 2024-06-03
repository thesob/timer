import "./App.css";
import { Anchor, Stack } from "@mantine/core";
import logo from "./images/PS_logo.png";
import Panel from "./components/Panel";

const App = () => {


  return (
    <Stack align="center" justify="center">
      <img src={logo} className="App-logo" alt="logo" />
      <Panel />
      <Anchor href="https://github.com/thesob/timer" target="blank" rel="external">
        Github
      </Anchor>
    </Stack>
  );
};

export default App;
