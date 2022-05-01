chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "addTag":
        console.log(msg.name);
        console.log(window.getSelection().toString());
        break;
    }
  });
});
