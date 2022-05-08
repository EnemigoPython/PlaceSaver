//// globals ////
const defaultStyle = {
    highlight: "#FFFF00",
    altTitle: false,
    visible: true
} 

//// HTML elements ////
const colourPicker = document.getElementById('colourPicker');
const displayHighlight = document.getElementById('displayHighlight');
const displayAltTitle = document.getElementById('displayAltTitle');
const urlSelect = document.getElementById('urlSelect');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn')
const clearBtn = document.getElementById('clearBtn');


async function getAllStorage() {
    return new Promise ((resolve, reject) => {
        chrome.storage.sync.get(null, (valueObj) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // return the entire object
            resolve(valueObj);
        });
    });
}

function setFormValues(style) {
    colourPicker.value = style.highlight;
    displayHighlight.checked = style.visible;
    displayAltTitle.checked = style.altTitle;
}

function showConfirmation(text) {

}

function createSelectValue(value) {
    const option = document.createElement('option');
    option.innerText = value;
    option.value = value;
    urlSelect.appendChild(option);
}

function openNewTab() {
    chrome.tabs.create({
        url: urlSelect.value
    });
}

function listenForButtons() {
    saveBtn.addEventListener('click', () => {
        const newStyle = {
            highlight: colourPicker.value,
            visible: displayHighlight.checked,
            altTitle: displayAltTitle.checked
        };
        chrome.storage.sync.set({ style: newStyle }, () => {
            showConfirmation("");
        });
    });
    clearBtn.addEventListener('click', () => {
        chrome.storage.sync.clear();
    });
    resetBtn.addEventListener('click', () => {
        chrome.storage.sync.set({ style: defaultStyle });
    });
}

(async () => {
    const storage = await getAllStorage();
    setFormValues(storage.style);
    const savedUrls = Object.keys(storage)
        .filter(key => key !== 'style');
    savedUrls.forEach(item => createSelectValue(item));

    urlSelect.onchange = openNewTab;
    listenForButtons();
})();
