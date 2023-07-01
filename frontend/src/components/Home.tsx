import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { Button } from "@mui/material";

export default function Home() {
  const columns = [
    ["客户名称", "客户编号", "手机号", "省市区"],
    ["客户名称", "客户编号", "手机号", "省市区"],
  ];
  const [checked, setChecked] = useState(Array(columns[0].length).fill(1));
  function handleChange(e: any) {
    console.log(e.target.id);
    let tmp = checked;
    tmp[Number(e.target.id)] === 0
      ? (tmp[Number(e.target.id)] = 1)
      : (tmp[Number(e.target.id)] = 0);
    setChecked(tmp);
    console.log(checked);
  }
  function handleSubmit() {
    let tmp: string[] = [];
    for (let c in checked) {
      if (checked[c] === 0) {
        tmp.push(columns[0][c]);
      }
    }
    console.log(tmp);
  }

  return (
    <>
      <FormGroup>
        {columns[0].map((item: string, index) => (
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                id={index.toString()}
                onChange={handleChange}
              />
            }
            label={item}
          />
        ))}
      </FormGroup>
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
}
