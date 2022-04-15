
const buttonEl = document.getElementById('btn');

let oldId;


buttonEl.addEventListener('click', highlightFromSelection);


function generateId() {
    let id = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 16; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        id += chars[idx];
    }
    return id;
}

function getNodeTreePosition(node) {
    const nodeTreeRecurse = (node, idx=0) => {
        // console.log(node);
        const posArr = [];
        // we find an ID to hook onto, and it isn't the span we created
        if (node.id && idx >= 0) {
            if (idx > 0) posArr.push(idx);
            posArr.push(node.id);
            return posArr;
        }

        const previousSibling = node.previousSibling;
        if (previousSibling) {
           
            posArr.push(...nodeTreeRecurse(previousSibling, idx+1));
            return posArr;
        }
        // posArr.push(idx < 0 ? 0 : idx);
        posArr.push(idx); 
        const parent = node.parentNode;
        // we will stop zooming out if we hit the body, else continue searching
        if (parent.nodeName !== 'BODY') {
            posArr.push(...nodeTreeRecurse(parent));
        }
        // we hit the body without finding an ID, so end at the body
        return posArr;
    }

    return nodeTreeRecurse(node, -1).reverse();
}

function nodeFromPosition(posArr) {
    let nodeRes;
    // if the first element is a string, it's an ID
    if (typeof posArr[0] === 'string') {
        nodeRes = document.getElementById(posArr[0]);
    } else {
        nodeRes = document.body.firstChild;
        // we start the walk at the second element, so insert an element at pos 0
        posArr.unshift('BODY');
    }
    posArr.slice(1).forEach((sibling, idx) => {
        for (let i = 0; i < sibling; i++) {
            nodeRes = nodeRes.nextSibling;
        }
        // until we reach the last element, we want to keep zooming in
        if (idx + 2 < posArr.length) {
            nodeRes = nodeRes.firstChild;
        }
    });

    return nodeRes;
}

function highlightFromSelection() {
    const selection = window.getSelection();
    if (!selection) return;

    // a span can't wrap multiple lines, so we need to find the first newline to set
    // the selection extent to.
    const spanFragments = selection.toString().split(/\n|\s{2}/);
    let spanOffset;
    if (spanFragments.length > 1) {
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
    createHighlightedSpan(range);
    selection.removeAllRanges();
}

function createHighlightedSpan(range) {
    const rangeVals = [range.startOffset, range.toString().length + range.startOffset];
    console.log(rangeVals);
    console.log(range);
    const span = document.createElement("span");

    const id = generateId();
    span.setAttribute("id", id);
    span.setAttribute("class", "placeSaverHighlight");
    span.appendChild(range.extractContents());

    range.insertNode(span);
    removeOldSpan();
    const treePos = getNodeTreePosition(span);
    console.log(treePos);
    const selectionObj = {

    }
    const lastPos = JSON.parse(localStorage.getItem("pastId"))
    if (lastPos) console.log(nodeFromPosition(lastPos));
    // const reacquireNode = nodeFromPosition(treePos);
    // console.log(reacquireNode);
    localStorage.pastId = JSON.stringify(treePos);
    span.scrollIntoView({behavior: "smooth"});
    oldId = id;
}

function spanFromTreePos(treePos) {
    removeOldSpan();
    const range = nodeFromPosition(treePos);
    createHighlightedSpan(range);
}

function removeOldSpan() {
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



const thisRange = document.createRange();
const testEl = nodeFromPosition(['btn', 6, 0]);
// console.log(testEl);
thisRange.setStart(testEl, 16);
thisRange.setEnd(testEl, 81);
console.log(thisRange);
createHighlightedSpan(thisRange);
