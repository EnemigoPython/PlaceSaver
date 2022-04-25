document.addEventListener('DOMContentLoaded', () => {
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {greeting: tabs});
    // });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const url = tabs[0].url;
        if (!url.startsWith("chrome")) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: tabs[0].url});
        }
        // chrome.runtime.sendMessage({url: tabs[0].url});
        // chrome.runtime.sendMessage({url: "a"});
    });
});

// chrome.runtime.sendMessage({loadTest: "hi"}, (res) => {

// });


function loadPlaceTags() {

}

const btn = document.getElementById('hello');
const input = document.getElementById('tagInput');

btn.style.backgroundColor = 'yellow';

btn.addEventListener('click', () => {
    const value = input.value;
    btn.style.backgroundColor = 'green';
    chrome.runtime.sendMessage({tagName: value}, function(response) {
        // chrome.extension.getBackgroundPage().console.log("response.farewell");
    });
});