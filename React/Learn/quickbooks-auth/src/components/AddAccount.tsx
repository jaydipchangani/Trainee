import React from "react";
import { Button } from "antd";

const AddAccount = () => {
  const handleAddAccount = () => {
    console.log("Adding new account...");
    // Logic to handle adding a new account goes here
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddAccount}>
        Add Account
      </Button>
    </div>
  );
};

export default AddAccount;
