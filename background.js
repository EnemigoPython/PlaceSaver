let url;
const storageCache = {};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  switch (req.type) {
    case "urlCheck":
      if (req.url === url) {
        sendResponse({ cached: true });
      } else {
        url = req.url;
        console.log(storageCache[url]);
        sendResponse({ value: storageCache[url], cached: false });
      }
      break;
  }
}
);

async function getAllStorageSyncData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}