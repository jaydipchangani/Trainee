import React, { useState, useEffect } from "react";
import { Drawer, Form, Input, Button, Select, message } from "antd";

interface AddClassDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newClass: any) => void;
}

const AddClassDrawer: React.FC<AddClassDrawerProps> = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [classValues, setClassValues] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);

  // ✅ Function to verify token before API calls
  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Authentication failed! Please log in again.");
      console.error("No authentication token found!");
      return false;
    }

    // Optional: Validate token by making an API call if needed
    return true;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        message.error("Authentication failed! Please log in again.");
        console.error("No authentication token found!");
        return;
      }
  
      console.log("Fetching company dropdown data...");
  
      try {
        const response = await fetch(
          "https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroupDropdown?groupType=all&reportType=0",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
          }
        );
  
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);
  
        if (!response.ok) {
          console.error("Server Error Response:", response.status, responseText);
          message.error(`Failed to fetch companies: ${response.status}`);
          return;
        }
  
        const data = JSON.parse(responseText);
  
        if (!data || !data.result || !Array.isArray(data.result)) {
          console.error("API returned null or invalid result.");
          message.error("No company data available.");
          return;
        }
  
        // ✅ Extract 'option' field (company names) for dropdown
        interface Company {
          id: string;
          option: string;
        }

        interface ApiResponse {
          result: Company[];
        }

        const formattedCompanies: { id: string; name: string }[] = (data as ApiResponse).result.map((company: Company) => ({
          id: company.id, // Use the correct id field
          name: company.option, // Use the option field as the name
        }));
  
        console.log("Formatted Companies:", formattedCompanies);
        setCompanies(formattedCompanies); // Update state with formatted data
      } catch (error) {
        console.error("Error fetching companies:", error);
        message.error("An error occurred while fetching companies.");
      }
    };
  
    fetchCompanies();
  }, []);
  


  const addClassValueField = () => {
    setClassValues([...classValues, ""]);
  };

  const fetchLatestData = async () => {
    const token = localStorage.getItem("token");
    console.log("Fetching latest data...");

    try {
      const response = await fetch(
        "https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetGRCRecords",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Fetched Latest Data:", result);

      if (response.ok) {
        onAdd(result);
      } else {
        message.error("Failed to fetch updated data.");
      }
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
  
    // ✅ Verify token before proceeding
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
      setLoading(false);
      return;
    }
  
    // ✅ Validate required fields
    if (!values.groupId || !values.className) {
      message.error("Please select a group and enter a class name.");
      setLoading(false);
      return;
    }
  
    // ✅ Corrected API Request Format
    const newClass = {
      id: 0 , // API expects `id` instead of `groupClassId`
      groupId: parseInt(values.groupId, 10) || 0, // Make sure this is correctly selected
      className: values.className,
      gRCValuesDetails: classValues
        .filter((val) => val.trim() !== "")
        .map((val) => ({
          id: 0, // API expects `id` for each class value
          classValue: val,
        })),
    };
  
    console.log("Submitting Data to API:", JSON.stringify(newClass, null, 2));
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://sandboxgathernexusapi.azurewebsites.net/api/GRC/InsertUpdateGRCDetail",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClass),
        }
      );
  
      const responseText = await response.text();
      console.log("Raw API Response:", responseText);
  
      if (!response.ok) {
        console.error("API Error Details:", response.status, response.statusText);
        message.error(`API Error: ${response.status} - ${response.statusText}`);
        return;
      }
  
      const result = JSON.parse(responseText);
      console.log("Parsed API Response:", result);
  
      message.success("Class added successfully!");
      form.resetFields();
      setClassValues([""]);
      fetchLatestData();
      onClose();
    } catch (error) {
      console.error("Error while saving class:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Drawer title="Add New Class" width={400} open={visible} onClose={onClose}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Group Dropdown */}
        <Form.Item
          label="Select Group"
          name="groupId"
          rules={[{ required: true, message: "Please select a group" }]}
        >
          <Select placeholder="Select a company">
            {companies.map((company) => (
              <Select.Option key={company.id} value={company.id}>
                {company.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Class Name"
          name="className"
          rules={[{ required: true, message: "Please enter class name" }]}
        >
          <Input />
        </Form.Item>

        {classValues.map((value, index) => (
          <Form.Item key={index} label={`Class Value ${index + 1}`}>
            <Input
              value={value}
              onChange={(e) => {
                const newValues = [...classValues];
                newValues[index] = e.target.value;
                setClassValues(newValues);
              }}
            />
          </Form.Item>
        ))}

        <Button type="dashed" onClick={addClassValueField}>
          Add More Values
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginTop: "10px" }} loading={loading}>
          Submit
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddClassDrawer;
