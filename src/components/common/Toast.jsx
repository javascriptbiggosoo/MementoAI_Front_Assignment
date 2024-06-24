import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Toast = ({ message, show }) => {
  return ReactDOM.createPortal(
    <ToastStyle show={show.toString()}>{message}</ToastStyle>,
    document.getElementById("root")
  );
};

const ToastStyle = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: opacity 0.3s ease-in-out;
`;

export default Toast;
