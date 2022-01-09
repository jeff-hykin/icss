
    const proxySymbol = Symbol.for('Proxy')
    const elementSymbol = Symbol.for("element")
    const proxyCounterpartSymbol = Symbol.for("proxyCounterpart")
    const convertList = (listObj) => new Proxy(listObj, {
        get(original, key) {
            if (key == proxySymbol) {return true}
            return maybeConvert(original[key])
        },
        set(original, key, value) {
            if (key == proxySymbol) {return}
            return original[key] = maybeConvert(value)
        },
    })
    const maybeConvert = (node)=> {
            if (node instanceof Object) {
                if (node[elementSymbol]) {
                    return node[elementSymbol]
                }
                if (node[proxyCounterpartSymbol]) {
                    return node[proxyCounterpartSymbol]
                }
                if (node.length!=null) {
                    return convertList(node)
                }
            }
            return node
        }
    const wrapMethodConverter = (original) => function (   ...args) { return maybeConvert(original.apply(this, args.map(maybeConvert)    )) }
    const wrapGetterConverter = (original) => function (key       ) { return maybeConvert(original.apply(this, [key                     ])) }
    const wrapSetterConverter = (original) => function (key, value) { return              original.apply(this, [key, maybeConvert(value)])  }

    let runningPropertyDefinitions


