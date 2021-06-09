import "./App.css";
import {useState} from "react";

function App() {
    const [auth, setAuth] = useState("");
    const [applicationId, setApplicationId] = useState("");
    const [environmentName, setEnvironmentName] = useState("");
    const [allFlags, setAllFlags] = useState(null);

    const handleShowAll = () => {
        fetch(
            `https://x-api.rollout.io/public-api/applications/${applicationId}/${environmentName}/flags`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${auth}`,
                },
            }
        ).then((res) => {
            setAllFlags(res);
        }).catch((err) => {
                console.log(err)
            }
        );
    };

    const handleRemoveNonOriginals = () => {

        if (allFlags) {
            allFlags.filter(flag => flag.name.includes('.')).forEach(flag => {
                fetch(`https://x-api.rollout.io/public-api/applications/${applicationId}/flags/${flag.name}`, {
                    method: "DELETE",
                    headers: {
                        authorization: `Bearer ${auth}`,
                    },
                }).then(() => {
                    console.log(`flag ${flag.name} removed`)
                })
            })

            fetch(
                `https://x-api.rollout.io/public-api/applications/${applicationId}/${environmentName}/flags`,
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${auth}`,
                    },
                }
            ).then((res) => {
                setAllFlags(res);
            });
        }

    }

    const handleRemoveOneFlag = (name) => {
        fetch(`https://x-api.rollout.io/public-api/applications/${applicationId}/flags/${name}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${auth}`,
            },
        }).then(() => {
            console.log(`flag ${name} removed`)
            fetch(
                `https://x-api.rollout.io/public-api/applications/${applicationId}/${environmentName}/flags`,
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${auth}`,
                    },
                }
            ).then((res) => {
                setAllFlags(res);
            });
        }).catch(err => {
            console.log(err)
        })
    }


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
                    <input
                        type="text"
                        name={"auth"}
                        onChange={(event) => handleChange(event, "auth")}
                    />
                    <span>authorization</span>
                </label>
                <label>
                    <input
                        type="text"
                        name={"appId"}
                        onChange={(event) => handleChange(event, "appId")}
                    />
                    <span>applicationId</span>
                </label>
                <label>
                    <input
                        type="text"
                        name={"envName"}
                        onChange={(event) => handleChange(event, "envName")}
                    />
                    <span>environmentName</span>
                </label>

                <div>
                    <button onClick={handleShowAll} className={'showAllButton'}>show all flags</button>
                </div>

                {allFlags ? allFlags.map((flag) => <div className={'flags'}>
                    <div className={'flagGroup'}>
                        <div className={'flag'}>{flag.name}</div>
                        <button className={'removeFlag'} onClick={() => handleRemoveOneFlag(flag.name)}>remove</button>
                    </div>
                </div>) : null}
                <div className={'remove'}>
                    <button onClick={handleRemoveNonOriginals}>remove all flags with non-blank namespace</button>
                </div>
            </div>
        </div>
    );
}

export default App;
