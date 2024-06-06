import "./App.css";
import { ActionIcon, Anchor, Grid, Stack } from "@mantine/core";
import logo from "./images/PS_logo.png";
import Panel from "./components/Panel";
import { MdFlipCameraAndroid } from "react-icons/md";
import { useEffect, useState } from "react";
import { SESSION_DIRECTION } from "./utils/utils";

const App = () => {
  const [direction, setDirection] = useState("column");

  useEffect(() => {
    const sessionDirection = window.sessionStorage.getItem(SESSION_DIRECTION);
    sessionDirection
    ? setDirection(sessionDirection)
    : setDirection('column')
  },[])

  const handleFlipDirectionClick = () => {
    const newDirection = direction === "column" ? "row" : "column"
    setDirection(newDirection);
    window.sessionStorage.setItem(SESSION_DIRECTION, newDirection)
  };

  return (
    <Stack align="center" justify="center" className="main">
      <Grid justify="space-between" style={{width: '100%'}}>
        <Grid.Col span={1}>
          <ActionIcon
            variant="light"
            radius="lg"
            size="xl"
            aria-label="Flip"
            onClick={handleFlipDirectionClick}
          >
            <MdFlipCameraAndroid />
          </ActionIcon>
        </Grid.Col>
        <Grid.Col span={1} offset={1}>
          <img src={logo} className="App-logo" alt="logo" />
        </Grid.Col>
      </Grid>
      <Panel direction={direction} />
      <Anchor
        href="https://github.com/thesob/timer"
        target="blank"
        rel="external"
      >
        Github
      </Anchor>
    </Stack>
  );
};

export default App;
