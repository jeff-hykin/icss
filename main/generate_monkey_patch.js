var deprecatedClasses = [ HTMLFrameSetElement, ]
var specialCase = [
    HTMLTextAreaElement, // attribute doesn't touch nodes, but has same attribute name as another html class, who's attribute does involve nodes
    NodeList, // manually patched because of complicated methods
]
var classesToChange = [ EventTarget, Node, RadioNodeList, Element, Document, HTMLElement, HTMLDocument, HTMLCollection, HTMLAnchorElement, HTMLAreaElement, HTMLAudioElement, HTMLBRElement, HTMLBaseElement, HTMLBodyElement, HTMLButtonElement, HTMLCanvasElement, HTMLDListElement, HTMLDataElement, HTMLDataListElement, HTMLDialogElement, HTMLDivElement, HTMLEmbedElement, HTMLFieldSetElement, HTMLFormControlsCollection, HTMLFormElement, HTMLFrameSetElement, HTMLHRElement, HTMLHeadElement, HTMLHeadingElement, HTMLHtmlElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLLIElement, HTMLLabelElement, HTMLLegendElement, HTMLLinkElement, HTMLMapElement, HTMLMediaElement, HTMLMetaElement, HTMLMeterElement, HTMLModElement, HTMLOListElement, HTMLObjectElement, HTMLOptGroupElement, HTMLOptionElement, HTMLOptionsCollection, HTMLOutputElement, HTMLParagraphElement, HTMLParamElement, HTMLPictureElement, HTMLPreElement, HTMLProgressElement, HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLSourceElement, HTMLSpanElement, HTMLStyleElement, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement, HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement, HTMLTemplateElement, HTMLTimeElement, HTMLTitleElement, HTMLTrackElement, HTMLUListElement, HTMLUnknownElement, HTMLVideoElement, ]
var propertiesReturningLists = [ // TODO: in the future use this list to optimize the wrapper a bit more
    "childNodes",
    "children",
    "getElementsByClassName",
    "getElementsByTagName",
    "getElementsByTagNameNS",
    "getElementsByName",
    "querySelectorAll",
    "elementsFromPoint", // the only one that returns an array
    "labels",
    "options",
    "elements",
    "cells",
    "rows",
    "tBodies",
]
var propertiesToWrap = [
    // "cloneNode",  // <--special case
    
    ...propertiesReturningLists,
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
    "insertBefore",
    "isEqualNode",
    "isSameNode",
    "removeChild",
    "replaceChild",

    "add",
    "after",
    "append",
    "before",
    "closest",
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
    "remove",
    "replaceChildren",
    "replaceWith",
    "selectedIndex",
    "selectedOptions",
    "shadowRoot",
    "tFoot",
    "tHead",
    "caption",
    "form",
    "menu",
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
    "activeElement",
    "pointerLockElement",
    "fullscreenElement",
    "adoptNode",
    "elementFromPoint",
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
const proxySymbol            = Symbol.for('Proxy')
const elementSymbol          = Symbol("element")
const proxyCounterpartSymbol = Symbol("proxyCounterpart")
const onCloneNodeSymbol      = Symbol("onCloneNode")
const originalProxy = window.Proxy
// make it so that proxys seemingly "just work" with Nodes
window.Proxy = new originalProxy(originalProxy, {
    construct(original, [target, handler], originalConstructor) {
        // do nothing different if not a node
        if (!(target instanceof Node)) {
            return new originalProxy(target, handler)
        }
        // add a hook for checking if something is a proxy, cloneNode, and a way to access the element
        const originalGet = handler.get || Reflect.get
        if (handler.cloneNode instanceof Function) {
            handler.get = function(target, key) {
                if (key==proxySymbol) {return true}
                if (key==elementSymbol) {return target}
                if (key==onCloneNodeSymbol) { return (...args)=>handler.cloneNode.apply(target,args) }
                return originalGet.call(this, target, key)
            }
        } else {
            handler.get = function(target, key) {
                if (key==proxySymbol) {return true}
                if (key==elementSymbol) {return target}
                return originalGet.call(this, target, key)
            }
        }
        // create the proxy like normal
        const normalProxyObject = new originalProxy(target, handler)
        // bind it to the proxy
        Object.defineProperty(target, proxyCounterpartSymbol, {
            writable: false,
            value: normalProxyObject,
        })
        return normalProxyObject
    }
})

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
const wrapMethodConverter = (original) => function (   ...args) { return maybeConvert(original.apply(this, args.map(maybeConvert))) }
const wrapGetterConverter = (original) => function (key       ) { return maybeConvert(original.call(this, key                    )) }
const wrapSetterConverter = (original) => function (key, value) { return              original.call(this, key, maybeConvert(value)) }

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

compiledOutput += `

// manually define what happens with cloneNode
const originalCloneNode = Node.prototype.cloneNode
Node.prototype.cloneNode = function(deep) {
    const clonedNode = originalCloneNode.call(this, deep)
    const counterpart = this[proxyCounterpartSymbol]
    if (counterpart[onCloneNodeSymbol] instanceof Function) {
        return counterpart[onCloneNodeSymbol](clonedNode, deep)
    }
}

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
`
console.debug(compiledOutput)

// FIXME: cloneNode