// const popupPort = chrome.runtime.connect();
console.log("hi");

// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((msg) => {
//     if (msg.test) {
//       console.log(msg.test);
//     }
//   });
// });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    sendResponse({farewell: "goodbye"});
  }
);
