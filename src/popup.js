let url;
const btn = document.getElementById('hello');
const input = document.getElementById('tagInput');
const placeTagList = document.getElementById('placeTagList');
const placeholder = document.getElementById('placeholder');
const warning = document.getElementById('warning');
const addNewTag = document.getElementById('addNewTag');

function loadPlaceTagLabels() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        try {
            url = new URL(tabs[0].url);
            url = `${url.protocol}//${url.host}${url.pathname}${url.search}`; // strip hash
        } catch (e) {
            url = tabs[0].url;
        }
        chrome.runtime.sendMessage({ type: "urlCheck", url }, (res) => {
            placeTagList.removeChild(placeholder);
            if (res.value) {

            } else {
                placeTagList.appendChild(newPlaceTagLabel("No Place Tags found."));
            }   
        });
    });
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

loadPlaceTagLabels();
