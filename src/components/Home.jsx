import React, { useEffect, useState } from 'react';

const Home = () => {
    const [config, setConfig] = useState();

    //on init
    useEffect(async () => {
        let storedConfig = await browser.storage.local.get("config");

        if (!storedConfig.config || Object.keys(storedConfig.config).length === 0) { //if no config, fall back to default
            setConfig({
                extensionEnabled: false,
                defaultDelay: 2500,
                urls: []
            });
        } else {
            setConfig(storedConfig.config);
        }
    }, []);

    useEffect(() => {
        if(config) {
            browser.storage.local
                .set({"config": config})
                .then(
                    () => {
                        console.log("successfully stored config in localstorage", config);
                    },
                    (err) => {
                        console.error("Error when writing to local storage", err);
                    });
        }
    }, [config]);

    function handleInputChange(evt, urlIndex = null) {
        let newConfig = structuredClone(config);

        if(evt.target.id == "extensionEnabledChkbx")
            newConfig.extensionEnabled = evt.target.checked;
        else if(evt.target.id == "defaultDelayInput")
            newConfig.defaultDelay = parseInt(evt.target.value);
        else if(evt.target.className == "urlEnabledChkbx")
            newConfig.urls[urlIndex].urlEnabled = evt.target.checked;
        else if(evt.target.className == "urlDelayInput")
            newConfig.urls[urlIndex].delay = parseInt(evt.target.value);
        else if(evt.target.className == "urlInput")
            newConfig.urls[urlIndex].url = evt.target.value;

        if(newConfig !== config) setConfig(newConfig);
    }

    function handleRemoveUrl(index) {
        let newConfig = structuredClone(config);
        newConfig.urls.splice(index, 1);
        if(newConfig !== config) setConfig(newConfig);
    }

    function handleAddUrl(index) {
        let newConfig = structuredClone(config);

        newConfig.urls[newConfig.urls.length] = {
            urlEnabled: false,
            delay: null,
            url: null
        };
        
        if(newConfig !== config) setConfig(newConfig);
    }

    async function handleCopyConfig() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(config));
        } catch (error) {
            alert("Error copying config to clipboard. See console output for details.");
            console.error(error.message);
            return;
        }

        alert("Configuration successfully copied to clipboard.");
    }

    function handleApplyConfig() {
        let pastedConfigValue = prompt("Please paste a copied config value:");

        if (pastedConfigValue != null) {
            setConfig(JSON.parse(pastedConfigValue));
        }
    }

    if(config === undefined) return <em>Loading...</em>; 
    else return (
        <>
            <input
                id="extensionEnabledChkbx"
                type="checkbox"
                onChange={handleInputChange}
                checked={config.extensionEnabled}
            />
            <label for="extensionEnabledChkbx"> Enabled</label>
            <br />
            <label for="extensionEnabledChkbx">Default Delay (ms): </label>
            <input
                id="defaultDelayInput"
                type="number"
                onChange={handleInputChange}
                placeholder={2500}
                min={"0"}
                max={"60000"}
                value={config.defaultDelay}
            />
            <hr/>
            <div>
                URLs must use the <a href="https://developer.chrome.com/docs/extensions/mv2/match_patterns/" target="_blank">Match Pattern</a> syntax, as in the following examples:<br/>
                <p>
                    <code>http://127.0.0.1/*</code><br/>
                    <code>*://*/api/foo</code>
                </p>
            </div>
            {config.urls.length > 0 &&
                <table>
                    <thead>
                        <th>Enabled</th>
                        <th>Delay (in ms)</th>
                        <th>URL</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {
                            config.urls.map((url, i) => {
                                return (
                                    <tr id={`url-config-row-${i}`}>
                                        <td>
                                            <input
                                                className="urlEnabledChkbx"
                                                type="checkbox"
                                                onChange={(evt) => handleInputChange(evt, i)}
                                                checked={config.urls[i].urlEnabled}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="urlDelayInput"
                                                type="number"
                                                onChange={(evt) => handleInputChange(evt, i)}
                                                placeholder={config.defaultDelay}
                                                min={"0"}
                                                max={"60000"}
                                                value={config.urls[i].delay}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="urlInput"
                                                type="text"
                                                onChange={(evt) => handleInputChange(evt, i)}
                                                placeholder={"https://foo.bar/api/count"}
                                                value={config.urls[i].url}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleRemoveUrl(i)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            }
            <button onClick={() => handleAddUrl()}>
                + Add URL
            </button>
            <hr />
            <button
                onClick={() => handleCopyConfig()}
                style={{marginRight: "3px"}}
            >
                Export Config to Clipboard
            </button>
            <button onClick={() => handleApplyConfig()}>
                Import Config
            </button>
        </>
    );
}

export default Home