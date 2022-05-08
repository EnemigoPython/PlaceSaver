//// HTML elements ////
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
    clearBtn.addEventListener('click', () => {
        chrome.storage.sync.clear();
    });
}

(async () => {
    const storage = await getAllStorage();
    const style = storage.style;
    const savedUrls = Object.keys(storage)
        .filter(key => key !== 'style');
    savedUrls.forEach(item => createSelectValue(item));

    url_select.onchange = openNewTab;
    listenForButtons();
})();