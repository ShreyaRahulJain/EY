import React from "react";

const SimpleManagerTest = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "lightblue", minHeight: "100vh" }}>
      <h1>Manager Test Page</h1>
      <p>If you can see this, the routing is working.</p>
      <button onClick={() => alert("Button works!")}>Test Button</button>
    </div>
  );
};

export default SimpleManagerTest;
