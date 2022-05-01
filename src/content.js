const popupPort = chrome.runtime.connect();
console.log("hi");

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.test) {
      console.log(msg.test);
    }
  });
});
