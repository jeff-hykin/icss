var deprecatedClasses = [ HTMLFrameSetElement, ]
var classesToChange = [ Document, Node, NodeList, RadioNodeList, Element, HTMLElement, HTMLDocument, HTMLCollection, HTMLAnchorElement, HTMLAreaElement, HTMLAudioElement, HTMLBRElement, HTMLBaseElement, HTMLBodyElement, HTMLButtonElement, HTMLCanvasElement, HTMLDListElement, HTMLDataElement, HTMLDataListElement, HTMLDialogElement, HTMLDivElement, HTMLEmbedElement, HTMLFieldSetElement, HTMLFormControlsCollection, HTMLFormElement, HTMLHRElement, HTMLHeadElement, HTMLHeadingElement, HTMLHtmlElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLLIElement, HTMLLabelElement, HTMLLegendElement, HTMLLinkElement, HTMLMapElement, HTMLMediaElement, HTMLMetaElement, HTMLMeterElement, HTMLModElement, HTMLOListElement, HTMLObjectElement, HTMLOptGroupElement, HTMLOptionElement, HTMLOptionsCollection, HTMLOutputElement, HTMLParagraphElement, HTMLParamElement, HTMLPictureElement, HTMLPreElement, HTMLProgressElement, HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLSourceElement, HTMLSpanElement, HTMLStyleElement, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement, HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement, HTMLTemplateElement, HTMLTextAreaElement, HTMLTimeElement, HTMLTitleElement, HTMLTrackElement, HTMLUListElement, HTMLUnknownElement, HTMLVideoElement, ]
var propertiesToWrap = [
    // "cloneNode", <--special case

    "childNodes",
    "firstChild",
    "lastChild",
    "nextSibling",
    "ownerDocument",
    "parentNode",
    "parentElement",
    "previousSibling",
    "appendChild",
    "compareDocumentPosition",
    "contains",
    "getRootNode",
    "hasChildNodes",
    "insertBefore",
    "isEqualNode",
    "isSameNode",
    "removeChild",
    "replaceChild",

    "add",
    "after",
    "append",
    "before",
    "children",
    "closest",
    "cols",
    "elements",
    "getElementsByClassName",
    "getElementsByTagName",
    "getElementsByTagNameNS",
    "getSVGDocument",
    "headers",
    "insertAdjacentElement",
    "insertAdjacentHTML",
    "insertAdjacentText",
    "insertCell",
    "insertRow",
    "lastElementChild",
    "matches",
    "nextElementSibling",
    "prepend",
    "previousElementSibling",
    "querySelector",
    "querySelectorAll",
    "remove",
    "replaceChildren",
    "replaceWith",
    "rowIndex",
    "rows",
    "rowSpan",
    "colSpan",
    "sectionRowIndex",
    "selectedIndex",
    "selectedOptions",
    "shadowRoot",
    "span",
    "tBodies",
    "tFoot",
    "tHead",
    "item",
    "namedItem",

    "documentElement",
    "body",
    "head",
    "scrollingElement",
    "webkitCurrentFullScreenElement",
    "webkitFullscreenEnabled",
    "webkitFullscreenElement",
    "rootElement",
    "firstElementChild",
    "childElementCount",
    "activeElement",
    "pointerLockElement",
    "fullscreenElement",
    "adoptNode",
    "createElement",
    "createElementNS",
    "createNodeIterator",
    "createTextNode",
    "elementFromPoint",
    "elementsFromPoint",
    "getElementById",
    "getElementsByName",
    "getSelection",
    "importNode",
    "pictureInPictureElement",
]

var hasAsMethod = (object, key)=>{
    const result = Object.getOwnPropertyDescriptor(object,key)
    return result&&(result.value instanceof Function)
}
var hasAsGetter = (object, key)=>{
    const result = Object.getOwnPropertyDescriptor(object,key)
    return result&&(result.get instanceof Function)
}
var hasAsSetter = (object, key)=>{
    const result = Object.getOwnPropertyDescriptor(object,key)
    return result&&(result.get instanceof Function)
}

var compiledOutput = `
    const maybeConvert = (node)=> {
            if (node instanceof Object) {
                if (node[elementSymbol]) {
                    return node[elementSymbol]
                }
                if (node[proxyCounterpartSymbol]) {
                    return node[proxyCounterpartSymbol]
                }
                if (node.length) {
                    // TODO: change this by hacking into NodeList and overriding all the properties, the .item() method, the .keys() method, the .values() method etc
                    return [...node].map(maybeConvert)
                }
            }
            return node
        }
    const wrapMethodConverter = (original) => (...args) => maybeConvert(original(...args.map(maybeConvert)))
    const wrapGetterConverter = (original) => (key) => maybeConvert(original(key))
    const wrapSetterConverter = (original) => (key, value) => original(key, maybeConvert(value))

    let runningPropertyDefinitions
`
for (const EachClass of classesToChange) {
    let hasAtLeastOneGetterOrSetter = false
    let beforeDefinition = ""
    let propertyDefinitions = ""
    for (const eachProperty of propertiesToWrap) {
        let definitionAddition = ""
        const hasMethod = hasAsMethod(EachClass.prototype, eachProperty)
        const hasGetter = hasAsGetter(EachClass.prototype, eachProperty)
        const hasSetter = hasAsSetter(EachClass.prototype, eachProperty)
        if (hasMethod || hasGetter || hasSetter) {
            definitionAddition += `    ${eachProperty}: { `
            
            // grab all getters/setters at once for efficiency
            if ((hasGetter || hasSetter) && !hasAtLeastOneGetterOrSetter) {
                hasAtLeastOneGetterOrSetter = true
                // put this at the top of the propertyDefinitions
                beforeDefinition  = `runningPropertyDefinitions = Object.getOwnPropertyDescriptors(${EachClass.name}.prototype)\n`
            }
            
            if (hasMethod) {
                definitionAddition += `value: wrapMethodConverter(${EachClass.name}.prototype.${eachProperty}),`
            } else if (hasGetter) {
                definitionAddition += `get: wrapGetterConverter(runningPropertyDefinitions.${eachProperty}.get),`
            } else if (hasSetter) {
                definitionAddition += `set: wrapSetterConverter(runningPropertyDefinitions.${eachProperty}.set),`
            }
            definitionAddition += ` },\n`
        }
        propertyDefinitions += definitionAddition
    }
    // if at least one property was redefined
    if (propertyDefinitions.length > 0) {
        compiledOutput += `\n\n${beforeDefinition}Object.defineProperties(${EachClass.name}.prototype, {\n${propertyDefinitions}})`
    }
}
console.debug(compiledOutput)

// FIXME: make sure the "this" context is passed correctly for any that need it
// FIXME: options property of <select> returning a HTMLOptionsCollection
// FIXME: make a hack to have the the NodeList be mutable