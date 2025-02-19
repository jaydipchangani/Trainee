import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

interface FormField {
  label: string;
  name: string;
  type: "text" | "email" | "password";
  placeholder: string;
  required?: boolean;
}

interface FormBuilderProps {
  title: string;
  fields: FormField[];
  submitText: string;
  onSubmit: (formData: Record<string, string>) => void;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  title,
  fields,
  submitText,
  onSubmit,
  footerText,
  footerLinkText,
  footerLinkHref,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold">{title}</h3>
              <Form onSubmit={handleSubmit}>
                {fields.map((field, index) => (
                  <Form.Group className="mb-3" key={index}>
                    <Form.Label className="fw-semibold">{field.label}</Form.Label>
                    <Form.Control
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}
                <Button type="submit" variant="primary" className="w-100 mb-3">
                  {submitText}
                </Button>
              </Form>
              {footerText && (
                <div className="text-center">
                  {footerText}{" "}
                  {footerLinkHref && (
                    <a href={footerLinkHref} className="text-decoration-none">
                      {footerLinkText}
                    </a>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
