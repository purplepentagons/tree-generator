function convertIDToKey(id) {
    return id.split("-")[0] + id.split("-")[1][0].toUpperCase() + id.split("-")[1].slice(1);
}

function convertKeyToID(key) {
    let split = key.split(/([A-Z])/);
    return `${split[0]}-${split[1].toLowerCase()}${split[2]}`;
}

function updateNumber(key) {
    const id = convertKeyToID(key);
    number = document.querySelector(`input[type=\"number\"]#${id}`);
    number.value = settings[key];
}

function updateSettingsValue(id, value) {
    settings[id] = value;
}

function addSettingListener(input, settingKey, populating = true) {
    input.addEventListener("input", (e) => {
        updateSettingsValue(settingKey, e.target.value);
        updateNumber(settingKey);
        if (populating) {
            populate();
        }
    });
}

function addPlantSettingSliders(
    settings,
    settingsParent = document.querySelector(".plant-settings")
) {
    for (const [settingName, setting] of Object.entries(settings)) {
        if (setting.defaultValue === undefined) {
            const settingsContainer = document.createElement("div");
            settingsContainer.classList.add(`settings-${settingName}`);
            settingsParent.appendChild(settingsContainer);

            addPlantSettingSliders(setting, settingsContainer);
            continue;
        }

        updateSettingsValue(settingName, setting.defaultValue);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = setting.min;
        slider.max = setting.max;
        slider.value = String(setting.defaultValue);
        slider.id = convertKeyToID(settingName);
        slider.step = setting.step ? setting.step : 1;
        addSettingListener(slider, settingName, setting.populating);

        const number = document.createElement("input");
        number.type = "number";
        number.min = setting.min;
        number.max = setting.max;
        number.value = String(setting.defaultValue);
        number.id = convertKeyToID(settingName);
        number.classList.add("value");
        number.step = setting.step ? setting.step : 1;
        addSettingListener(number, settingName, setting.populating);

        const label = document.createElement("label");
        label.for = convertKeyToID(settingName);
        label.innerText = setting.labelName;

        const settingContainer = document.createElement("div");
        settingContainer.classList.add("setting");
        const inputContainer = document.createElement("div");

        inputContainer.appendChild(slider);
        inputContainer.appendChild(number);
        settingContainer.appendChild(label);
        settingContainer.appendChild(inputContainer)

        settingsParent.appendChild(settingContainer);
    }
}

addEventListener("DOMContentLoaded", () => {
    globalThis.settings = {};

    settingsConfig = {
        children: {
            minimumChildren: {
                min: 0,
                max: 8,
                defaultValue: 1,
                labelName: "Minimum Branches"
            },
            maximumChildren: {
                min: 0,
                max: 8,
                defaultValue: 3,
                labelName: "Additional Branches"
            },

            length: {
                minimumLength: {
                    min: 0,
                    max: 400,
                    defaultValue: 80,
                    labelName: "Minimum Length"
                },
                maximumLength: {
                    min: 0,
                    max: 400,
                    defaultValue: 320,
                    labelName: "Additional Length"
                }
            }
        },

        rotation: {
            rotationScale: {
                min: 0,
                max: 10,
                defaultValue: 3,
                labelName: "Rotation Scale",
                step: 0.01,
                populating: false
            },
            rotationSpeed: {
                min: 0,
                max: 3,
                defaultValue: 0.5,
                labelName: "Rotation Speed",
                step: 0.01,
                populating: false
            }
        },

        tree: {
            treeDepth: {
                min: 1,
                max: 10,
                defaultValue: 5,
                labelName: "Tree Depth"
            },
            treeShape: {
                treeCurvature: {
                    min: 0,
                    max: 2,
                    defaultValue: 0,
                    labelName: "Tree Curvature",
                    step: 0.01
                },
                treeNarrowness: {
                    min: 0,
                    max: 10,
                    defaultValue: 1,
                    labelName: "Tree Narrowness",
                    step: 0.01
                },
                treeVariance: {
                    min: 0,
                    max: 1,
                    defaultValue: 0.5,
                    labelName: "Branch Messiness",
                    step: 0.01
                },
            }
        }
    }

    addPlantSettingSliders(settingsConfig);
})

function randomInteger(size) {
    return Math.floor(Math.random()*(size+1))
}

globalThis.childAmountFunction = (depth) => {
    return Number(settings.minimumChildren) + randomInteger(Number(settings.maximumChildren));
    // return 2;
}

globalThis.angleFunction = (angle, branchNumber, depth) => {
        // return angle + branchNumber*45/(11 - depth);
        return (angle*(1 - Number(settings.treeCurvature)*0.5)) + (Math.random()*150*(settings.treeVariance) + 150*(1 - settings.treeVariance)  - 75)/((depth + 2)*Number(settings.treeNarrowness));
        // return angle + branchNumber*15 - 15 + 2
}

globalThis.sizeFunction = () => {
    return Number(settings.minimumLength) + randomInteger(Number(settings.maximumLength))
}