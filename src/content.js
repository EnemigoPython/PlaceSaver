// globals
let oldId;


function generateId() {
  let id = ''
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 16; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      id += chars[idx];
  }
  return id;
}

function createTagFromSelection(selection) {
  // a span can't wrap multiple lines, so we need to find the first newline to set
  // the selection extent to.
  const spanFragments = selection.toString().split(/\n|\s{2}/);
  let spanOffset;
  if (spanFragments.length > 1) {
      // check if the user dragged up or down the page; get the first fragment in each case
      if (selection.focusNode.compareDocumentPosition(selection.anchorNode) & 
      Node.DOCUMENT_POSITION_PRECEDING) {
          spanOffset = selection.anchorOffset + spanFragments[0].length;
      } else {
          const idx = spanFragments.length - 1;
          spanOffset = selection.anchorOffset - spanFragments[idx].length;
      }
      selection.setBaseAndExtent(
          selection.anchorNode, 
          selection.anchorOffset, 
          selection.anchorNode, 
          spanOffset
      );
  }

  const range = selection.getRangeAt(0);
  createTag(range);
  selection.removeAllRanges();
}

function removeOldTag() {
  if (oldId) {
      let oldSpan = document.getElementById(oldId);
      oldSpan.outerHTML = oldSpan.innerHTML;
      // when the old and new span overlap, a new tag is created at the intersection and so
      // the span lives on parasitically. By checking twice, we eliminate this case.
      oldSpan = document.getElementById(oldId);
      if (oldSpan) {
          oldSpan.outerHTML = oldSpan.innerHTML;
      }
  }
}

function createTag(range) {
  const rangeVals = {
      rangeIndices: [range.startOffset, range.endOffset], 
      startNode: range.startContainer, 
      endNode: range.endContainer
  }
  // saveRange(rangeVals);
  let span = document.createElement("span");

  const id = generateId();
  span.setAttribute("id", id);
  span.setAttribute("class", "placeTagHighlight");
  span.appendChild(range.extractContents());

  range.insertNode(span);
  removeOldTag();

  // the span we had before is cached and the node still believes the old span exists
  // (not good!) Get the span again to change it's mind
  span = document.getElementById(id);

  span.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  oldId = id;
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "addTag":
        const currentSelection = window.getSelection();
        if (currentSelection.toString()) {
          createTagFromSelection(currentSelection);
        } else {
          port.postMessage({ 
            type: "addRes", 
            success: false, 
            text: "No selection on the page." 
          });
        }
        break;
      case "viewTag":
        break;
    }
  });
});
