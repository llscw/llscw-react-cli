import * as React from "react";

export const HelloComponent = (props) => {
    React.useEffect(()=>{
        console.log('测试数据')
    })
  return <h2>Hello user3: {props.userName} !</h2>;
};