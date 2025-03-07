import React, { useState } from "react";
import { Drawer, Form, Input, Button } from "antd";

interface AddClassDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newClass: any) => void;
}

const AddClassDrawer: React.FC<AddClassDrawerProps> = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [classValues, setClassValues] = useState<string[]>([""]);

  const addClassValueField = () => {
    setClassValues([...classValues, ""]);
  };

  const onFinish = (values: any) => {
    const newClass = {
      groupName: values.groupName,
      className: values.className,
      classValues: classValues.filter((val) => val.trim() !== ""),
    };
    onAdd(newClass);
    form.resetFields();
    setClassValues([""]);
  };

  return (
    <Drawer title="Add New Class" width={400} visible={visible} onClose={onClose}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Group Name" name="groupName" rules={[{ required: true, message: "Please enter group name" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Class Name" name="className" rules={[{ required: true, message: "Please enter class name" }]}>
          <Input />
        </Form.Item>

        {classValues.map((value, index) => (
          <Form.Item key={index} label={`Class Value ${index + 1}`}>
            <Input value={value} onChange={(e) => {
              const newValues = [...classValues];
              newValues[index] = e.target.value;
              setClassValues(newValues);
            }} />
          </Form.Item>
        ))}

        <Button type="dashed" onClick={addClassValueField}>Add More Values</Button>
        <Button type="primary" htmlType="submit" style={{ marginTop: "10px" }}>Submit</Button>
      </Form>
    </Drawer>
  );
};

export default AddClassDrawer;
