import { ActionIcon, Divider, Flex, Stack } from "@mantine/core";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import PanelColumn from "./PanelColumn";
import { SESSION_ITEMS } from "../utils/utils";

const Panel = ({direction='row'}) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const sessionItems = window.sessionStorage.getItem(SESSION_ITEMS);
    sessionItems
      ? setItems(JSON.parse(sessionItems))
      : setItems([
          {
            defaultName: `Project 1`,
            id: 1,
            clockVisible: true,
            tasks: [
              // { defaultName: `Task ${11}`, id: 11, parentId: 1, clockVisible: false },
            ],
          },
        ]);
  }, []);

  const handleAddProjectClick = ({direction='column'}) => {
    const nextIndex = items.length + 1;
    const newItem = {
      defaultName: `Project ${nextIndex}`,
      id: nextIndex,
      clockVisible: true,
      tasks: [],
    };
    const newItems = items.concat(newItem);
    setItems(newItems);
    window.sessionStorage.setItem(SESSION_ITEMS, JSON.stringify(newItems));
  };

  const handleDelProjectClick = () => {
    const newItems = items.slice(0, -1);
    setItems(newItems);
    window.sessionStorage.setItem(SESSION_ITEMS, JSON.stringify(newItems));
  };

  return (
    <>
    <Flex direction={direction} gap={"lg"}>
      {items.map((project) => (
        <div key={project.id}>
          <Divider size="sm" label={project.defaultName} labelPosition="center" />
          <PanelColumn
            key={project.id}
            items={items}
            setItems={setItems}
            project={project}
            direction={direction === 'row' ? 'column' : 'row'}
          />
        </div>
      ))}
      <Stack gap="xs">
        <ActionIcon
          variant="transparent"
          radius="md"
          size="md"
          aria-label="Add project"
          onClick={handleAddProjectClick}
          disabled={items.length > 4}
        >
          <FaPlus style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          radius="md"
          size="md"
          aria-label="Delete project"
          onClick={handleDelProjectClick}
          disabled={items.length === 1}
        >
          <FaMinus style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Stack>
    </Flex>
    </>
  );
};

export default Panel;
