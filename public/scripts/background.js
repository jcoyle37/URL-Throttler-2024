console.log("background.js running...");
let config = undefined;

function matchRuleShort(str, rule) {
    return new RegExp(str.replace(/\*/g, "[^ ]*")).test(rule);
}

let listenerHandler;

browser.storage.onChanged.addListener(function(changes) {
    if(config === undefined) {
        if (listenerHandler) {
            browser.webRequest.onBeforeRequest.removeListener(listenerHandler);
            listenerHandler = null;
        }

        if(changes.config.newValue.extensionEnabled && changes.config.newValue.urls.length > 0) {
            listenerHandler = (info) => {
                const thisUrlConfig = changes.config.newValue.urls.filter((item) => item.urlEnabled && matchRuleShort(item.url, info.url))[0];
                if(thisUrlConfig) {
                    let delay;
                    if(thisUrlConfig.delay) {
                        delay = thisUrlConfig.delay;
                    } else {
                        delay = changes.config.newValue.defaultDelay;
                    }

                    console.log("OnBeforeRequest fired");
        
                    //delay
                    const startPoint = new Date().getTime()
                    while (new Date().getTime() - startPoint <= delay) {/* wait */}
                }

                return;
            };

            browser.webRequest.onBeforeRequest.addListener(
                listenerHandler,
                { urls: changes.config.newValue.urls.map((el) => {return el.url}) },
                ["blocking"]
            );
        }
    }

    if(changes.config.newValue.urls.length == 0) {
        console.log("No more URLs; remove req listener");
    }
    else if(JSON.stringify(config?.urls) !== JSON.stringify(changes.config.newValue.urls)) {
        console.log("Changes to URLs; todo: add or alter req listener");
    }

    config = changes.newValue;
});
