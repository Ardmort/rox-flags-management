import "./App.css";
import { useState } from "react";

function App() {
  const [auth, setAuth] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [environmentName, setEnvironmentName] = useState("");
  const [allFlags, setAllFlags] = useState([]);

  const handleShowAll = () => {
    fetch(
      `https://x-api.rollout.io/public-api/applications/${applicationId}/${environmentName}/flags`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: auth,
        },
      }
    ).then((res) => {
      console.log(res);
      setAllFlags(res.data);
    });
  };

  const handleChange = (event, type) => {
    switch (type) {
      case "auth":
        return setAuth(event.target.value);
      case "appId":
        return setApplicationId(event.target.value);
      case "envName":
        return setEnvironmentName(event.target.value);
      default:
        return;
    }
  };

  return (
    <div className="App">
      <h1>Rox flags management dashboard</h1>
      <div className={"getFlags"}>
        <label>
          <span>authorization</span>
          <input
            type="text"
            name={"auth"}
            onChange={(event) => handleChange(event, "auth")}
          />
        </label>
        <label>
          <span>applicationId</span>
          <input
            type="text"
            name={"appId"}
            onChange={(event) => handleChange(event, "appId")}
          />
        </label>
        <label>
          <span>environmentName</span>
          <input
            type="text"
            name={"envName"}
            onChange={(event) => handleChange(event, "envName")}
          />
        </label>

        <button onClick={handleShowAll}>show all flags</button>

        {allFlags.length && allFlags.map((flag) => <div>{flag.name}</div>)}
      </div>
    </div>
  );
}

export default App;
