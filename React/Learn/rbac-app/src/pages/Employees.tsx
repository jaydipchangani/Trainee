import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { fetchEmployees, deleteEmployee } from "../api/employees";
import { getCurrentUser } from "../api/auth";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetchEmployees().then(setEmployees);
  }, []);

  const handleDelete = async (id: number) => {
    if (user?.role !== "HR") return;
    await deleteEmployee(id);
    message.success("Employee deleted.");
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <Table
      dataSource={employees}
      rowKey="id"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Position", dataIndex: "position" },
        user?.role === "HR" && {
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

export default Employees;
