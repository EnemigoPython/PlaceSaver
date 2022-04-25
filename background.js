chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.tagName) {
      console.log(request.tagName);
    }
    // if (request.loadTest) {
      console.log(request.url);
    // }
    // console.log("hi");
    sendResponse();
  }
);