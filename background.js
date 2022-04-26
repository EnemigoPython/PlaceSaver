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
      const value = storageCache[req.url] || null;
      sendResponse({ value });
      console.log(value);
      break;
  }
});
