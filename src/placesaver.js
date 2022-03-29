
// const buttonEl = document.getElementById('btn');

let oldId;


// buttonEl.addEventListener('click', highlight);


function generateId() {
    let id = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 16; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        id += chars[idx];
    }
    return id;
}

function highlight() {
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
    const span = document.createElement("span");

    const id = generateId();
    span.setAttribute("id", id);
    span.setAttribute("class", "placeSaverHighlight");
    span.appendChild(range.extractContents());
    range.insertNode(span);
    
    console.log(selection);
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
    span.scrollIntoView({behavior: "smooth"});
    oldId = id;
    selection.removeAllRanges();
}