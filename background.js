//// global //// 
const defaultStyle = {
    highlight: "#ffff00",
    altTitle: false,
    visible: true
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('style', (res) => {
        // the onInstalled listener will fire on any update, so we only want to
        // set styles to default if none already exist.
        const noExistingStyle = !Object.keys(res).length;
        if (noExistingStyle) {
            chrome.storage.sync.set({ style: defaultStyle });
        }
    });
});