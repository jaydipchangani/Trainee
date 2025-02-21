import React from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10}>{children}</Col>
      </Row>
    </div>
  );
};

export default MainLayout;