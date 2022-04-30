function getAllStorageSyncData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}

const storageCache = {};
const initStorageCache = getAllStorageSyncData().then(items => {
  Object.assign(storageCache, items);
});

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  switch (req.type) {
    case "urlCheck":
      console.log(req.url)
    case "newTag":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: tabs});
      });
      break;
  }
});
