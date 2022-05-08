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
const confirmText = document.getElementById('confirmText');


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
    confirmText.innerText = text;
    confirmText.style.opacity = 1;
    console.log('hi');
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
    saveBtn.addEventListener('click', (e) => {
        const newStyle = {
            highlight: colourPicker.value,
            visible: displayHighlight.checked,
            altTitle: displayAltTitle.checked
        };
        if (newStyle != defaultStyle) {
            chrome.storage.sync.set({ style: newStyle }, () => {
                showConfirmation("Options saved.");
            });
        }
        e.preventDefault();
    });
    clearBtn.addEventListener('click', (e) => {
        chrome.storage.sync.clear();
        showConfirmation("Data cleared.");
        e.preventDefault();
    });
    resetBtn.addEventListener('click', (e) => {
        chrome.storage.sync.set({ style: defaultStyle }, () => {
            showConfirmation("Options restored to default.");
            setFormValues(defaultStyle);
        });
        e.preventDefault();
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
