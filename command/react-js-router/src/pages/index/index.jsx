import * as React from "react";
import { HelloComponent } from "./hello";
import { NameEditComponent } from "./nameEdit";

const Index = () => {
  const [name, setName] = React.useState("initialName");

  const setUsernameState = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <HelloComponent userName={name} />
      <NameEditComponent userName={name} onChange={setUsernameState} />
    </>
  );
};

export default Index;