const btn = document.getElementById('hello');
const input = document.getElementById('tagInput');
const placeTagList = document.getElementById('placeTagList');
const placeholder = document.getElementById('placeholder');
const warning = document.getElementById('warning');
const addNewTag = document.getElementById('addNewTag');

function getURL() {
    let url;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        try {
            url = new URL(tabs[0].url);
            url = `${url.protocol}//${url.host}${url.pathname}${url.search}`; // strip hash
        } catch (e) {
            url = tabs[0].url;
        }
    });
    return url;
}

async function getStorage(key) {
    return new Promise ((resolve, reject) => {
        chrome.storage.sync.get(key, (valueObj) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // the return value is an object but we are only querying one value
            resolve(valueObj[key] ?? null);
        });
    });
}

function loadPlaceTags(urlData) {
    placeTagList.removeChild(placeholder);
    if (urlData) {
        placeTagList.appendChild(newPlaceTagLabel(urlData));
    } else {
        placeTagList.appendChild(newPlaceTagLabel("No Place Tags found."));
    }
}

function newPlaceTagLabel(name) {
    const placeTagLabel = document.createElement("li");
    const text = document.createTextNode(name);
    placeTagLabel.appendChild(text);
    placeTagLabel.className = "placeTagLabel";
    return placeTagLabel;
}

addNewTag.addEventListener('submit', (e) => {
    const name = input.value;
    if (name) {
        // this isn't going to be synchronous so don't expect anything back immediately
        chrome.runtime.sendMessage({ type: "newTag", name });
    } else {
        warning.innerText = "Place Tag name cannot be blank."
        warning.style.visibility = "visible";
    }
    e.preventDefault();
});

// anonymous async function to call await
(async () => {
    const url = getURL();
    const urlData = await getStorage(url);
    loadPlaceTags(urlData);
})();
