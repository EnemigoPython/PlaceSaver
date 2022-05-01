// globals
let currentSelection;

function createTag() {

}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "addTag":
        currentSelection = window.getSelection();
        if (currentSelection.toString()) {

        } else {
          port.postMessage({ 
            type: "loadRes", 
            success: false, 
            text: "No selection on the page." 
          });
        }
        break;
    }
  });
});
