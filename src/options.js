const url_select = document.getElementById('url-selector');

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

(async () => {
    const storage = Object.keys(await getAllStorage())
        .filter(key => key !== 'style');
    storage.forEach(item => {
        createSelectValue(item);
    });

    url_select.onchange = openNewTab;
})();