let url;

chrome.runtime.onMessage.addListener(
  (request, _sender, sendResponse) => {
    if (request.url !== url) {
      url = request.url;
      console.log(url);
    }
    sendResponse();
  }
);