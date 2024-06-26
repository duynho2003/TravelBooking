import { Row } from "antd";
import React from "react";

export default function Loading() {
  return (
    <Row
      style={{
        width: "100%",
        height: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span className="loader"></span>
    </Row>
  );
}
