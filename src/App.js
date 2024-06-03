import "./App.css";
import { ActionIcon, Anchor, Flex, Group, Stack } from "@mantine/core";
import Stopwatch from "./components/Stopwatch";
import logo from "./images/PS_logo.png";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";

const App = () => {
  const [items, setItems] = useState([{
    defaultName: `Project 1`,
    id: 1, 
    clockVisible: true, 
    tasks:[ 
      {defaultName: `Task ${11}`, id: 11, parentId:1, clockVisible: false},
    ]
  }])

  const handleAddProjectClick = () => {
    const nextIndex = items.length + 1
    const newItem = {
      defaultName: `Project ${nextIndex}`,
      id: nextIndex,
      clockVisible: true,
      tasks: []
    }
    setItems(items.concat(newItem))
  }

  const handleDelProjectClick = () => {
    setItems(items.slice(0, -1))
  }

  const handleAddTaskClick = (project) => {
    return () => {
      const nextTaskIndex = project.id * 10 + project.tasks.length + 1
      const newTask = {
        defaultName: `Task ${nextTaskIndex}`,
        id: nextTaskIndex,
        parentId: project.id,
        clockVisible: false,
      }
      const copy = { ...project }
      copy.tasks = project.tasks.concat(newTask) // add new task to the end
      const newItems = items.map( (p) => p.id !== project.id ? p : copy)
      console.log(newItems)
      setItems(newItems)
    }
  }

  const handleDelTaskClick = (project) => {
    return () => {
      const copy = { ...project }
      copy.tasks = project.tasks.slice(0, -1)
      const newItems = items.map( (p) => p.id !== project.id ? p : copy)
      setItems(newItems)
    }
  }

  return (
    <Stack align="center" justify="center">
      <img src={logo} className="App-logo" alt="logo" />
      <Flex direction={"row"} gap={'lg'}>
        {
          items.map((project) => {
            return (
              <Stack key={project.id} align="center" gap='xl' >
                <Stopwatch 
                  defaultName={project.defaultName} 
                  id={project.id} 
                  clockVisible={project.clockVisible}
                  handleAddProjectClick={handleAddProjectClick}
                />
                { 
                  project.tasks &&
                  project.tasks.map((task) => 
                    <Stopwatch 
                      key={task.id} 
                      defaultName={task.defaultName} 
                      id={task.id} 
                      parentId={task.parentId} 
                      clockVisible={task.clockVisible}
                    />)
                }
                <Group>
                  <ActionIcon
                      variant="transparent"
                      radius="md"
                      size="md"
                      aria-label="Add task"
                      onClick={handleAddTaskClick(project)}
                    >
                      <FaPlus style={{ width: "70%", height: "70%" }} />
                  </ActionIcon>
                  <ActionIcon
                      variant="transparent"
                      radius="md"
                      size="md"
                      aria-label="Delete task"
                      onClick={handleDelTaskClick(project)}
                    >
                      <FaMinus style={{ width: "70%", height: "70%" }} />
                  </ActionIcon>
                </Group>
              </Stack>
            )
        })}
        <Stack gap='xs'>
          <ActionIcon
              variant="transparent"
              radius="md"
              size="md"
              aria-label="Add project"
              onClick={handleAddProjectClick}
            >
              <FaPlus style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
          <ActionIcon
              variant="transparent"
              radius="md"
              size="md"
              aria-label="Delete project"
              onClick={handleDelProjectClick}
            >
              <FaMinus style={{ width: "70%", height: "70%" }} />
          </ActionIcon>

        </Stack>
      </Flex>
      <Anchor href="https://github.com/thesob/timer" target="blank" rel="external">
        Github
      </Anchor>
    </Stack>
  );
};

export default App;
