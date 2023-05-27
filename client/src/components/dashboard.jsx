import React, { useEffect, useState } from "react";
import { postToNodeServer } from "../utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      const res = await postToNodeServer("/checkSession", {});
      if (res.sessionActive === false) navigate("/login");
      else setSessionActive(res.sessionActive);
    };
    checkSession();
  });
  return sessionActive ? <div>this is dashboard</div> : <h2>Loading</h2>;
}
