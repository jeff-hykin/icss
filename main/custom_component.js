const { createElement } = require("./custom_element.js")
// fix proxy
require("./patch_node_api.js")

const createExecuteAll = (iterable, that) => (...args) => iterable.forEach(each=>{
    try {
        each.apply(that, args)
    } catch (error) {
        console.error(error)
    }
})

// FIXME
    // change tracking
    // property parsing
    // inherited values

const specialWhenevers = new Set([ "$connected", "$disconnected", "$changedDocument", "$cloned", "$onUpdateAttempt", ])
const createComponent = (...mixins) => {
    const componentStatic = {}
    const default = {}
    default.$once = {
        $factoryIsBuilt: new Set(mixinsAfterSingleRun.filter(each=>each.$once&&each.$once.$factoryIsBuilt).map(each=>each.$once.$factoryIsBuilt)),
        $skeletonCreated: new Set(mixinsAfterSingleRun.filter(each=>each.$once&&each.$once.$skeletonCreated).map(each=>each.$once.$skeletonCreated)),
        // FIXME: handle normal $once's 
    }

    default.$whenever = {
        ...Object.fromEntries(specialWhenevers.map(each=>[each,[]]))
    }
    for (const whenevers of mixins.filter(each=>each.$whenever).map(each=>each.$whenever)) {
        for (const [key, value] of Object.entries(whenevers)) {
            if (key[0] == "$" && !specialWhenevers.has(key)) {
                console.warn(`when calling createComponent, one of the mixin's contained $whenever.${key}, which is not one of the special $whenever keys: ${specialWhenevers}\nthe key will be ignored`)
                continue
            }
            if (!(value instanceof Function)) {
                console.warn(` $whenever.${key} wasn't a function, instead I got ${value}, and I can't execute that $whenever.${key} happens`)
                continue
            }
            // aggregate the whenevers
            if (default.$whenever[key]) {
                default.$whenever[key].add(value)
            } else {
                default.$whenever[key] = new Set([value])
            }
        }
    }
    // 
    // preprocessing for creating events on elements
    // 
    default.$eventKeys = new Set(Object.keys(default.$once).concat(default.$whenever))
    default.$removeAfterFirstCalls = {}
    for (const eachKey of default.$eventKeys) {
        const onceCallbacksSet = default.$once[eachKey]
        default.$removeAfterFirstCalls[eachKey] = new Set()
        const wheneverCallbacksSet = default.$whenever[eachKey]
        for (const onceCallback of onceCallbacksSet) {
            if (!wheneverCallbacksSet.has(onceCallback)) {
                default.$removeAfterFirstCalls[eachKey].add(onceCallback)
            }
        }
    }
    
    // FIXME: process props (static and normal)
        // create an onUpdate, onChange, onClone and other default values
    
    const factory = (incomingProperties) => {
        const system = {
            $internal: {},
            $external: null,
            $callbacks: {},
            $propInfo: {},
            $element: null,
            $removeAfterFirstCalls: {...default.$removeAfterFirstCalls},
            $component: factory,
        }
        
        // 
        // callbacks
        // 
        // attach copies of all the sets of callbacks
        for (const eachEventKey of default.$eventKeys) {
            system.$callbacks[eachEventKey] = new Set([
                ...default.$once[key],
                ...default.$whenever[key],
            ])
        }

        // only attach callbacks because everthing else needs to be done through the proxy
        system.$element = createElement({
            onConnect: createExecuteAll(system.$callbacks.$connected, external),
            onDisconnect: createExecuteAll(system.$callbacks.$disconnected, external),
            onAdopted: createExecuteAll(system.$callbacks.$changedDocument, external),
        })
        
        const createProxy = (system)=>{
            return new Proxy(system.$element, {
                // FIXME change define property
                defineProperty: Reflect.defineProperty,
                getPrototypeOf: Reflect.getPrototypeOf,
                // Object.keys
                ownKeys() { return [ ... new Set(Object.keys(system.$internal).concat(Object.keys(system.$element))) ] },
                get(_, key) {
                    if (key in system) {return system[key]}
                    if (system.$propInfo.detached[key] || system.$propInfo.detached[Property.Other]) {return system.$internal[key]}
                    return system.$element[key]
                },
                set(_, key, value) {
                    // FIXME: cleanup this part
                        // how to handle tracked vs untracked changes
                        // convert value to observable before sticking it on 

                    // if specific rule was made for this one
                    if (key in system.$propInfo.onUpdateAttempt) {
                        if (system.$propInfo.detached[key]) {
                            system.$internal[key] = system.$propInfo.onUpdateAttempt[key](value, system.$internal[key], [])
                        } else {
                            system.$element[key] = system.$propInfo.onUpdateAttempt[key](value, system.$element[key], [])
                        }
                    }
                    if (system.$propInfo.onUpdateAttempt[Property.Other]) {
                        if (system.$propInfo.detached[Property.Other]) {
                            system.$internal[key] = system.$propInfo.onUpdateAttempt[Property.Other](value, system.$internal[key], [key])
                        } else {
                            system.$element[key] = system.$propInfo.onUpdateAttempt[Property.Other](value, system.$element[key], [key])
                        }
                    }
                    system.$element[key] = value

                    return system.$external[key]
                },
                cloneNode(_, clone, deep) {
                    const newSystem = {
                        $internal: {...system.$internal},
                        $external: null,
                        // deep copy the propInfo (should bottom out after 2 levels)
                        $propInfo: Object.fromEntries(Object.entries(system.$propInfo).map(([key, value])=>([key, {...value}]))),
                        // deep copy the callbacks (just go to the set level)
                        $callbacks: Object.fromEntries(Object.entries(system.$callbacks).map(([key, value])=>([key, new Set(value)]))),
                        $element: clone,
                        $removeAfterFirstCalls: {...system.$removeAfterFirstCalls},
                        $component: factory,
                    }
                    newSystem.$external = createProxy(newSystem)
                    for (const eachCallback of system.$callbacks.$cloned) {
                        try {
                            eachCallback.call(system.$external, newSystem)
                        } catch (error) {
                            console.error(error)
                        }
                    }
                    return newSystem.$external
                },
            })
        }
        system.$external = createProxy(system)
        Object.assign(system.$external, incomingProperties)
        return system.$external
    }
    // how it should look:
            // - $namespace (err if same as any other mixins)
            // - $once
            //     - $factoryIsBuilt
            //     - $skeletonCreated
            // - $whenever
            //     - $connected
            //     - $disconnected
            //     - $propUpdating
            //     - $propChanged
            //  - [propName]:
            //     - default value or
            //     - custom object with symbol
            //         - defaultValue
            //         - detached (required when the name is the same as an element property)
            //         - hierarchical/inheritable
            //         - private $ just set validator to false
            //         - singleton/isClassProp
            //         - disable reactivity/tracking
            //         - validator
            //         - explanation/help
            //         - isEvent
            //         - onUpdate
            //         - onChange
    // call all the factory built steps
    for (const factoryBuiltCallback of default.$once.$factoryIsBuilt) {
        factoryBuiltCallback()
    }
}

// TODO: create Property helper


// 
// 
// examples
// 
// 
createComponent({
    $once: {
        $componentIsDefined: (factory)=>{
            
        },
        $skeletonCreated: ()=>{
            // efficiently set default prop values here
        },
    },
    $whenever: {
        $batchUpdating: (props)=>{
            // this == proxy
        },
    },
    name: Property({
        inheritValue: true,
        defaultValue: ()=>0,
        onUpdateAttempt: (newValue, oldValue, keyList)=>{
            return is.Number(newValue) ? newValue : oldValue
        },
    }),
})
createComponent({
    $once: {
    },
    $whenever: {
    },
    [Property.Other]: Property({
        untracked: true,
    }),
    name: Property({
        inheritValue: true,
        defaultValue: ()=>"",
        onUpdateAttempt: (newValue, oldValue, keyList)=>{
            return is.String(newValue) && newValue.length > 0 ? newValue : oldValue
        },
    }),
    count: Property({
        shallow: true,
        defaultValue: ()=>0,
        onUpdateAttempt: (newValue, oldValue, keyList)=>{
            return is.Number(newValue) && newValue > 0 ? newValue : oldValue
        },
    }),
})