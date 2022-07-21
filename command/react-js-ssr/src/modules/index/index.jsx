import React, { useState } from "react";
import { HelloComponent } from "./hello";
import { NameEditComponent } from "./nameEdit";
import useStyles from 'isomorphic-style-loader/useStyles'
import s from './style.css';

const Index = () => {
  useStyles(s)
  const [name, setName] = useState("initialName");

  const setUsernameState = (event) => {
    console.log('测试数据')
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