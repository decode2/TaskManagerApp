import React, { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        // Failed to load tasks
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Tasks</h1>
      <ul>
        {tasks.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;