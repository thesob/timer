import { ActionIcon, Group, Stack } from "@mantine/core";
import Stopwatch from "./Stopwatch";
import { FaMinus, FaPlus } from "react-icons/fa6";
import {SESSION_ITEMS} from '../utils/utils'

const PanelColumn = ({items, setItems, project}) => {

  const handleAddTaskClick = () => {
    const nextTaskIndex = project.id * 10 + project.tasks.length + 1;
    const newTask = {
      defaultName: `Task ${nextTaskIndex}`,
      id: nextTaskIndex,
      parentId: project.id,
      clockVisible: false,
    };
    const copy = { ...project };
    copy.tasks = project.tasks.concat(newTask); // add new task to the end
    const newItems = items.map((p) => (p.id !== project.id ? p : copy));
    console.log(newItems);
    setItems(newItems);
    window.sessionStorage.setItem(SESSION_ITEMS, JSON.stringify(newItems))
  };

  const handleDelTaskClick = () => {
    const copy = { ...project };
    copy.tasks = project.tasks.slice(0, -1);
    const newItems = items.map((p) => (p.id !== project.id ? p : copy));
    setItems(newItems);
    window.sessionStorage.setItem(SESSION_ITEMS, JSON.stringify(newItems))
  };

  return (
    <Stack key={project.id} align="center" gap="xl">
      <Stopwatch
        defaultName={project.defaultName}
        id={project.id}
        clockVisible={project.clockVisible}
      />
      {project.tasks &&
        project.tasks.map((task) => (
          <Stopwatch
            key={task.id}
            defaultName={task.defaultName}
            id={task.id}
            parentId={task.parentId}
            clockVisible={task.clockVisible}
          />
        ))}
      <Group>
        <ActionIcon
          variant="transparent"
          radius="md"
          size="md"
          aria-label="Add task"
          onClick={handleAddTaskClick}
          disabled={project.tasks.length > 4}
        >
          <FaPlus style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          radius="md"
          size="md"
          aria-label="Delete task"
          onClick={handleDelTaskClick}
          disabled={project.tasks.length < 1}
        >
          <FaMinus style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};

export default PanelColumn;
