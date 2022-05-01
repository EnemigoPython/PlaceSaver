chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "newTag":
        console.log(msg.name);
        break;
    }
  });
});
