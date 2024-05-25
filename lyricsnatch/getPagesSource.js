// I think that this script is somehow 'injected' into the actual displayed page
function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

// This might work as well as DOMtoString:
// document.documentElement.outerHTML
//chrome.runtime.sendMessage({
//    action: "getSource",
//    source: DOMtoString(document)
//});
// NB. View page source shows special characters as the HTML entity name but
// outerHTML returns the actual character, eg. '...' (ie. the single character for ellipsis, which
// can't be used here because the browser complains that it is not UTF8 encoded, even
// though it can be used in popup.js, luckily, since it is a fundamental part of the search regex) 
// appears as &hellips; in view source.
// document.documentElement.textContent promised the raw content but it also returns the actual character.
// Not sure what is really returned by by the server... Will stick to outerHTMl for now
chrome.runtime.sendMessage({
    action: "getSource",
    source: document.documentElement.outerHTML
});
