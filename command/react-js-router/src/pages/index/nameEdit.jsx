import * as React from "react";

export const NameEditComponent = (props) => (
  <>
    <label>Update name:</label>
    <input value={props.userName} onChange={props.onChange} />
  </>
);