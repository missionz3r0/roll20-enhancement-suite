
// TODO : @HACK dedupe, this is taken straight from globals.js
function createElement(type, _attributes, children, parent) {
    let elem = document.createElement(type);
    const attributes = _attributes || {};

    let isEvent = (what) => what.startsWith("on");
    let getEventName = (what) => what.substring(2).toLowerCase();

    function recursiveAddChildren(ch) {
        for (let child of ch) {
            if(!child) continue;
            if (typeof (child) === "function") {
                recursiveAddChildren(child());
            } else {
                elem.appendChild(child);
            }
        }
    }

    if (children) {
        recursiveAddChildren(children);
    }

    for (let attribId in attributes) {
        let val = attributes[attribId];

        if (attribId === "innerHTML") {
            elem.innerHTML = val;
        } else if(attribId === "value") {
            elem.value = val;
        } else if(attribId === "checked") {
            elem.checked = val;
        } else if (attribId === "style") {
            for (let elemId in val) {
                elem.style[elemId] = val[elemId];
            }
        } else if (attribId === "className") {
            if (typeof (val) === "object" && "length" in val) {
                for (let className of val) {
                    elem.classList.add(className);
                }
            } else {
                elem.className = val;
            }
        } else if (isEvent(attribId)) {
            elem.addEventListener(getEventName(attribId), val);
        } else {
            elem.setAttribute(attribId, val);
        }
    }

    if (parent) {
        parent.appendChild(elem);
    }

    return elem;
}

var sending = browser.runtime.sendMessage(null, {
    background: { type: "get_hooks" }
});

function notifyBackendOfHookMutation(hook, id) {
    console.log("Popup is notifying backend of hook config mutation!");

    browser.runtime.sendMessage(null, {
        background: {
            type: "update_hook_config",
            hookId: id,
            config: hook.config
        }
    });
}

function mapObj(obj, fx) {
    return Object.keys(obj).reduce((accum, curVal) => {
        let val = fx(obj[curVal], curVal);

        if (val !== undefined && val !== null) {
            accum.push(val);
        }

        return accum;
    }, []);
}

function drawConfig(hook, id) {
    if (!hook.configView) return null;

    return createElement("div", null, [
        () => mapObj(hook.configView, (cfgView, cfgId) => {
            let inputElement = null;

            if (cfgId === "enabled") {
                return null;
            }
            if (cfgView.type === "string") {
                inputElement = createElement("input", {
                    type: "text",
                    value: hook.config[cfgId] || "",
                    onChange: (e) => {
                        hook.config[cfgId] = e.target.value;
                    }
                });

            } else if (cfgView.type === "dropdown") {
                inputElement = createElement("select", {
                    onChange: (e) => { hook.config[cfgId] = e.target.value; },
                    value: console.log(hook.config[cfgId]) || hook.config[cfgId]
                }, mapObj(cfgView.dropdownValues, (disp, val) => createElement("option", { value: val, innerHTML: disp })));
            } else if(cfgView.type === "checkbox") {
                inputElement = createElement("input", {
                    onChange: e => { hook.config[cfgId] = e.target.checked; },
                    type: "checkbox",
                    checked: hook.config[cfgId]
                })
            } else {
                alert(`Unknown config type: ${cfgView.type}`);
                return null;
            }

            return createElement("setting", null, [
                createElement("span", { innerHTML: cfgView.display }),
                inputElement
            ]);
        }),

        createElement("button", {
            innerHTML: "Save",
            onClick: _ => { notifyBackendOfHookMutation(hook, id); }
        })
    ]);
}

function drawSettings(hook, id) {
    return createElement("div", {
        id: id,
        className: "settings",
    },
        [
            createElement("p", { innerHTML: hook.description }),
            drawConfig(hook, id)
        ]
    );
}

function hideSettings(parent, hook, id) {
    let root = document.getElementById(id);
    if (!root) return false;

    root.remove();
    return true;
}

function drawHooks(hooks) {
    let root = document.getElementById("root");

    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

    let byCategory = {};
    for (let key in hooks) {
        let hook = hooks[key];
        if (hook.force) continue;

        if (!(hook.category in byCategory))
            byCategory[hook.category] = [];

        byCategory[hook.category].push(key);
    }

    createElement("div", null, mapObj(byCategory, (bucket, categoryName) => {
        return createElement("div", {className: "category"}, [
            createElement("h3", { innerHTML: categoryName }),
            createElement("ul", null, bucket.filter(el => !el.force).map(hookId => {
                const hook = hooks[hookId];

                return createElement("hook", {
                    onMouseEnter: e => e.target.classList.add("selected-item"),
                    onMouseLeave: e => e.target.classList.remove("selected-item")
                }, [
                        createElement("div", { className: "contents" }, [

                            createElement("input", {
                                type: "checkbox",
                                checked: hook.config.enabled,
                                onClick: e => {
                                    hook.config.enabled = e.target.checked;
                                    notifyBackendOfHookMutation(hook, hookId);
                                }
                            }),
                            createElement("span", {
                                onClick: e => {
                                    const contents = e.target.parentNode;
                                    if(contents.tagName.toLowerCase() !== "span") return;
                                    
                                    if (!hideSettings(contents, hook, hookId)) {
                                        contents.appendChild(drawSettings(hook, hookId));
                                    }
                                }
                            }, [
                                    createElement("span", { innerHTML: hook.name }),
                                    createElement("span", {
                                        className: "icon-span",
                                        innerHTML: hook.gmOnly ? "GM Only ▼" : "▼"
                                    })
                                ])

                        ])
                    ]);
            })),
        
            createElement("hr"),
        ]);
    }), root);
}

browser.runtime.onMessage.addListener((msg) => {
    if (msg.popup && msg.popup.type === "receive_hooks") {
        drawHooks(msg.popup.hooks);
    }
});