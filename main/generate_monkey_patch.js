var deprecatedClasses = [ HTMLFrameSetElement, ]
var specialCase = [ HTMLTextAreaElement, ] // attribute doesn't touch nodes, but has same attribute name as another html class, who's attribute does involve nodes
var classesToChange = [ EventTarget, Node, NodeList, RadioNodeList, Element, Document, HTMLElement, HTMLDocument, HTMLCollection, HTMLAnchorElement, HTMLAreaElement, HTMLAudioElement, HTMLBRElement, HTMLBaseElement, HTMLBodyElement, HTMLButtonElement, HTMLCanvasElement, HTMLDListElement, HTMLDataElement, HTMLDataListElement, HTMLDialogElement, HTMLDivElement, HTMLEmbedElement, HTMLFieldSetElement, HTMLFormControlsCollection, HTMLFormElement, HTMLFrameSetElement, HTMLHRElement, HTMLHeadElement, HTMLHeadingElement, HTMLHtmlElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLLIElement, HTMLLabelElement, HTMLLegendElement, HTMLLinkElement, HTMLMapElement, HTMLMediaElement, HTMLMetaElement, HTMLMeterElement, HTMLModElement, HTMLOListElement, HTMLObjectElement, HTMLOptGroupElement, HTMLOptionElement, HTMLOptionsCollection, HTMLOutputElement, HTMLParagraphElement, HTMLParamElement, HTMLPictureElement, HTMLPreElement, HTMLProgressElement, HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLSourceElement, HTMLSpanElement, HTMLStyleElement, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement, HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement, HTMLTemplateElement, HTMLTimeElement, HTMLTitleElement, HTMLTrackElement, HTMLUListElement, HTMLUnknownElement, HTMLVideoElement, ]
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
    "elements",
    "getElementsByClassName",
    "getElementsByTagName",
    "getElementsByTagNameNS",
    "getSVGDocument",
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
    "rows", // HTMLTableElement.rows and HTMLTableSectionElement.rows is a HTMLCollection, but HTMLTextAreaElement.rows is just a number
    "selectedIndex",
    "selectedOptions",
    "shadowRoot",
    "tBodies",
    "tFoot",
    "tHead",
    "caption",
    "cells",
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
    const elementSymbol = Symbol.for("element")
    const proxyCounterpartSymbol = Symbol.for("proxyCounterpart")
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
    const wrapMethodConverter = (original) => function (...args) { return maybeConvert(original.apply(this, args.map(maybeConvert))) }
    const wrapGetterConverter = (original) => function (key) { return maybeConvert(original.apply(this, [key])) }
    const wrapSetterConverter = (original) => function (key, value) { return original.apply(this, [key, maybeConvert(value)]) }

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


// 
// 
// patch HTMLCollection, HTMLOptionsCollection, NodeList
// 
// 
var elementSymbol = Symbol.for("element")
var proxyCounterpartSymbol = Symbol.for("proxyCounterpart")
var maybeConvert = (node)=> {
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
var wrapMethodConverter = (original) => function (...args) { return maybeConvert(original.apply(this, args.map(maybeConvert))) }

Object.defineProperties(NodeList.prototype, {
    item: { value: wrapMethodConverter(NodeList.prototype.item), },
})
document.querySelectorAll("*").item(0)
    entries: { value: },
    forEach()
    values()

const proxySymbol = Symbol.for('Proxy')
const thisProxySymbol = Symbol('thisProxy')

const containerPatch = (whichContainerClass)=>{
    const thisProxySymbol = Symbol(`proxyFor${whichContainerClass.name}`)
    const originalHasInstance = whichContainerClass.prototype[Symbol.hasInstance]
    whichContainerClass.prototype[Symbol.hasInstance] = (item, ...args)=>(item instanceof Object && item[thisProxySymbol])||originalHasInstance(item, ...args)
    new Proxy(originalThing, {
        defineProperty: Reflect.defineProperty,
        getPrototypeOf: Reflect.getPrototypeOf,
        // Object.keys
        ownKeys(...args) { return Reflect.ownKeys(...args) },
        // function call (original value needs to be a function)
        apply(original, context, ...args) { console.log(args) },
        // new operator (original value needs to be a class)
        construct(...args) {},
        get(original, key, ...args) {
            if (key == proxySymbol||key == thisProxySymbol) {return true}
            return Reflect.get(original, key, ...args)
        },
        set(original, key, ...args) {
            if (key == proxySymbol||key == thisProxySymbol) {return}
            return Reflect.set(original, key, ...args)
        },
    })
}
// originalThing[Symbol.iterator]
// originalThing[Symbol.toPrimitive]
// example of changing the instanceof operator:
const originalHasInstance = Function.prototype[Symbol.hasInstance]
Function.prototype[Symbol.hasInstance] = (item, ...args)=>(item instanceof Object && item[thisProxySymbol])||originalHasInstance(item, ...args)
const proxyObject = new Proxy(originalThing, {
    defineProperty: Reflect.defineProperty,
    getPrototypeOf: Reflect.getPrototypeOf,
    // Object.keys
    ownKeys(...args) { return Reflect.ownKeys(...args) },
    // function call (original value needs to be a function)
    apply(original, context, ...args) { console.log(args) },
    // new operator (original value needs to be a class)
    construct(...args) {},
    get(original, key, ...args) {
        if (key == proxySymbol||key == thisProxySymbol) {return true}
        return Reflect.get(original, key, ...args)
    },
    set(original, key, ...args) {
        if (key == proxySymbol||key == thisProxySymbol) {return}
        return Reflect.set(original, key, ...args)
    },
})

// FIXME: make sure the "this" context is passed correctly for any that need it
// FIXME: options property of <select> returning a HTMLOptionsCollection
// FIXME: make a hack to have the the NodeList be mutable