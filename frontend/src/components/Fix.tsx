import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FixT1 from "./FixT1";
import FixT2 from "./FixT2";
import FixT3 from "./FixT3";
import FixT4 from "./FixT4";
import FixT5 from "./FixT5";
import FixT6 from "./FixT6";

export default function Fix() {
  const navigate = useNavigate();
  const { table } = useParams();
  const [rend, setRend] = useState(<></>);
  const [status, setStatus] = useState(0);

  if (status === 0) {
    localStorage.clear();
    setStatus(1);
  }

  function getData(tb: any) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tablename: tb,
        startpoint: 1,
        records: 250,
      }),
    };
    console.log(requestOptions);
    fetch("http://36.140.31.145:31684/error_handler/get_tmp/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("t", JSON.stringify(data.errors));
        setStatus(2);
      })
      .then(() => {
        if (localStorage.getItem("t") !== null) {
          console.log(JSON.parse(localStorage.getItem("t")));
          if (table === "物流公司") {
            setRend(<FixT1 />);
          } else if (table === "客户信息") {
            setRend(<FixT2 />);
          } else if (table === "物流信息") {
            setRend(<FixT3 />);
          } else if (table === "集装箱动态") {
            setRend(<FixT4 />);
          } else if (table === "装货表") {
            setRend(<FixT5 />);
          } else if (table === "卸货表") {
            setRend(<FixT6 />);
          } else {
            setRend(<></>);
          }
        }
      });
  }
  return (
    <>
      {status !== 2 ? getData(table) : null}
      {rend}
    </>
  );
}