runningPropertyDefinitions = Object.getOwnPropertyDescriptors(Node.prototype)
Object.defineProperties(Node.prototype, {
    cloneNode: { value: wrapMethodConverter(Node.prototype.cloneNode), },
    childNodes: { get: wrapGetterConverter(runningPropertyDefinitions.childNodes.get), },
    firstChild: { get: wrapGetterConverter(runningPropertyDefinitions.firstChild.get), },
    lastChild: { get: wrapGetterConverter(runningPropertyDefinitions.lastChild.get), },
    nextSibling: { get: wrapGetterConverter(runningPropertyDefinitions.nextSibling.get), },
    ownerDocument: { get: wrapGetterConverter(runningPropertyDefinitions.ownerDocument.get), },
    parentNode: { get: wrapGetterConverter(runningPropertyDefinitions.parentNode.get), },
    parentElement: { get: wrapGetterConverter(runningPropertyDefinitions.parentElement.get), },
    previousSibling: { get: wrapGetterConverter(runningPropertyDefinitions.previousSibling.get), },
    appendChild: { value: wrapMethodConverter(Node.prototype.appendChild), },
    compareDocumentPosition: { value: wrapMethodConverter(Node.prototype.compareDocumentPosition), },
    contains: { value: wrapMethodConverter(Node.prototype.contains), },
    getRootNode: { value: wrapMethodConverter(Node.prototype.getRootNode), },
    insertBefore: { value: wrapMethodConverter(Node.prototype.insertBefore), },
    isEqualNode: { value: wrapMethodConverter(Node.prototype.isEqualNode), },
    isSameNode: { value: wrapMethodConverter(Node.prototype.isSameNode), },
    removeChild: { value: wrapMethodConverter(Node.prototype.removeChild), },
    replaceChild: { value: wrapMethodConverter(Node.prototype.replaceChild), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(Element.prototype)
Object.defineProperties(Element.prototype, {
    children: { get: wrapGetterConverter(runningPropertyDefinitions.children.get), },
    getElementsByClassName: { value: wrapMethodConverter(Element.prototype.getElementsByClassName), },
    getElementsByTagName: { value: wrapMethodConverter(Element.prototype.getElementsByTagName), },
    getElementsByTagNameNS: { value: wrapMethodConverter(Element.prototype.getElementsByTagNameNS), },
    querySelectorAll: { value: wrapMethodConverter(Element.prototype.querySelectorAll), },
    after: { value: wrapMethodConverter(Element.prototype.after), },
    append: { value: wrapMethodConverter(Element.prototype.append), },
    before: { value: wrapMethodConverter(Element.prototype.before), },
    closest: { value: wrapMethodConverter(Element.prototype.closest), },
    getElementsByClassName: { value: wrapMethodConverter(Element.prototype.getElementsByClassName), },
    getElementsByTagName: { value: wrapMethodConverter(Element.prototype.getElementsByTagName), },
    getElementsByTagNameNS: { value: wrapMethodConverter(Element.prototype.getElementsByTagNameNS), },
    insertAdjacentElement: { value: wrapMethodConverter(Element.prototype.insertAdjacentElement), },
    insertAdjacentHTML: { value: wrapMethodConverter(Element.prototype.insertAdjacentHTML), },
    insertAdjacentText: { value: wrapMethodConverter(Element.prototype.insertAdjacentText), },
    lastElementChild: { get: wrapGetterConverter(runningPropertyDefinitions.lastElementChild.get), },
    matches: { value: wrapMethodConverter(Element.prototype.matches), },
    nextElementSibling: { get: wrapGetterConverter(runningPropertyDefinitions.nextElementSibling.get), },
    prepend: { value: wrapMethodConverter(Element.prototype.prepend), },
    previousElementSibling: { get: wrapGetterConverter(runningPropertyDefinitions.previousElementSibling.get), },
    querySelector: { value: wrapMethodConverter(Element.prototype.querySelector), },
    remove: { value: wrapMethodConverter(Element.prototype.remove), },
    replaceChildren: { value: wrapMethodConverter(Element.prototype.replaceChildren), },
    replaceWith: { value: wrapMethodConverter(Element.prototype.replaceWith), },
    shadowRoot: { get: wrapGetterConverter(runningPropertyDefinitions.shadowRoot.get), },
    firstElementChild: { get: wrapGetterConverter(runningPropertyDefinitions.firstElementChild.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(Document.prototype)
Object.defineProperties(Document.prototype, {
    children: { get: wrapGetterConverter(runningPropertyDefinitions.children.get), },
    getElementsByClassName: { value: wrapMethodConverter(Document.prototype.getElementsByClassName), },
    getElementsByTagName: { value: wrapMethodConverter(Document.prototype.getElementsByTagName), },
    getElementsByTagNameNS: { value: wrapMethodConverter(Document.prototype.getElementsByTagNameNS), },
    getElementsByName: { value: wrapMethodConverter(Document.prototype.getElementsByName), },
    querySelectorAll: { value: wrapMethodConverter(Document.prototype.querySelectorAll), },
    elementsFromPoint: { value: wrapMethodConverter(Document.prototype.elementsFromPoint), },
    append: { value: wrapMethodConverter(Document.prototype.append), },
    getElementsByClassName: { value: wrapMethodConverter(Document.prototype.getElementsByClassName), },
    getElementsByTagName: { value: wrapMethodConverter(Document.prototype.getElementsByTagName), },
    getElementsByTagNameNS: { value: wrapMethodConverter(Document.prototype.getElementsByTagNameNS), },
    lastElementChild: { get: wrapGetterConverter(runningPropertyDefinitions.lastElementChild.get), },
    prepend: { value: wrapMethodConverter(Document.prototype.prepend), },
    querySelector: { value: wrapMethodConverter(Document.prototype.querySelector), },
    replaceChildren: { value: wrapMethodConverter(Document.prototype.replaceChildren), },
    documentElement: { get: wrapGetterConverter(runningPropertyDefinitions.documentElement.get), },
    body: { get: wrapGetterConverter(runningPropertyDefinitions.body.get), },
    head: { get: wrapGetterConverter(runningPropertyDefinitions.head.get), },
    scrollingElement: { get: wrapGetterConverter(runningPropertyDefinitions.scrollingElement.get), },
    webkitCurrentFullScreenElement: { get: wrapGetterConverter(runningPropertyDefinitions.webkitCurrentFullScreenElement.get), },
    webkitFullscreenEnabled: { get: wrapGetterConverter(runningPropertyDefinitions.webkitFullscreenEnabled.get), },
    webkitFullscreenElement: { get: wrapGetterConverter(runningPropertyDefinitions.webkitFullscreenElement.get), },
    rootElement: { get: wrapGetterConverter(runningPropertyDefinitions.rootElement.get), },
    firstElementChild: { get: wrapGetterConverter(runningPropertyDefinitions.firstElementChild.get), },
    activeElement: { get: wrapGetterConverter(runningPropertyDefinitions.activeElement.get), },
    pointerLockElement: { get: wrapGetterConverter(runningPropertyDefinitions.pointerLockElement.get), },
    fullscreenElement: { get: wrapGetterConverter(runningPropertyDefinitions.fullscreenElement.get), },
    adoptNode: { value: wrapMethodConverter(Document.prototype.adoptNode), },
    elementFromPoint: { value: wrapMethodConverter(Document.prototype.elementFromPoint), },
    getElementById: { value: wrapMethodConverter(Document.prototype.getElementById), },
    getElementsByName: { value: wrapMethodConverter(Document.prototype.getElementsByName), },
    getSelection: { value: wrapMethodConverter(Document.prototype.getSelection), },
    importNode: { value: wrapMethodConverter(Document.prototype.importNode), },
    pictureInPictureElement: { get: wrapGetterConverter(runningPropertyDefinitions.pictureInPictureElement.get), },
})

Object.defineProperties(HTMLCollection.prototype, {
    item: { value: wrapMethodConverter(HTMLCollection.prototype.item), },
    namedItem: { value: wrapMethodConverter(HTMLCollection.prototype.namedItem), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLButtonElement.prototype)
Object.defineProperties(HTMLButtonElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLDataListElement.prototype)
Object.defineProperties(HTMLDataListElement.prototype, {
    options: { get: wrapGetterConverter(runningPropertyDefinitions.options.get), },
})

Object.defineProperties(HTMLEmbedElement.prototype, {
    getSVGDocument: { value: wrapMethodConverter(HTMLEmbedElement.prototype.getSVGDocument), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLFieldSetElement.prototype)
Object.defineProperties(HTMLFieldSetElement.prototype, {
    elements: { get: wrapGetterConverter(runningPropertyDefinitions.elements.get), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

Object.defineProperties(HTMLFormControlsCollection.prototype, {
    namedItem: { value: wrapMethodConverter(HTMLFormControlsCollection.prototype.namedItem), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLFormElement.prototype)
Object.defineProperties(HTMLFormElement.prototype, {
    elements: { get: wrapGetterConverter(runningPropertyDefinitions.elements.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLFrameSetElement.prototype)
Object.defineProperties(HTMLFrameSetElement.prototype, {
    rows: { get: wrapGetterConverter(runningPropertyDefinitions.rows.get), },
})

Object.defineProperties(HTMLIFrameElement.prototype, {
    getSVGDocument: { value: wrapMethodConverter(HTMLIFrameElement.prototype.getSVGDocument), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLInputElement.prototype)
Object.defineProperties(HTMLInputElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLLabelElement.prototype)
Object.defineProperties(HTMLLabelElement.prototype, {
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLLegendElement.prototype)
Object.defineProperties(HTMLLegendElement.prototype, {
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLMeterElement.prototype)
Object.defineProperties(HTMLMeterElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLObjectElement.prototype)
Object.defineProperties(HTMLObjectElement.prototype, {
    getSVGDocument: { value: wrapMethodConverter(HTMLObjectElement.prototype.getSVGDocument), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLOptionElement.prototype)
Object.defineProperties(HTMLOptionElement.prototype, {
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLOptionsCollection.prototype)
Object.defineProperties(HTMLOptionsCollection.prototype, {
    add: { value: wrapMethodConverter(HTMLOptionsCollection.prototype.add), },
    remove: { value: wrapMethodConverter(HTMLOptionsCollection.prototype.remove), },
    selectedIndex: { get: wrapGetterConverter(runningPropertyDefinitions.selectedIndex.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLOutputElement.prototype)
Object.defineProperties(HTMLOutputElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLProgressElement.prototype)
Object.defineProperties(HTMLProgressElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLSelectElement.prototype)
Object.defineProperties(HTMLSelectElement.prototype, {
    labels: { get: wrapGetterConverter(runningPropertyDefinitions.labels.get), },
    options: { get: wrapGetterConverter(runningPropertyDefinitions.options.get), },
    add: { value: wrapMethodConverter(HTMLSelectElement.prototype.add), },
    remove: { value: wrapMethodConverter(HTMLSelectElement.prototype.remove), },
    selectedIndex: { get: wrapGetterConverter(runningPropertyDefinitions.selectedIndex.get), },
    selectedOptions: { get: wrapGetterConverter(runningPropertyDefinitions.selectedOptions.get), },
    form: { get: wrapGetterConverter(runningPropertyDefinitions.form.get), },
    item: { value: wrapMethodConverter(HTMLSelectElement.prototype.item), },
    namedItem: { value: wrapMethodConverter(HTMLSelectElement.prototype.namedItem), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLTableElement.prototype)
Object.defineProperties(HTMLTableElement.prototype, {
    rows: { get: wrapGetterConverter(runningPropertyDefinitions.rows.get), },
    tBodies: { get: wrapGetterConverter(runningPropertyDefinitions.tBodies.get), },
    insertRow: { value: wrapMethodConverter(HTMLTableElement.prototype.insertRow), },
    tFoot: { get: wrapGetterConverter(runningPropertyDefinitions.tFoot.get), },
    tHead: { get: wrapGetterConverter(runningPropertyDefinitions.tHead.get), },
    caption: { get: wrapGetterConverter(runningPropertyDefinitions.caption.get), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLTableRowElement.prototype)
Object.defineProperties(HTMLTableRowElement.prototype, {
    cells: { get: wrapGetterConverter(runningPropertyDefinitions.cells.get), },
    insertCell: { value: wrapMethodConverter(HTMLTableRowElement.prototype.insertCell), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLTableSectionElement.prototype)
Object.defineProperties(HTMLTableSectionElement.prototype, {
    rows: { get: wrapGetterConverter(runningPropertyDefinitions.rows.get), },
    insertRow: { value: wrapMethodConverter(HTMLTableSectionElement.prototype.insertRow), },
})

runningPropertyDefinitions = Object.getOwnPropertyDescriptors(HTMLTemplateElement.prototype)
Object.defineProperties(HTMLTemplateElement.prototype, {
    shadowRoot: { get: wrapGetterConverter(runningPropertyDefinitions.shadowRoot.get), },
})

// manually patch NodeList cause it's special
const [ nodeListEntriesFunction, nodeListForEachFunction, nodeListValuesFunction ] = [ NodeList.prototype.entries, NodeList.prototype.forEach, NodeList.prototype.values ]
Object.defineProperties(NodeList.prototype, {
    item: {
        value: wrapMethodConverter(NodeList.prototype.item),
    },
    entries: {
        value: function*(){
            for (const [key, value] of nodeListEntriesFunction.apply(this)) {
                yield [ key, maybeConvert(value) ]
            }
        },
    },
    forEach: {
        value: function(callback, thisArg){
            nodeListForEachFunction.call(
                this,
                (element, index, array)=>{ callback.apply(thisArg, [ maybeConvert(element), index, array ]) }
            )
        },
    },
    values: {
        value: function*(){
            for (const each of nodeListValuesFunction.apply(this)) {
                yield maybeConvert(each)
            }
        },
    },
})
NodeList.prototype[Symbol.iterator] = NodeList.prototype.values
