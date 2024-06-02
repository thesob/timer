import "./App.css";
import { Anchor, Flex, Stack } from "@mantine/core";
import Stopwatch from "./components/Stopwatch";
import logo from "./images/PS_logo.png";

const App = () => {
  const items = [
    {
      defaultName: 'Project X',
      id: 1, 
      clockVisible: true, 
      tasks:[ 
        {defaultName: 'Task X1', id: 1_1, parent:1, clockVisible: false},
        {defaultName: 'Task X2', id: 1_2, parent:1, clockVisible: false},
      ]
    },
    {
      defaultName: 'Project Y', 
      id: 2, 
      clockVisible: true, 
      tasks:[]
    },
    {
      defaultName: 'Project Z', 
      id: 3, 
      clockVisible: true, 
      tasks:[]
    },
  ]

  return (
    <Stack align="center" justify="center">
      <img src={logo} className="App-logo" alt="logo" />
      <Flex direction={"row"} gap={'md'}>
        {
          items.map((project) => {
            return (
              <Stack key={project.id} align="center">
                <Stopwatch defaultName={project.defaultName} id={project.id} clockVisible={project.clockVisible}/>
                {
                  project.tasks.map((task) => 
                    <Stopwatch 
                      key={task.id} 
                      defaultName={task.defaultName} 
                      id={task.id} 
                      parentId={task.parent} 
                      clockVisible={task.clockVisible}
                    />)
                }
              </Stack>
            )
        })}
      </Flex>
      <Anchor href="https://github.com/thesob/timer" target="blank" rel="external">
        Github
      </Anchor>
    </Stack>
  );
};

export default App;
