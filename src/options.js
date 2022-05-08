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
const url_select = document.getElementById('url-selector');
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
    displayHighlight.value = style.value;
    displayAltTitle.value = style.value;
}

function createSelectValue(value) {
    const option = document.createElement('option');
    option.innerText = value;
    option.value = value;
    url_select.appendChild(option);
}

function openNewTab() {
    chrome.tabs.create({
        url: url_select.value
    });
}

function listenForButtons() {
    submitBtn.addEventListener('click', () => {

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

    url_select.onchange = openNewTab;
    listenForButtons();
})();
