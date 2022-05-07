//// globals ////
const lastTag = {}; // properties of last referenced tag
let portMessage; // to avoid chaining return values for a synchronous response on port


function generateId() {
  let id = ''
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      id += chars[idx];
  }
  return id;
}

function getTreeRef(rangeRef) {
  const nodeTreeRecurse = (node, idx, rangeIdx) => {
      let incrRange = false;
      const posArr = [];
      if (node.parentNode.className === 'placeTagHighlight') {
          node = node.parentNode.previousSibling;
          rangeRef.rangeIndices[rangeIdx] += node.textContent.length;
      }
      // we find an ID to hook onto, and it isn't the span we created
      if (node.id) {
          posArr.push(idx, node.id);
          return posArr;
      }

      let previousSibling = node.previousSibling;
      if (previousSibling && previousSibling.className === 'placeTagHighlight') {
              rangeRef.rangeIndices[rangeIdx] += previousSibling.textContent.length;
              previousSibling = previousSibling.previousSibling;
              idx--;
              incrRange = true;
      }
      if (previousSibling) {
          if (incrRange) {
              rangeRef.rangeIndices[rangeIdx] += previousSibling.textContent.length;
          }
          posArr.push(...nodeTreeRecurse(previousSibling, idx+1, rangeIdx));
          return posArr;
      }
      posArr.push(idx); 
      const parent = node.parentNode;
      // we will stop zooming out if we hit the body, else continue searching
      if (parent.nodeName !== 'BODY') {
          posArr.push(...nodeTreeRecurse(parent, 0, rangeIdx));
      }
      // we hit the body without finding an ID, so end at the body
      return posArr;
  }
  const startPos = nodeTreeRecurse(rangeRef.startNode, 0, 0).reverse();
  const endPos = nodeTreeRecurse(rangeRef.endNode, 0, 1).reverse();
  return { 
      startPos, 
      endPos, 
      rangeIndices: rangeRef.rangeIndices
  };
}

function tagFromSelection(selection) {
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
  const rangeRef = {
    rangeIndices: [range.startOffset, range.endOffset], 
    startNode: range.startContainer, 
    endNode: range.endContainer
  }
  const treeRef = getTreeRef(rangeRef);

  createTag(range);
  selection.removeAllRanges();

  // returns the treeRef for the storage object
  return treeRef;
}

function removeOldTag() {
  if (lastTag.id) {
      let oldSpan = document.getElementById(lastTag.id);
      oldSpan.outerHTML = oldSpan.innerHTML;
      // when the old and new span overlap, a new tag is created at the intersection and so
      // the span lives on parasitically. By checking twice, we eliminate this case.
      oldSpan = document.getElementById(lastTag.id);
      if (oldSpan) {
          oldSpan.outerHTML = oldSpan.innerHTML;
      }
  }
}

function scrollTo(span) {
  span.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

function createTag(range) {
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

  scrollTo(span);
  lastTag.id = id;
}

function nodeFromPosArr(posArr) {
  let node;
  // if the first element is a string, it's an ID
  if (typeof posArr[0] === 'string') {
      node = document.getElementById(posArr[0]);
      if (!node) {
        portMessage = {
          type: "viewRes",
          text: "Root node does not exist."
        }
        return;
      }
  } else {
      node = document.body.firstChild;
      // we start the walk at the second element, so insert an element at pos 0
      posArr.unshift('BODY');
  }
  posArr.slice(1).forEach((sibling, idx) => {
      for (let i = 0; i < sibling; i++) {
          node = node.nextSibling;
          if (!node) {
            portMessage = {
              type: "viewRes",
              text: "Document structure has changed."
            }
            return;
          }
      }
      // until we reach the last element, we want to keep zooming in
      if (idx + 2 < posArr.length) {
          node = node.firstChild;
          if (!node) {
            portMessage = {
              type: "viewRes",
              text: "Document structure has changed."
            }
            return;
          }
      }
  });
  return node;
}

function tagFromTreeRef(treeRef) {
  const startNode = nodeFromPosArr(treeRef['startPos']);
  const endNode = nodeFromPosArr(treeRef['endPos']);
  if (!startNode || !endNode) return;
  const rangeVals = treeRef['rangeIndices'];
  const range = document.createRange();
  range.setStart(startNode, rangeVals[0]);
  range.setEnd(endNode, rangeVals[1]);
  createTag(range);
}

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "addTag":
        const currentSelection = window.getSelection();
        if (currentSelection.toString()) {
          const treeRef = tagFromSelection(currentSelection);
          // console.log(treeRef);
          // const size = new TextEncoder().encode(JSON.stringify(treeRef)).length;
          // console.log(size);
          lastTag.name = msg.name;
          port.postMessage({
            type: "addRes",
            success: true,
            treeRef,
            name: msg.name
          });
        } else {
          port.postMessage({ 
            type: "addRes", 
            success: false, 
            text: "No selection on the page." 
          });
        }
        break;
      case "viewTag":
        // console.log(msg.name);
        if (msg.name === lastTag.name) {
          const tag = document.getElementById(lastTag.id);
          if (!tag) {
            port.postMessage({
              type: "viewRes",
              text: "The tag is not present on the page."
            });
            break;
          }
          scrollTo(tag);
        } else {
          const treeRef = msg.treeRef;
          // console.log(treeRef);
          tagFromTreeRef(treeRef);
          if (portMessage) {
            port.postMessage({...portMessage, success: false});
            portMessage = null;
          } else {
            lastTag.name = msg.name;
            port.postMessage({
              type: "viewRes",
              success: true,
            });
          }
        }
        break;
      case "clearTag":
        removeOldTag();
        Object.keys(lastTag).forEach(key => delete lastTag[key]);
        break;
    }
  });
});
