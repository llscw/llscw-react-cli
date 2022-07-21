import React from "react";

export const NameEditComponent = (props) => (
  <>
    <label className="name-label">Update name11122:</label>
    <input value={props.userName} onChange={props.onChange} />
  </>
);