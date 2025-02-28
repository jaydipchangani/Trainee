import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { fetchProjects, deleteProject } from "../api/projects";
import { getCurrentUser } from "../api/auth";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const handleDelete = async (id: number) => {
    if (user?.role !== "Manager") return;
    await deleteProject(id);
    message.success("Project deleted.");
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  return (
    <Table
      dataSource={projects}
      rowKey="id"
      columns={[
        { title: "Title", dataIndex: "title" },
        { title: "Description", dataIndex: "description" },
        user?.role === "Manager" && {
          title: "Action",
          render: (_, record) => (
            <Button danger onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          ),
        },
      ].filter(Boolean)}
    />
  );
};

export default Projects;    
