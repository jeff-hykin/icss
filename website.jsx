document.body.style = `
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 45px; 
    font-family: sans-serif;
    height: 100%;
`
document.body.innerHTML = `
    <style>
        * {
            color: salmon;
        }
    </style>
    Hello World!
`

const cssImportantifyString = (string)=>{
    // FIXME, this replace is hacky! it could cause a problem with URL's and other quoted items like ::before's or attribute patterns inside of css
    //        if strings were removed and reinserted, it would probably be bulletproof though
    return string.replace(/(:.+?);/g, "$1 !important;").replace(/ ?(!important +)+!important;/g, " !important;")
}

const cssImportantifySheet = (...styleSheets)=>{
    let newStyle = ""
    for (const eachStyle of styleSheets) {
        try {
            eachStyle.cssRules
        } catch (error) {
            // skip external css sheets because the cross origin policy (for some reason) prevents looking at them
            continue
        }
        // make each rule important (because if everything's important, then nothing is)
        for (const eachCssRule of eachStyle.cssRules) {
            // FIXME, this could cause a problem with URL's and other quoted items like ::before's 
            newStyle += eachCssRule.cssText
        }
    }
    return cssImportantifyString(newStyle)
}

const cssImportantifyElement = (styleElement)=>{
    const styleSheet = parseStyle(styleElement.innerHTML)
    styleElement.innerHTML += cssImportantifyString(styleSheet)
    return styleElement
}

const hash = (object) => JSON.stringify(object).split("").reduce(
    (hashCode, currentVal) => (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
)

// for preventing CSS bleeding into a shadow dom
const baselineStylesObject = {
    // prevent inheritance (bleeding) by setting every attribute 
    // values are based on Chrome and Firefox default computed values for body, head, and html 
    "display": "flex",
    "all": "unset",
    "animation": "unset",
    "background": "unset",
    "border-block-color": "unset",
    "border-block-end": "unset",
    "border-block-start": "unset",
    "border-block-style": "unset",
    "border-block-width": "unset",
    "border-block": "unset",
    "border-bottom": "unset",
    "border-color": "unset",
    "border-image": "unset",
    "border-inline-color": "unset",
    "border-inline-end": "unset",
    "border-inline-start": "unset",
    "border-inline-style": "unset",
    "border-inline-width": "unset",
    "border-inline": "unset",
    "border-left": "unset",
    "border-radius": "unset",
    "border-right": "unset",
    "border-style": "unset",
    "border-top": "unset",
    "border-width": "unset",
    "border": "unset",
    "column-rule": "unset",
    "columns": "unset",
    "css-text": "unset",
    "flex-flow": "unset",
    "flex": "unset",
    "font": "unset",
    "gap": "unset",
    "grid-area": "unset",
    "grid-column": "unset",
    "grid-gap": "unset",
    "grid-row": "unset",
    "grid-template": "unset",
    "grid": "unset",
    "inset-block": "unset",
    "inset-inline": "unset",
    "inset": "unset",
    "list-style": "unset",
    "margin-block": "unset",
    "margin-inline": "unset",
    "margin": "unset",
    "marker": "unset",
    "offset": "unset",
    "outline": "unset",
    "overscroll-behavior": "unset",
    "padding-block": "unset",
    "padding-inline": "unset",
    "padding": "unset",
    "place-content": "unset",
    "place-items": "unset",
    "place-self": "unset",
    "scroll-margin-block": "unset",
    "scroll-margin-inline": "unset",
    "scroll-margin": "unset",
    "scroll-padding-block": "unset",
    "scroll-padding-inline": "unset",
    "scroll-padding": "unset",
    "text-emphasis": "unset",
    "block-size": "unset",
    "inline-size": "unset",
    "transition": "unset",
    
    "-moz-animation": "unset",
    "-moz-border-end": "unset",
    "-moz-border-image": "unset",
    "-moz-border-start": "unset",
    "-moz-transition": "unset",
    "-moz-animation-delay": "unset",
    "-moz-animation-direction": "unset",
    "-moz-animation-duration": "unset",
    "-moz-animation-fill-mode": "unset",
    "-moz-animation-iteration-count": "unset",
    "-moz-animation-name": "unset",
    "-moz-animation-play-state": "unset",
    "-moz-animation-timing-function": "unset",
    "-moz-appearance": "unset",
    "-moz-backface-visibility": "unset",
    "-moz-border-end-color": "unset",
    "-moz-border-end-style": "unset",
    "-moz-border-end-width": "unset",
    "-moz-border-start-color": "unset",
    "-moz-border-start-style": "unset",
    "-moz-border-start-width": "unset",
    "-moz-box-align": "unset",
    "-moz-box-direction": "unset",
    "-moz-box-flex": "unset",
    "-moz-box-ordinal-group": "unset",
    "-moz-box-orient": "unset",
    "-moz-box-pack": "unset",
    "-moz-box-sizing": "unset",
    "-moz-float-edge": "unset",
    "-moz-font-feature-settings": "unset",
    "-moz-font-language-override": "unset",
    "-moz-force-broken-image-icon": "unset",
    "-moz-hyphens": "unset",
    "-moz-image-region": "unset",
    "-moz-margin-end": "unset",
    "-moz-margin-start": "unset",
    "-moz-orient": "unset",
    "-moz-osx-font-smoothing": "unset",
    "-moz-padding-end": "unset",
    "-moz-padding-start": "unset",
    "-moz-perspective-origin": "unset",
    "-moz-perspective": "unset",
    "-moz-tab-size": "unset",
    "-moz-text-size-adjust": "unset",
    "-moz-transform-origin": "unset",
    "-moz-transform-style": "unset",
    "-moz-transform": "unset",
    "-moz-transition-delay": "unset",
    "-moz-transition-duration": "unset",
    "-moz-transition-property": "unset",
    "-moz-transition-timing-function": "unset",
    "-moz-user-focus": "unset",
    "-moz-user-input": "unset",
    "-moz-user-modify": "unset",
    "-moz-user-select": "unset",
    "-moz-window-dragging": "unset",
    
    "-webkit-mask-composite": "unset",
    "-webkit-mask": "unset",
    "-webkit-perspective-origin": "unset",
    "-webkit-transform-origin": "unset",
    "-webkit-animation": "unset",
    "-webkit-border-image": "unset",
    "-webkit-border-radius": "unset",
    "-webkit-flex-flow": "unset",
    "-webkit-flex": "unset",
    "-webkit-text-stroke": "unset",
    "-webkit-transition": "unset",
    "-webkit-align-content": "unset",
    "-webkit-align-items": "unset",
    "-webkit-align-self": "unset",
    "-webkit-animation": "unset",
    "-webkit-animation-delay": "unset",
    "-webkit-animation-direction": "unset",
    "-webkit-animation-duration": "unset",
    "-webkit-animation-fill-mode": "unset",
    "-webkit-animation-iteration-count": "unset",
    "-webkit-animation-name": "unset",
    "-webkit-animation-play-state": "unset",
    "-webkit-animation-timing-function": "unset",
    "-webkit-app-region": "unset",
    "-webkit-appearance": "unset",
    "-webkit-backface-visibility": "unset",
    "-webkit-background-clip": "unset",
    "-webkit-background-origin": "unset",
    "-webkit-background-size": "unset",
    "-webkit-border-after": "unset",
    "-webkit-border-after-color": "unset",
    "-webkit-border-after-style": "unset",
    "-webkit-border-after-width": "unset",
    "-webkit-border-before": "unset",
    "-webkit-border-before-color": "unset",
    "-webkit-border-before-style": "unset",
    "-webkit-border-before-width": "unset",
    "-webkit-border-bottom-left-radius": "unset",
    "-webkit-border-bottom-right-radius": "unset",
    "-webkit-border-end": "unset",
    "-webkit-border-end-color": "unset",
    "-webkit-border-end-style": "unset",
    "-webkit-border-end-width": "unset",
    "-webkit-border-horizontal-spacing": "unset",
    "-webkit-border-image": "unset",
    "-webkit-border-radius": "unset",
    "-webkit-border-start": "unset",
    "-webkit-border-start-color": "unset",
    "-webkit-border-start-style": "unset",
    "-webkit-border-start-width": "unset",
    "-webkit-border-top-left-radius": "unset",
    "-webkit-border-top-right-radius": "unset",
    "-webkit-border-vertical-spacing": "unset",
    "-webkit-box-align": "unset",
    "-webkit-box-decoration-break": "unset",
    "-webkit-box-direction": "unset",
    "-webkit-box-flex": "unset",
    "-webkit-box-ordinal-group": "unset",
    "-webkit-box-orient": "unset",
    "-webkit-box-pack": "unset",
    "-webkit-box-reflect": "unset",
    "-webkit-box-shadow": "unset",
    "-webkit-box-sizing": "unset",
    "-webkit-clip-path": "unset",
    "-webkit-column-break-after": "unset",
    "-webkit-column-break-before": "unset",
    "-webkit-column-break-inside": "unset",
    "-webkit-column-count": "unset",
    "-webkit-column-gap": "unset",
    "-webkit-column-rule": "unset",
    "-webkit-column-rule-color": "unset",
    "-webkit-column-rule-style": "unset",
    "-webkit-column-rule-width": "unset",
    "-webkit-column-span": "unset",
    "-webkit-column-width": "unset",
    "-webkit-columns": "unset",
    "-webkit-filter": "unset",
    "-webkit-flex": "unset",
    "-webkit-flex-basis": "unset",
    "-webkit-flex-direction": "unset",
    "-webkit-flex-flow": "unset",
    "-webkit-flex-grow": "unset",
    "-webkit-flex-shrink": "unset",
    "-webkit-flex-wrap": "unset",
    "-webkit-font-feature-settings": "unset",
    "-webkit-font-smoothing": "unset",
    "-webkit-highlight": "unset",
    "-webkit-hyphenate-character": "unset",
    "-webkit-justify-content": "unset",
    "-webkit-line-break": "unset",
    "-webkit-line-clamp": "unset",
    "-webkit-locale": "unset",
    "-webkit-logical-height": "unset",
    "-webkit-logical-width": "unset",
    "-webkit-margin-after": "unset",
    "-webkit-margin-before": "unset",
    "-webkit-margin-end": "unset",
    "-webkit-margin-start": "unset",
    "-webkit-mask-box-image": "unset",
    "-webkit-mask-box-image-outset": "unset",
    "-webkit-mask-box-image-repeat": "unset",
    "-webkit-mask-box-image-slice": "unset",
    "-webkit-mask-box-image-source": "unset",
    "-webkit-mask-box-image-width": "unset",
    "-webkit-mask-clip": "unset",
    "-webkit-mask-composite": "unset",
    "-webkit-mask-image": "unset",
    "-webkit-mask-origin": "unset",
    "-webkit-mask-position": "unset",
    "-webkit-mask-position-x": "unset",
    "-webkit-mask-position-y": "unset",
    "-webkit-mask-repeat": "unset",
    "-webkit-mask-size": "unset",
    "-webkit-max-logical-height": "unset",
    "-webkit-max-logical-width": "unset",
    "-webkit-min-logical-height": "unset",
    "-webkit-min-logical-width": "unset",
    "-webkit-opacity": "unset",
    "-webkit-order": "unset",
    "-webkit-padding-after": "unset",
    "-webkit-padding-before": "unset",
    "-webkit-padding-end": "unset",
    "-webkit-padding-start": "unset",
    "-webkit-perspective": "unset",
    "-webkit-perspective-origin": "unset",
    "-webkit-print-color-adjust": "unset",
    "-webkit-rtl-ordering": "unset",
    "-webkit-ruby-position": "unset",
    "-webkit-shape-image-threshold": "unset",
    "-webkit-shape-margin": "unset",
    "-webkit-shape-outside": "unset",
    "-webkit-tap-highlight-color": "unset",
    "-webkit-text-combine": "unset",
    "-webkit-text-decorations-in-effect": "unset",
    "-webkit-text-emphasis-color": "unset",
    "-webkit-text-emphasis-position": "unset",
    "-webkit-text-emphasis-style": "unset",
    "-webkit-text-fill-color": "unset",
    "-webkit-text-orientation": "unset",
    "-webkit-text-security": "unset",
    "-webkit-text-size-adjust": "unset",
    "-webkit-text-stroke-color": "unset",
    "-webkit-text-stroke-width": "unset",
    "-webkit-transform": "unset",
    "-webkit-transform-origin": "unset",
    "-webkit-transform-style": "unset",
    "-webkit-transition": "unset",
    "-webkit-transition-delay": "unset",
    "-webkit-transition-duration": "unset",
    "-webkit-transition-property": "unset",
    "-webkit-transition-timing-function": "unset",
    "-webkit-user-drag": "unset",
    "-webkit-user-modify": "unset",
    "-webkit-user-select": "unset",
    "-webkit-writing-mode": "unset",
    
    "accent-color": "auto",
    "align-content": "normal",
    "align-items": "normal",
    "align-self": "auto",
    "alignment-baseline": "auto",
    "animation-delay": "0s",
    "animation-direction": "normal",
    "animation-duration": "0s",
    "animation-fill-mode": "none",
    "animation-iteration-count": "1",
    "animation-name": "none",
    "animation-play-state": "running",
    "animation-timing-function": "ease",
    "animation": "none 0s ease 0s 1 normal none running",
    "app-region": "none",
    "appearance": "none",
    "aspect-ratio": "auto",
    "backdrop-filter": "none",
    "backface-visibility": "visible",
    "background-attachment": "scroll",
    "background-blend-mode": "normal",
    "background-clip": "border-box",
    "background-color": "rgba(0, 0, 0, 0)",
    "background-image": "none",
    "background-origin": "padding-box",
    "background-position-x": "0%",
    "background-position-y": "0%",
    "background-position": "0% 0%",
    "background-repeat": "repeat",
    "background-size": "auto",
    "background": "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
    "baseline-shift": "0px",
    "block-size": "auto",
    "border-block-color": "rgb(0, 0, 0)",
    "border-block-end-color": "rgb(0, 0, 0)",
    "border-block-end-style": "none",
    "border-block-end-width": "0px",
    "border-block-end": "0px none rgb(0, 0, 0)",
    "border-block-start-color": "rgb(0, 0, 0)",
    "border-block-start-style": "none",
    "border-block-start-width": "0px",
    "border-block-start": "0px none rgb(0, 0, 0)",
    "border-block-style": "none",
    "border-block-width": "0px",
    "border-block": "0px none rgb(0, 0, 0)",
    "border-bottom-color": "rgb(0, 0, 0)",
    "border-bottom-left-radius": "0px",
    "border-bottom-right-radius": "0px",
    "border-bottom-style": "none",
    "border-bottom-width": "0px",
    "border-bottom": "0px none rgb(0, 0, 0)",
    "border-collapse": "separate",
    "border-color": "rgb(0, 0, 0)",
    "border-end-end-radius": "0px",
    "border-end-start-radius": "0px",
    "border-image-outset": "0",
    "border-image-repeat": "stretch",
    "border-image-slice": "100%",
    "border-image-source": "none",
    "border-image-width": "1",
    "border-image": "none",
    "border-inline-color": "rgb(0, 0, 0)",
    "border-inline-end-color": "rgb(0, 0, 0)",
    "border-inline-end-style": "none",
    "border-inline-end-width": "0px",
    "border-inline-end": "0px none rgb(0, 0, 0)",
    "border-inline-start-color": "rgb(0, 0, 0)",
    "border-inline-start-style": "none",
    "border-inline-start-width": "0px",
    "border-inline-start": "0px none rgb(0, 0, 0)",
    "border-inline-style": "none",
    "border-inline-width": "0px",
    "border-inline": "0px none rgb(0, 0, 0)",
    "border-left-color": "rgb(0, 0, 0)",
    "border-left-style": "none",
    "border-left-width": "0px",
    "border-left": "0px none rgb(0, 0, 0)",
    "border-radius": "0px",
    "border-right-color": "rgb(0, 0, 0)",
    "border-right-style": "none",
    "border-right-width": "0px",
    "border-right": "0px none rgb(0, 0, 0)",
    "border-spacing": "0px 0px",
    "border-start-end-radius": "0px",
    "border-start-start-radius": "0px",
    "border-style": "none",
    "border-top-color": "rgb(0, 0, 0)",
    "border-top-left-radius": "0px",
    "border-top-right-radius": "0px",
    "border-top-style": "none",
    "border-top-width": "0px",
    "border-top": "0px none rgb(0, 0, 0)",
    "border-width": "0px",
    "border": "0px none rgb(0, 0, 0)",
    "bottom": "auto",
    "box-decoration-break": "slice",
    "box-shadow": "none",
    "box-sizing": "content-box",
    "break-after": "auto",
    "break-before": "auto",
    "break-inside": "auto",
    "buffered-rendering": "auto",
    "caption-side": "top",
    "caret-color": "rgb(0, 0, 0)",
    "clear": "none",
    "clip-path": "none",
    "clip-rule": "nonzero",
    "clip": "auto",
    "color-adjust": "economy",
    "color-interpolation-filters": "linearrgb",
    "color-interpolation": "srgb",
    "color-rendering": "auto",
    "color-scheme": "normal",
    "color": "rgb(0, 0, 0)",
    "column-count": "auto",
    "column-fill": "balance",
    "column-gap": "normal",
    "column-rule-color": "rgb(0, 0, 0)",
    "column-rule-style": "none",
    "column-rule-width": "0px",
    "column-rule": "0px none rgb(0, 0, 0)",
    "column-span": "none",
    "column-width": "auto",
    "columns": "auto auto",
    "contain-intrinsic-block-size": "auto",
    "contain-intrinsic-height": "auto",
    "contain-intrinsic-inline-size": "auto",
    "contain-intrinsic-size": "auto",
    "contain-intrinsic-width": "auto",
    "contain": "none",
    "content-visibility": "visible",
    "content": "normal",
    "counter-increment": "none",
    "counter-reset": "none",
    "counter-set": "none",
    "css-float": "none",
    "cursor": "auto",
    "cx": "0px",
    "cy": "0px",
    "d": "none",
    "direction": "ltr",
    "display": "block",
    "dominant-baseline": "auto",
    "empty-cells": "show",
    "fill-opacity": "1",
    "fill-rule": "nonzero",
    "fill": "rgb(0, 0, 0)",
    "filter": "none",
    "flex-basis": "auto",
    "flex-direction": "row",
    "flex-flow": "row nowrap",
    "flex-grow": "0",
    "flex-shrink": "1",
    "flex-wrap": "nowrap",
    "flex": "0 1 auto",
    "float": "none",
    "flood-color": "rgb(0, 0, 0)",
    "flood-opacity": "1",
    "font-family": "serif",
    "font-feature-settings": "normal",
    "font-kerning": "auto",
    "font-language-override": "normal",
    "font-optical-sizing": "auto",
    "font-size-adjust": "none",
    "font-size": "16px",
    "font-stretch": "100%",
    "font-style": "normal",
    "font-synthesis": "weight style small-caps",
    "font-variant-alternates": "normal",
    "font-variant-caps": "normal",
    "font-variant-east-asian": "normal",
    "font-variant-ligatures": "normal",
    "font-variant-numeric": "normal",
    "font-variant-position": "normal",
    "font-variant": "normal",
    "font-variation-settings": "normal",
    "font-weight": "400",
    "font": "16px serif",
    "forced-color-adjust": "auto",
    "gap": "normal",
    "grid-area": "auto / auto / auto / auto",
    "grid-auto-columns": "auto",
    "grid-auto-flow": "row",
    "grid-auto-rows": "auto",
    "grid-column-end": "auto",
    "grid-column-gap": "normal",
    "grid-column-start": "auto",
    "grid-column": "auto / auto",
    "grid-gap": "normal normal",
    "grid-row-end": "auto",
    "grid-row-gap": "normal",
    "grid-row-start": "auto",
    "grid-row": "auto / auto",
    "grid-template-areas": "none",
    "grid-template-columns": "none",
    "grid-template-rows": "none",
    "grid-template": "none / none / none",
    "grid": "none / none / none / row / auto / auto",
    "height": "auto",
    "height": "auto",
    "hyphens": "manual",
    "image-orientation": "from-image",
    "image-rendering": "auto",
    "ime-mode": "auto",
    "inline-size": "auto",
    "inset-block-end": "auto",
    "inset-block-start": "auto",
    "inset-block": "auto",
    "inset-inline-end": "auto",
    "inset-inline-start": "auto",
    "inset-inline": "auto",
    "inset": "auto",
    "isolation": "auto",
    "justify-content": "normal",
    "justify-items": "normal",
    "justify-self": "auto",
    "left": "auto",
    "letter-spacing": "normal",
    "lighting-color": "rgb(255, 255, 255)",
    "line-break": "auto",
    "line-height": "normal",
    "list-style-image": "none",
    "list-style-position": "outside",
    "list-style-type": "disc",
    "list-style": "outside none disc",
    "margin-block-end": "0px",
    "margin-block-start": "0px",
    "margin-block": "0px",
    "margin-bottom": "0px",
    "margin-inline-end": "0px",
    "margin-inline-start": "0px",
    "margin-inline": "0px",
    "margin-left": "0px",
    "margin-right": "0px",
    "margin-top": "0px",
    "margin": "0px",
    "marker-end": "none",
    "marker-mid": "none",
    "marker-start": "none",
    "marker": "none",
    "mask-clip": "border-box",
    "mask-composite": "add",
    "mask-image": "none",
    "mask-mode": "match-source",
    "mask-origin": "border-box",
    "mask-position-x": "0%",
    "mask-position-y": "0%",
    "mask-position": "0% 0%",
    "mask-repeat": "repeat",
    "mask-size": "auto",
    "mask-type": "luminance",
    "mask": "none",
    "max-block-size": "none",
    "max-height": "none",
    "max-inline-size": "none",
    "max-width": "none",
    "min-block-size": "0px",
    "min-height": "0px",
    "min-inline-size": "0px",
    "min-width": "0px",
    "mix-blend-mode": "normal",
    "object-fit": "fill",
    "object-position": "50% 50%",
    "offset-anchor": "auto",
    "offset-distance": "0px",
    "offset-path": "none",
    "offset-rotate": "auto 0deg",
    "offset-rotate": "auto",
    "offset": "none 0px auto 0deg",
    "opacity": "1",
    "order": "0",
    "orphans": "2",
    "outline-color": "rgb(0, 0, 0)",
    "outline-offset": "0px",
    "outline-style": "none",
    "outline-width": "0px",
    "outline": "rgb(0, 0, 0) none 0px",
    "overflow-anchor": "auto",
    "overflow-block": "visible",
    "overflow-clip-margin": "0px",
    "overflow-inline": "visible",
    "overflow-wrap": "normal",
    "overflow-x": "visible",
    "overflow-y": "visible",
    "overflow": "visible",
    "overscroll-behavior-block": "auto",
    "overscroll-behavior-inline": "auto",
    "overscroll-behavior-x": "auto",
    "overscroll-behavior-y": "auto",
    "overscroll-behavior": "auto",
    "padding-block-end": "0px",
    "padding-block-start": "0px",
    "padding-block": "0px",
    "padding-bottom": "0px",
    "padding-inline-end": "0px",
    "padding-inline-start": "0px",
    "padding-inline": "0px",
    "padding-left": "0px",
    "padding-right": "0px",
    "padding-top": "0px",
    "padding": "0px",
    "page-break-after": "auto",
    "page-break-before": "auto",
    "page-break-inside": "auto",
    "page": "auto",
    "paint-order": "normal",
    "parent-rule": "null",
    "perspective-origin": "50% 50%",
    "perspective-origin": "50% 50%",
    "perspective": "none",
    "place-content": "normal",
    "place-items": "normal",
    "place-self": "auto",
    "pointer-events": "auto",
    "position": "static",
    "quotes": "auto",
    "r": "0px",
    "resize": "none",
    "right": "auto",
    "rotate": "none",
    "row-gap": "normal",
    "ruby-align": "space-around",
    "ruby-position": "alternate",
    "ruby-position": "over",
    "rx": "auto",
    "ry": "auto",
    "scale": "none",
    "scroll-behavior": "auto",
    "scroll-margin-block-end": "0px",
    "scroll-margin-block-start": "0px",
    "scroll-margin-block": "0px",
    "scroll-margin-bottom": "0px",
    "scroll-margin-inline-end": "0px",
    "scroll-margin-inline-start": "0px",
    "scroll-margin-inline": "0px",
    "scroll-margin-left": "0px",
    "scroll-margin-right": "0px",
    "scroll-margin-top": "0px",
    "scroll-margin": "0px",
    "scroll-padding-block-end": "auto",
    "scroll-padding-block-start": "auto",
    "scroll-padding-block": "auto",
    "scroll-padding-bottom": "auto",
    "scroll-padding-inline-end": "auto",
    "scroll-padding-inline-start": "auto",
    "scroll-padding-inline": "auto",
    "scroll-padding-left": "auto",
    "scroll-padding-right": "auto",
    "scroll-padding-top": "auto",
    "scroll-padding": "auto",
    "scroll-snap-align": "none",
    "scroll-snap-stop": "normal",
    "scroll-snap-type": "none",
    "scrollbar-color": "auto",
    "scrollbar-gutter": "auto",
    "scrollbar-width": "auto",
    "shape-image-threshold": "0",
    "shape-margin": "0px",
    "shape-outside": "none",
    "shape-rendering": "auto",
    "speak": "normal",
    "stop-color": "rgb(0, 0, 0)",
    "stop-opacity": "1",
    "stroke-dasharray": "none",
    "stroke-dashoffset": "0px",
    "stroke-linecap": "butt",
    "stroke-linejoin": "miter",
    "stroke-miterlimit": "4",
    "stroke-opacity": "1",
    "stroke-width": "1px",
    "stroke": "none",
    "tab-size": "8",
    "table-layout": "auto",
    "text-align-last": "auto",
    "text-align": "start",
    "text-anchor": "start",
    "text-combine-upright": "none",
    "text-decoration-color": "rgb(0, 0, 0)",
    "text-decoration-line": "none",
    "text-decoration-skip-ink": "auto",
    "text-decoration-style": "solid",
    "text-decoration-thickness": "auto",
    "text-decoration": "none solid rgb(0, 0, 0)",
    "text-decoration": "rgb(0, 0, 0)",
    "text-emphasis-color": "rgb(0, 0, 0)",
    "text-emphasis-position": "over right",
    "text-emphasis-style": "none",
    "text-indent": "0px",
    "text-justify": "auto",
    "text-orientation": "mixed",
    "text-overflow": "clip",
    "text-rendering": "auto",
    "text-shadow": "none",
    "text-size-adjust": "auto",
    "text-transform": "none",
    "text-underline-offset": "auto",
    "text-underline-position": "auto",
    "top": "auto",
    "touch-action": "auto",
    "transform-box": "border-box",
    "transform-box": "view-box",
    "transform-origin": "50% 50%",
    "transform-origin": "50% 50%",
    "transform-style": "flat",
    "transform": "none",
    "transition-delay": "0s",
    "transition-duration": "0s",
    "transition-property": "all",
    "transition-timing-function": "ease",
    "transition": "all 0s ease 0s",
    "translate": "none",
    "unicode-bidi": "isolate",
    "unicode-bidi": "normal",
    "user-select": "auto",
    "vector-effect": "none",
    "vertical-align": "baseline",
    "visibility": "visible",
    "white-space": "normal",
    "widows": "2",
    "width": "auto",
    "will-change": "auto",
    "word-break": "normal",
    "word-spacing": "0px",
    "word-wrap": "normal",
    "writing-mode": "horizontal-tb",
    "x": "0px",
    "y": "0px",
    "z-index": "auto",
    "zoom": "1",
}
const baselineStylesString = `
    display: flex;
    animation: unset !important;
    background: unset !important;
    border-block-color: unset !important;
    border-block-end: unset !important;
    border-block-start: unset !important;
    border-block-style: unset !important;
    border-block-width: unset !important;
    border-block: unset !important;
    border-bottom: unset !important;
    border-color: unset !important;
    border-image: unset !important;
    border-inline-color: unset !important;
    border-inline-end: unset !important;
    border-inline-start: unset !important;
    border-inline-style: unset !important;
    border-inline-width: unset !important;
    border-inline: unset !important;
    border-left: unset !important;
    border-radius: unset !important;
    border-right: unset !important;
    border-style: unset !important;
    border-top: unset !important;
    border-width: unset !important;
    border: unset !important;
    column-rule: unset !important;
    columns: unset !important;
    css-text: unset !important;
    flex-flow: unset !important;
    flex: unset !important;
    font: unset !important;
    gap: unset !important;
    grid-area: unset !important;
    grid-column: unset !important;
    grid-gap: unset !important;
    grid-row: unset !important;
    grid-template: unset !important;
    grid: unset !important;
    inset-block: unset !important;
    inset-inline: unset !important;
    inset: unset !important;
    list-style: unset !important;
    margin-block: unset !important;
    margin-inline: unset !important;
    margin: unset !important;
    marker: unset !important;
    offset: unset !important;
    outline: unset !important;
    overscroll-behavior: unset !important;
    padding-block: unset !important;
    padding-inline: unset !important;
    padding: unset !important;
    place-content: unset !important;
    place-items: unset !important;
    place-self: unset !important;
    scroll-margin-block: unset !important;
    scroll-margin-inline: unset !important;
    scroll-margin: unset !important;
    scroll-padding-block: unset !important;
    scroll-padding-inline: unset !important;
    scroll-padding: unset !important;
    text-emphasis: unset !important;
    block-size: unset !important;
    inline-size: unset !important;
    length: unset !important;
    transition: unset !important;
    
    -moz-animation: unset !important;
    -moz-border-end: unset !important;
    -moz-border-image: unset !important;
    -moz-border-start: unset !important;
    -moz-transition: unset !important;
    -moz-animation-delay: unset !important;
    -moz-animation-direction: unset !important;
    -moz-animation-duration: unset !important;
    -moz-animation-fill-mode: unset !important;
    -moz-animation-iteration-count: unset !important;
    -moz-animation-name: unset !important;
    -moz-animation-play-state: unset !important;
    -moz-animation-timing-function: unset !important;
    -moz-appearance: unset !important;
    -moz-backface-visibility: unset !important;
    -moz-border-end-color: unset !important;
    -moz-border-end-style: unset !important;
    -moz-border-end-width: unset !important;
    -moz-border-start-color: unset !important;
    -moz-border-start-style: unset !important;
    -moz-border-start-width: unset !important;
    -moz-box-align: unset !important;
    -moz-box-direction: unset !important;
    -moz-box-flex: unset !important;
    -moz-box-ordinal-group: unset !important;
    -moz-box-orient: unset !important;
    -moz-box-pack: unset !important;
    -moz-box-sizing: unset !important;
    -moz-float-edge: unset !important;
    -moz-font-feature-settings: unset !important;
    -moz-font-language-override: unset !important;
    -moz-force-broken-image-icon: unset !important;
    -moz-hyphens: unset !important;
    -moz-image-region: unset !important;
    -moz-margin-end: unset !important;
    -moz-margin-start: unset !important;
    -moz-orient: unset !important;
    -moz-osx-font-smoothing: unset !important;
    -moz-padding-end: unset !important;
    -moz-padding-start: unset !important;
    -moz-perspective-origin: unset !important;
    -moz-perspective: unset !important;
    -moz-tab-size: unset !important;
    -moz-text-size-adjust: unset !important;
    -moz-transform-origin: unset !important;
    -moz-transform-style: unset !important;
    -moz-transform: unset !important;
    -moz-transition-delay: unset !important;
    -moz-transition-duration: unset !important;
    -moz-transition-property: unset !important;
    -moz-transition-timing-function: unset !important;
    -moz-user-focus: unset !important;
    -moz-user-input: unset !important;
    -moz-user-modify: unset !important;
    -moz-user-select: unset !important;
    -moz-window-dragging: unset !important;
    
    -webkit-mask-composite: unset !important;
    -webkit-mask: unset !important;
    -webkit-perspective-origin: unset !important;
    -webkit-transform-origin: unset !important;
    -webkit-animation: unset !important;
    -webkit-border-image: unset !important;
    -webkit-border-radius: unset !important;
    -webkit-flex-flow: unset !important;
    -webkit-flex: unset !important;
    -webkit-text-stroke: unset !important;
    -webkit-transition: unset !important;
    -webkit-align-content: unset !important;
    -webkit-align-items: unset !important;
    -webkit-align-self: unset !important;
    -webkit-animation: unset !important;
    -webkit-animation-delay: unset !important;
    -webkit-animation-direction: unset !important;
    -webkit-animation-duration: unset !important;
    -webkit-animation-fill-mode: unset !important;
    -webkit-animation-iteration-count: unset !important;
    -webkit-animation-name: unset !important;
    -webkit-animation-play-state: unset !important;
    -webkit-animation-timing-function: unset !important;
    -webkit-app-region: unset !important;
    -webkit-appearance: unset !important;
    -webkit-backface-visibility: unset !important;
    -webkit-background-clip: unset !important;
    -webkit-background-origin: unset !important;
    -webkit-background-size: unset !important;
    -webkit-border-after: unset !important;
    -webkit-border-after-color: unset !important;
    -webkit-border-after-style: unset !important;
    -webkit-border-after-width: unset !important;
    -webkit-border-before: unset !important;
    -webkit-border-before-color: unset !important;
    -webkit-border-before-style: unset !important;
    -webkit-border-before-width: unset !important;
    -webkit-border-bottom-left-radius: unset !important;
    -webkit-border-bottom-right-radius: unset !important;
    -webkit-border-end: unset !important;
    -webkit-border-end-color: unset !important;
    -webkit-border-end-style: unset !important;
    -webkit-border-end-width: unset !important;
    -webkit-border-horizontal-spacing: unset !important;
    -webkit-border-image: unset !important;
    -webkit-border-radius: unset !important;
    -webkit-border-start: unset !important;
    -webkit-border-start-color: unset !important;
    -webkit-border-start-style: unset !important;
    -webkit-border-start-width: unset !important;
    -webkit-border-top-left-radius: unset !important;
    -webkit-border-top-right-radius: unset !important;
    -webkit-border-vertical-spacing: unset !important;
    -webkit-box-align: unset !important;
    -webkit-box-decoration-break: unset !important;
    -webkit-box-direction: unset !important;
    -webkit-box-flex: unset !important;
    -webkit-box-ordinal-group: unset !important;
    -webkit-box-orient: unset !important;
    -webkit-box-pack: unset !important;
    -webkit-box-reflect: unset !important;
    -webkit-box-shadow: unset !important;
    -webkit-box-sizing: unset !important;
    -webkit-clip-path: unset !important;
    -webkit-column-break-after: unset !important;
    -webkit-column-break-before: unset !important;
    -webkit-column-break-inside: unset !important;
    -webkit-column-count: unset !important;
    -webkit-column-gap: unset !important;
    -webkit-column-rule: unset !important;
    -webkit-column-rule-color: unset !important;
    -webkit-column-rule-style: unset !important;
    -webkit-column-rule-width: unset !important;
    -webkit-column-span: unset !important;
    -webkit-column-width: unset !important;
    -webkit-columns: unset !important;
    -webkit-filter: unset !important;
    -webkit-flex: unset !important;
    -webkit-flex-basis: unset !important;
    -webkit-flex-direction: unset !important;
    -webkit-flex-flow: unset !important;
    -webkit-flex-grow: unset !important;
    -webkit-flex-shrink: unset !important;
    -webkit-flex-wrap: unset !important;
    -webkit-font-feature-settings: unset !important;
    -webkit-font-smoothing: unset !important;
    -webkit-highlight: unset !important;
    -webkit-hyphenate-character: unset !important;
    -webkit-justify-content: unset !important;
    -webkit-line-break: unset !important;
    -webkit-line-clamp: unset !important;
    -webkit-locale: unset !important;
    -webkit-logical-height: unset !important;
    -webkit-logical-width: unset !important;
    -webkit-margin-after: unset !important;
    -webkit-margin-before: unset !important;
    -webkit-margin-end: unset !important;
    -webkit-margin-start: unset !important;
    -webkit-mask-box-image: unset !important;
    -webkit-mask-box-image-outset: unset !important;
    -webkit-mask-box-image-repeat: unset !important;
    -webkit-mask-box-image-slice: unset !important;
    -webkit-mask-box-image-source: unset !important;
    -webkit-mask-box-image-width: unset !important;
    -webkit-mask-clip: unset !important;
    -webkit-mask-composite: unset !important;
    -webkit-mask-image: unset !important;
    -webkit-mask-origin: unset !important;
    -webkit-mask-position: unset !important;
    -webkit-mask-position-x: unset !important;
    -webkit-mask-position-y: unset !important;
    -webkit-mask-repeat: unset !important;
    -webkit-mask-size: unset !important;
    -webkit-max-logical-height: unset !important;
    -webkit-max-logical-width: unset !important;
    -webkit-min-logical-height: unset !important;
    -webkit-min-logical-width: unset !important;
    -webkit-opacity: unset !important;
    -webkit-order: unset !important;
    -webkit-padding-after: unset !important;
    -webkit-padding-before: unset !important;
    -webkit-padding-end: unset !important;
    -webkit-padding-start: unset !important;
    -webkit-perspective: unset !important;
    -webkit-perspective-origin: unset !important;
    -webkit-print-color-adjust: unset !important;
    -webkit-rtl-ordering: unset !important;
    -webkit-ruby-position: unset !important;
    -webkit-shape-image-threshold: unset !important;
    -webkit-shape-margin: unset !important;
    -webkit-shape-outside: unset !important;
    -webkit-tap-highlight-color: unset !important;
    -webkit-text-combine: unset !important;
    -webkit-text-decorations-in-effect: unset !important;
    -webkit-text-emphasis-color: unset !important;
    -webkit-text-emphasis-position: unset !important;
    -webkit-text-emphasis-style: unset !important;
    -webkit-text-fill-color: unset !important;
    -webkit-text-orientation: unset !important;
    -webkit-text-security: unset !important;
    -webkit-text-size-adjust: unset !important;
    -webkit-text-stroke-color: unset !important;
    -webkit-text-stroke-width: unset !important;
    -webkit-transform: unset !important;
    -webkit-transform-origin: unset !important;
    -webkit-transform-style: unset !important;
    -webkit-transition: unset !important;
    -webkit-transition-delay: unset !important;
    -webkit-transition-duration: unset !important;
    -webkit-transition-property: unset !important;
    -webkit-transition-timing-function: unset !important;
    -webkit-user-drag: unset !important;
    -webkit-user-modify: unset !important;
    -webkit-user-select: unset !important;
    -webkit-writing-mode: unset !important;
    
    accent-color: auto !important;
    align-content: normal !important;
    align-items: normal !important;
    align-self: auto !important;
    alignment-baseline: auto !important;
    animation-delay: 0s !important;
    animation-direction: normal !important;
    animation-duration: 0s !important;
    animation-fill-mode: none !important;
    animation-iteration-count: 1 !important;
    animation-name: none !important;
    animation-play-state: running !important;
    animation-timing-function: ease !important;
    animation: none 0s ease 0s 1 normal none running !important;
    app-region: none !important;
    appearance: none !important;
    aspect-ratio: auto !important;
    backdrop-filter: none !important;
    backface-visibility: visible !important;
    background-attachment: scroll !important;
    background-blend-mode: normal !important;
    background-clip: border-box !important;
    background-color: rgba(0, 0, 0, 0) !important;
    background-image: none !important;
    background-origin: padding-box !important;
    background-position-x: 0% !important;
    background-position-y: 0% !important;
    background-position: 0% 0% !important;
    background-repeat: repeat !important;
    background-size: auto !important;
    background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box !important;
    baseline-shift: 0px !important;
    block-size: auto !important;
    border-block-color: rgb(0, 0, 0) !important;
    border-block-end-color: rgb(0, 0, 0) !important;
    border-block-end-style: none !important;
    border-block-end-width: 0px !important;
    border-block-end: 0px none rgb(0, 0, 0) !important;
    border-block-start-color: rgb(0, 0, 0) !important;
    border-block-start-style: none !important;
    border-block-start-width: 0px !important;
    border-block-start: 0px none rgb(0, 0, 0) !important;
    border-block-style: none !important;
    border-block-width: 0px !important;
    border-block: 0px none rgb(0, 0, 0) !important;
    border-bottom-color: rgb(0, 0, 0) !important;
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-bottom-style: none !important;
    border-bottom-width: 0px !important;
    border-bottom: 0px none rgb(0, 0, 0) !important;
    border-collapse: separate !important;
    border-color: rgb(0, 0, 0) !important;
    border-end-end-radius: 0px !important;
    border-end-start-radius: 0px !important;
    border-image-outset: 0 !important;
    border-image-repeat: stretch !important;
    border-image-slice: 100% !important;
    border-image-source: none !important;
    border-image-width: 1 !important;
    border-image: none !important;
    border-inline-color: rgb(0, 0, 0) !important;
    border-inline-end-color: rgb(0, 0, 0) !important;
    border-inline-end-style: none !important;
    border-inline-end-width: 0px !important;
    border-inline-end: 0px none rgb(0, 0, 0) !important;
    border-inline-start-color: rgb(0, 0, 0) !important;
    border-inline-start-style: none !important;
    border-inline-start-width: 0px !important;
    border-inline-start: 0px none rgb(0, 0, 0) !important;
    border-inline-style: none !important;
    border-inline-width: 0px !important;
    border-inline: 0px none rgb(0, 0, 0) !important;
    border-left-color: rgb(0, 0, 0) !important;
    border-left-style: none !important;
    border-left-width: 0px !important;
    border-left: 0px none rgb(0, 0, 0) !important;
    border-radius: 0px !important;
    border-right-color: rgb(0, 0, 0) !important;
    border-right-style: none !important;
    border-right-width: 0px !important;
    border-right: 0px none rgb(0, 0, 0) !important;
    border-spacing: 0px 0px !important;
    border-start-end-radius: 0px !important;
    border-start-start-radius: 0px !important;
    border-style: none !important;
    border-top-color: rgb(0, 0, 0) !important;
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
    border-top-style: none !important;
    border-top-width: 0px !important;
    border-top: 0px none rgb(0, 0, 0) !important;
    border-width: 0px !important;
    border: 0px none rgb(0, 0, 0) !important;
    bottom: auto !important;
    box-decoration-break: slice !important;
    box-shadow: none !important;
    box-sizing: content-box !important;
    break-after: auto !important;
    break-before: auto !important;
    break-inside: auto !important;
    buffered-rendering: auto !important;
    caption-side: top !important;
    caret-color: rgb(0, 0, 0) !important;
    clear: none !important;
    clip-path: none !important;
    clip-rule: nonzero !important;
    clip: auto !important;
    color-adjust: economy !important;
    color-interpolation-filters: linearrgb !important;
    color-interpolation: srgb !important;
    color-rendering: auto !important;
    color-scheme: normal !important;
    color: rgb(0, 0, 0) !important;
    column-count: auto !important;
    column-fill: balance !important;
    column-gap: normal !important;
    column-rule-color: rgb(0, 0, 0) !important;
    column-rule-style: none !important;
    column-rule-width: 0px !important;
    column-rule: 0px none rgb(0, 0, 0) !important;
    column-span: none !important;
    column-width: auto !important;
    columns: auto auto !important;
    contain-intrinsic-block-size: auto !important;
    contain-intrinsic-height: auto !important;
    contain-intrinsic-inline-size: auto !important;
    contain-intrinsic-size: auto !important;
    contain-intrinsic-width: auto !important;
    contain: none !important;
    content-visibility: visible !important;
    content: normal !important;
    counter-increment: none !important;
    counter-reset: none !important;
    counter-set: none !important;
    css-float: none !important;
    cursor: auto !important;
    cx: 0px !important;
    cy: 0px !important;
    d: none !important;
    direction: ltr !important;
    dominant-baseline: auto !important;
    empty-cells: show !important;
    fill-opacity: 1 !important;
    fill-rule: nonzero !important;
    fill: rgb(0, 0, 0) !important;
    filter: none !important;
    flex-basis: auto !important;
    flex-direction: row !important;
    flex-flow: row nowrap !important;
    flex-grow: 0 !important;
    flex-shrink: 1 !important;
    flex-wrap: nowrap !important;
    flex: 0 1 auto !important;
    float: none !important;
    flood-color: rgb(0, 0, 0) !important;
    flood-opacity: 1 !important;
    font-family: sans-serif !important;
    font-feature-settings: normal !important;
    font-kerning: auto !important;
    font-language-override: normal !important;
    font-optical-sizing: auto !important;
    font-size-adjust: none !important;
    font-size: 16px !important;
    font-stretch: 100% !important;
    font-style: normal !important;
    font-synthesis: weight style small-caps !important;
    font-variant-alternates: normal !important;
    font-variant-caps: normal !important;
    font-variant-east-asian: normal !important;
    font-variant-ligatures: normal !important;
    font-variant-numeric: normal !important;
    font-variant-position: normal !important;
    font-variant: normal !important;
    font-variation-settings: normal !important;
    font-weight: 400 !important;
    font: 16px sans-serif !important;
    forced-color-adjust: auto !important;
    gap: normal !important;
    grid-area: auto / auto / auto / auto !important;
    grid-auto-columns: auto !important;
    grid-auto-flow: row !important;
    grid-auto-rows: auto !important;
    grid-column-end: auto !important;
    grid-column-gap: normal !important;
    grid-column-start: auto !important;
    grid-column: auto / auto !important;
    grid-gap: normal normal !important;
    grid-row-end: auto !important;
    grid-row-gap: normal !important;
    grid-row-start: auto !important;
    grid-row: auto / auto !important;
    grid-template-areas: none !important;
    grid-template-columns: none !important;
    grid-template-rows: none !important;
    grid-template: none / none / none !important;
    grid: none / none / none / row / auto / auto !important;
    height: auto !important;
    height: auto !important;
    hyphens: manual !important;
    image-orientation: from-image !important;
    image-rendering: auto !important;
    ime-mode: auto !important;
    inline-size: auto !important;
    inset-block-end: auto !important;
    inset-block-start: auto !important;
    inset-block: auto !important;
    inset-inline-end: auto !important;
    inset-inline-start: auto !important;
    inset-inline: auto !important;
    inset: auto !important;
    isolation: auto !important;
    justify-content: normal !important;
    justify-items: normal !important;
    justify-self: auto !important;
    left: auto !important;
    letter-spacing: normal !important;
    lighting-color: rgb(255, 255, 255) !important;
    line-break: auto !important;
    line-height: normal !important;
    list-style-image: none !important;
    list-style-position: outside !important;
    list-style-type: disc !important;
    list-style: outside none disc !important;
    margin-block-end: 0px !important;
    margin-block-start: 0px !important;
    margin-block: 0px !important;
    margin-bottom: 0px !important;
    margin-inline-end: 0px !important;
    margin-inline-start: 0px !important;
    margin-inline: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
    margin: 0px !important;
    marker-end: none !important;
    marker-mid: none !important;
    marker-start: none !important;
    marker: none !important;
    mask-clip: border-box !important;
    mask-composite: add !important;
    mask-image: none !important;
    mask-mode: match-source !important;
    mask-origin: border-box !important;
    mask-position-x: 0% !important;
    mask-position-y: 0% !important;
    mask-position: 0% 0% !important;
    mask-repeat: repeat !important;
    mask-size: auto !important;
    mask-type: luminance !important;
    mask: none !important;
    max-block-size: none !important;
    max-height: none !important;
    max-inline-size: none !important;
    max-width: none !important;
    min-block-size: 0px !important;
    min-height: 0px !important;
    min-inline-size: 0px !important;
    min-width: 0px !important;
    mix-blend-mode: normal !important;
    object-fit: fill !important;
    object-position: 50% 50% !important;
    offset-anchor: auto !important;
    offset-distance: 0px !important;
    offset-path: none !important;
    offset-rotate: auto 0deg !important;
    offset-rotate: auto !important;
    offset: none 0px auto 0deg !important;
    opacity: 1 !important;
    order: 0 !important;
    orphans: 2 !important;
    outline-color: rgb(0, 0, 0) !important;
    outline-offset: 0px !important;
    outline-style: none !important;
    outline-width: 0px !important;
    outline: rgb(0, 0, 0) none 0px !important;
    overflow-anchor: auto !important;
    overflow-block: visible !important;
    overflow-clip-margin: 0px !important;
    overflow-inline: visible !important;
    overflow-wrap: normal !important;
    overflow-x: visible !important;
    overflow-y: visible !important;
    overflow: visible !important;
    overscroll-behavior-block: auto !important;
    overscroll-behavior-inline: auto !important;
    overscroll-behavior-x: auto !important;
    overscroll-behavior-y: auto !important;
    overscroll-behavior: auto !important;
    padding-block-end: 0px !important;
    padding-block-start: 0px !important;
    padding-block: 0px !important;
    padding-bottom: 0px !important;
    padding-inline-end: 0px !important;
    padding-inline-start: 0px !important;
    padding-inline: 0px !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
    padding-top: 0px !important;
    padding: 0px !important;
    page-break-after: auto !important;
    page-break-before: auto !important;
    page-break-inside: auto !important;
    page: auto !important;
    paint-order: normal !important;
    parent-rule: null !important;
    perspective-origin: 50% 50% !important;
    perspective-origin: 50% 50% !important;
    perspective: none !important;
    place-content: normal !important;
    place-items: normal !important;
    place-self: auto !important;
    pointer-events: auto !important;
    position: static !important;
    quotes: auto !important;
    r: 0px !important;
    resize: none !important;
    right: auto !important;
    rotate: none !important;
    row-gap: normal !important;
    ruby-align: space-around !important;
    ruby-position: alternate !important;
    ruby-position: over !important;
    rx: auto !important;
    ry: auto !important;
    scale: none !important;
    scroll-behavior: auto !important;
    scroll-margin-block-end: 0px !important;
    scroll-margin-block-start: 0px !important;
    scroll-margin-block: 0px !important;
    scroll-margin-bottom: 0px !important;
    scroll-margin-inline-end: 0px !important;
    scroll-margin-inline-start: 0px !important;
    scroll-margin-inline: 0px !important;
    scroll-margin-left: 0px !important;
    scroll-margin-right: 0px !important;
    scroll-margin-top: 0px !important;
    scroll-margin: 0px !important;
    scroll-padding-block-end: auto !important;
    scroll-padding-block-start: auto !important;
    scroll-padding-block: auto !important;
    scroll-padding-bottom: auto !important;
    scroll-padding-inline-end: auto !important;
    scroll-padding-inline-start: auto !important;
    scroll-padding-inline: auto !important;
    scroll-padding-left: auto !important;
    scroll-padding-right: auto !important;
    scroll-padding-top: auto !important;
    scroll-padding: auto !important;
    scroll-snap-align: none !important;
    scroll-snap-stop: normal !important;
    scroll-snap-type: none !important;
    scrollbar-color: auto !important;
    scrollbar-gutter: auto !important;
    scrollbar-width: auto !important;
    shape-image-threshold: 0 !important;
    shape-margin: 0px !important;
    shape-outside: none !important;
    shape-rendering: auto !important;
    speak: normal !important;
    stop-color: rgb(0, 0, 0) !important;
    stop-opacity: 1 !important;
    stroke-dasharray: none !important;
    stroke-dashoffset: 0px !important;
    stroke-linecap: butt !important;
    stroke-linejoin: miter !important;
    stroke-miterlimit: 4 !important;
    stroke-opacity: 1 !important;
    stroke-width: 1px !important;
    stroke: none !important;
    tab-size: 8 !important;
    table-layout: auto !important;
    text-align-last: auto !important;
    text-align: start !important;
    text-anchor: start !important;
    text-combine-upright: none !important;
    text-decoration-color: rgb(0, 0, 0) !important;
    text-decoration-line: none !important;
    text-decoration-skip-ink: auto !important;
    text-decoration-style: solid !important;
    text-decoration-thickness: auto !important;
    text-decoration: none solid rgb(0, 0, 0) !important;
    text-decoration: rgb(0, 0, 0) !important;
    text-emphasis-color: rgb(0, 0, 0) !important;
    text-emphasis-position: over right !important;
    text-emphasis-style: none !important;
    text-indent: 0px !important;
    text-justify: auto !important;
    text-orientation: mixed !important;
    text-overflow: clip !important;
    text-rendering: auto !important;
    text-shadow: none !important;
    text-size-adjust: auto !important;
    text-transform: none !important;
    text-underline-offset: auto !important;
    text-underline-position: auto !important;
    top: auto !important;
    touch-action: auto !important;
    transform-box: border-box !important;
    transform-box: view-box !important;
    transform-origin: 50% 50% !important;
    transform-origin: 50% 50% !important;
    transform-style: flat !important;
    transform: none !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    transition-property: all !important;
    transition-timing-function: ease !important;
    transition: all 0s ease 0s !important;
    translate: none !important;
    unicode-bidi: isolate !important;
    unicode-bidi: normal !important;
    user-select: auto !important;
    vector-effect: none !important;
    vertical-align: baseline !important;
    visibility: visible !important;
    white-space: normal !important;
    widows: 2 !important;
    width: auto !important;
    will-change: auto !important;
    word-break: normal !important;
    word-spacing: 0px !important;
    word-wrap: normal !important;
    writing-mode: horizontal-tb !important;
    x: 0px !important;
    y: 0px !important;
    z-index: auto !important;
    zoom: 1 !important;
`
const baselineStyleElement = document.createElement("style")
baselineStyleElement.innerHTML = `
    /* note the following two are special: */
        /* all: unset !important; */
        /* display: block !important; */
    * {
        animation: unset !important;
        background: unset !important;
        border-block-color: unset !important;
        border-block-end: unset !important;
        border-block-start: unset !important;
        border-block-style: unset !important;
        border-block-width: unset !important;
        border-block: unset !important;
        border-bottom: unset !important;
        border-color: unset !important;
        border-image: unset !important;
        border-inline-color: unset !important;
        border-inline-end: unset !important;
        border-inline-start: unset !important;
        border-inline-style: unset !important;
        border-inline-width: unset !important;
        border-inline: unset !important;
        border-left: unset !important;
        border-radius: unset !important;
        border-right: unset !important;
        border-style: unset !important;
        border-top: unset !important;
        border-width: unset !important;
        border: unset !important;
        column-rule: unset !important;
        columns: unset !important;
        css-text: unset !important;
        flex-flow: unset !important;
        flex: unset !important;
        font: unset !important;
        gap: unset !important;
        grid-area: unset !important;
        grid-column: unset !important;
        grid-gap: unset !important;
        grid-row: unset !important;
        grid-template: unset !important;
        grid: unset !important;
        inset-block: unset !important;
        inset-inline: unset !important;
        inset: unset !important;
        list-style: unset !important;
        margin-block: unset !important;
        margin-inline: unset !important;
        margin: unset !important;
        marker: unset !important;
        offset: unset !important;
        outline: unset !important;
        overscroll-behavior: unset !important;
        padding-block: unset !important;
        padding-inline: unset !important;
        padding: unset !important;
        place-content: unset !important;
        place-items: unset !important;
        place-self: unset !important;
        scroll-margin-block: unset !important;
        scroll-margin-inline: unset !important;
        scroll-margin: unset !important;
        scroll-padding-block: unset !important;
        scroll-padding-inline: unset !important;
        scroll-padding: unset !important;
        text-emphasis: unset !important;
        block-size: unset !important;
        inline-size: unset !important;
        length: unset !important;
        transition: unset !important;
        
        -moz-animation: unset !important;
        -moz-border-end: unset !important;
        -moz-border-image: unset !important;
        -moz-border-start: unset !important;
        -moz-transition: unset !important;
        -moz-animation-delay: unset !important;
        -moz-animation-direction: unset !important;
        -moz-animation-duration: unset !important;
        -moz-animation-fill-mode: unset !important;
        -moz-animation-iteration-count: unset !important;
        -moz-animation-name: unset !important;
        -moz-animation-play-state: unset !important;
        -moz-animation-timing-function: unset !important;
        -moz-appearance: unset !important;
        -moz-backface-visibility: unset !important;
        -moz-border-end-color: unset !important;
        -moz-border-end-style: unset !important;
        -moz-border-end-width: unset !important;
        -moz-border-start-color: unset !important;
        -moz-border-start-style: unset !important;
        -moz-border-start-width: unset !important;
        -moz-box-align: unset !important;
        -moz-box-direction: unset !important;
        -moz-box-flex: unset !important;
        -moz-box-ordinal-group: unset !important;
        -moz-box-orient: unset !important;
        -moz-box-pack: unset !important;
        -moz-box-sizing: unset !important;
        -moz-float-edge: unset !important;
        -moz-font-feature-settings: unset !important;
        -moz-font-language-override: unset !important;
        -moz-force-broken-image-icon: unset !important;
        -moz-hyphens: unset !important;
        -moz-image-region: unset !important;
        -moz-margin-end: unset !important;
        -moz-margin-start: unset !important;
        -moz-orient: unset !important;
        -moz-osx-font-smoothing: unset !important;
        -moz-padding-end: unset !important;
        -moz-padding-start: unset !important;
        -moz-perspective-origin: unset !important;
        -moz-perspective: unset !important;
        -moz-tab-size: unset !important;
        -moz-text-size-adjust: unset !important;
        -moz-transform-origin: unset !important;
        -moz-transform-style: unset !important;
        -moz-transform: unset !important;
        -moz-transition-delay: unset !important;
        -moz-transition-duration: unset !important;
        -moz-transition-property: unset !important;
        -moz-transition-timing-function: unset !important;
        -moz-user-focus: unset !important;
        -moz-user-input: unset !important;
        -moz-user-modify: unset !important;
        -moz-user-select: unset !important;
        -moz-window-dragging: unset !important;
        
        -webkit-mask-composite: unset !important;
        -webkit-mask: unset !important;
        -webkit-perspective-origin: unset !important;
        -webkit-transform-origin: unset !important;
        -webkit-animation: unset !important;
        -webkit-border-image: unset !important;
        -webkit-border-radius: unset !important;
        -webkit-flex-flow: unset !important;
        -webkit-flex: unset !important;
        -webkit-text-stroke: unset !important;
        -webkit-transition: unset !important;
        -webkit-align-content: unset !important;
        -webkit-align-items: unset !important;
        -webkit-align-self: unset !important;
        -webkit-animation: unset !important;
        -webkit-animation-delay: unset !important;
        -webkit-animation-direction: unset !important;
        -webkit-animation-duration: unset !important;
        -webkit-animation-fill-mode: unset !important;
        -webkit-animation-iteration-count: unset !important;
        -webkit-animation-name: unset !important;
        -webkit-animation-play-state: unset !important;
        -webkit-animation-timing-function: unset !important;
        -webkit-app-region: unset !important;
        -webkit-appearance: unset !important;
        -webkit-backface-visibility: unset !important;
        -webkit-background-clip: unset !important;
        -webkit-background-origin: unset !important;
        -webkit-background-size: unset !important;
        -webkit-border-after: unset !important;
        -webkit-border-after-color: unset !important;
        -webkit-border-after-style: unset !important;
        -webkit-border-after-width: unset !important;
        -webkit-border-before: unset !important;
        -webkit-border-before-color: unset !important;
        -webkit-border-before-style: unset !important;
        -webkit-border-before-width: unset !important;
        -webkit-border-bottom-left-radius: unset !important;
        -webkit-border-bottom-right-radius: unset !important;
        -webkit-border-end: unset !important;
        -webkit-border-end-color: unset !important;
        -webkit-border-end-style: unset !important;
        -webkit-border-end-width: unset !important;
        -webkit-border-horizontal-spacing: unset !important;
        -webkit-border-image: unset !important;
        -webkit-border-radius: unset !important;
        -webkit-border-start: unset !important;
        -webkit-border-start-color: unset !important;
        -webkit-border-start-style: unset !important;
        -webkit-border-start-width: unset !important;
        -webkit-border-top-left-radius: unset !important;
        -webkit-border-top-right-radius: unset !important;
        -webkit-border-vertical-spacing: unset !important;
        -webkit-box-align: unset !important;
        -webkit-box-decoration-break: unset !important;
        -webkit-box-direction: unset !important;
        -webkit-box-flex: unset !important;
        -webkit-box-ordinal-group: unset !important;
        -webkit-box-orient: unset !important;
        -webkit-box-pack: unset !important;
        -webkit-box-reflect: unset !important;
        -webkit-box-shadow: unset !important;
        -webkit-box-sizing: unset !important;
        -webkit-clip-path: unset !important;
        -webkit-column-break-after: unset !important;
        -webkit-column-break-before: unset !important;
        -webkit-column-break-inside: unset !important;
        -webkit-column-count: unset !important;
        -webkit-column-gap: unset !important;
        -webkit-column-rule: unset !important;
        -webkit-column-rule-color: unset !important;
        -webkit-column-rule-style: unset !important;
        -webkit-column-rule-width: unset !important;
        -webkit-column-span: unset !important;
        -webkit-column-width: unset !important;
        -webkit-columns: unset !important;
        -webkit-filter: unset !important;
        -webkit-flex: unset !important;
        -webkit-flex-basis: unset !important;
        -webkit-flex-direction: unset !important;
        -webkit-flex-flow: unset !important;
        -webkit-flex-grow: unset !important;
        -webkit-flex-shrink: unset !important;
        -webkit-flex-wrap: unset !important;
        -webkit-font-feature-settings: unset !important;
        -webkit-font-smoothing: unset !important;
        -webkit-highlight: unset !important;
        -webkit-hyphenate-character: unset !important;
        -webkit-justify-content: unset !important;
        -webkit-line-break: unset !important;
        -webkit-line-clamp: unset !important;
        -webkit-locale: unset !important;
        -webkit-logical-height: unset !important;
        -webkit-logical-width: unset !important;
        -webkit-margin-after: unset !important;
        -webkit-margin-before: unset !important;
        -webkit-margin-end: unset !important;
        -webkit-margin-start: unset !important;
        -webkit-mask-box-image: unset !important;
        -webkit-mask-box-image-outset: unset !important;
        -webkit-mask-box-image-repeat: unset !important;
        -webkit-mask-box-image-slice: unset !important;
        -webkit-mask-box-image-source: unset !important;
        -webkit-mask-box-image-width: unset !important;
        -webkit-mask-clip: unset !important;
        -webkit-mask-composite: unset !important;
        -webkit-mask-image: unset !important;
        -webkit-mask-origin: unset !important;
        -webkit-mask-position: unset !important;
        -webkit-mask-position-x: unset !important;
        -webkit-mask-position-y: unset !important;
        -webkit-mask-repeat: unset !important;
        -webkit-mask-size: unset !important;
        -webkit-max-logical-height: unset !important;
        -webkit-max-logical-width: unset !important;
        -webkit-min-logical-height: unset !important;
        -webkit-min-logical-width: unset !important;
        -webkit-opacity: unset !important;
        -webkit-order: unset !important;
        -webkit-padding-after: unset !important;
        -webkit-padding-before: unset !important;
        -webkit-padding-end: unset !important;
        -webkit-padding-start: unset !important;
        -webkit-perspective: unset !important;
        -webkit-perspective-origin: unset !important;
        -webkit-print-color-adjust: unset !important;
        -webkit-rtl-ordering: unset !important;
        -webkit-ruby-position: unset !important;
        -webkit-shape-image-threshold: unset !important;
        -webkit-shape-margin: unset !important;
        -webkit-shape-outside: unset !important;
        -webkit-tap-highlight-color: unset !important;
        -webkit-text-combine: unset !important;
        -webkit-text-decorations-in-effect: unset !important;
        -webkit-text-emphasis-color: unset !important;
        -webkit-text-emphasis-position: unset !important;
        -webkit-text-emphasis-style: unset !important;
        -webkit-text-fill-color: unset !important;
        -webkit-text-orientation: unset !important;
        -webkit-text-security: unset !important;
        -webkit-text-size-adjust: unset !important;
        -webkit-text-stroke-color: unset !important;
        -webkit-text-stroke-width: unset !important;
        -webkit-transform: unset !important;
        -webkit-transform-origin: unset !important;
        -webkit-transform-style: unset !important;
        -webkit-transition: unset !important;
        -webkit-transition-delay: unset !important;
        -webkit-transition-duration: unset !important;
        -webkit-transition-property: unset !important;
        -webkit-transition-timing-function: unset !important;
        -webkit-user-drag: unset !important;
        -webkit-user-modify: unset !important;
        -webkit-user-select: unset !important;
        -webkit-writing-mode: unset !important;
        
        accent-color: auto !important;
        align-content: normal !important;
        align-items: normal !important;
        align-self: auto !important;
        alignment-baseline: auto !important;
        animation-delay: 0s !important;
        animation-direction: normal !important;
        animation-duration: 0s !important;
        animation-fill-mode: none !important;
        animation-iteration-count: 1 !important;
        animation-name: none !important;
        animation-play-state: running !important;
        animation-timing-function: ease !important;
        animation: none 0s ease 0s 1 normal none running !important;
        app-region: none !important;
        appearance: none !important;
        aspect-ratio: auto !important;
        backdrop-filter: none !important;
        backface-visibility: visible !important;
        background-attachment: scroll !important;
        background-blend-mode: normal !important;
        background-clip: border-box !important;
        background-color: rgba(0, 0, 0, 0) !important;
        background-image: none !important;
        background-origin: padding-box !important;
        background-position-x: 0% !important;
        background-position-y: 0% !important;
        background-position: 0% 0% !important;
        background-repeat: repeat !important;
        background-size: auto !important;
        background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box !important;
        baseline-shift: 0px !important;
        block-size: auto !important;
        border-block-color: rgb(0, 0, 0) !important;
        border-block-end-color: rgb(0, 0, 0) !important;
        border-block-end-style: none !important;
        border-block-end-width: 0px !important;
        border-block-end: 0px none rgb(0, 0, 0) !important;
        border-block-start-color: rgb(0, 0, 0) !important;
        border-block-start-style: none !important;
        border-block-start-width: 0px !important;
        border-block-start: 0px none rgb(0, 0, 0) !important;
        border-block-style: none !important;
        border-block-width: 0px !important;
        border-block: 0px none rgb(0, 0, 0) !important;
        border-bottom-color: rgb(0, 0, 0) !important;
        border-bottom-left-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
        border-bottom-style: none !important;
        border-bottom-width: 0px !important;
        border-bottom: 0px none rgb(0, 0, 0) !important;
        border-collapse: separate !important;
        border-color: rgb(0, 0, 0) !important;
        border-end-end-radius: 0px !important;
        border-end-start-radius: 0px !important;
        border-image-outset: 0 !important;
        border-image-repeat: stretch !important;
        border-image-slice: 100% !important;
        border-image-source: none !important;
        border-image-width: 1 !important;
        border-image: none !important;
        border-inline-color: rgb(0, 0, 0) !important;
        border-inline-end-color: rgb(0, 0, 0) !important;
        border-inline-end-style: none !important;
        border-inline-end-width: 0px !important;
        border-inline-end: 0px none rgb(0, 0, 0) !important;
        border-inline-start-color: rgb(0, 0, 0) !important;
        border-inline-start-style: none !important;
        border-inline-start-width: 0px !important;
        border-inline-start: 0px none rgb(0, 0, 0) !important;
        border-inline-style: none !important;
        border-inline-width: 0px !important;
        border-inline: 0px none rgb(0, 0, 0) !important;
        border-left-color: rgb(0, 0, 0) !important;
        border-left-style: none !important;
        border-left-width: 0px !important;
        border-left: 0px none rgb(0, 0, 0) !important;
        border-radius: 0px !important;
        border-right-color: rgb(0, 0, 0) !important;
        border-right-style: none !important;
        border-right-width: 0px !important;
        border-right: 0px none rgb(0, 0, 0) !important;
        border-spacing: 0px 0px !important;
        border-start-end-radius: 0px !important;
        border-start-start-radius: 0px !important;
        border-style: none !important;
        border-top-color: rgb(0, 0, 0) !important;
        border-top-left-radius: 0px !important;
        border-top-right-radius: 0px !important;
        border-top-style: none !important;
        border-top-width: 0px !important;
        border-top: 0px none rgb(0, 0, 0) !important;
        border-width: 0px !important;
        border: 0px none rgb(0, 0, 0) !important;
        bottom: auto !important;
        box-decoration-break: slice !important;
        box-shadow: none !important;
        box-sizing: content-box !important;
        break-after: auto !important;
        break-before: auto !important;
        break-inside: auto !important;
        buffered-rendering: auto !important;
        caption-side: top !important;
        caret-color: rgb(0, 0, 0) !important;
        clear: none !important;
        clip-path: none !important;
        clip-rule: nonzero !important;
        clip: auto !important;
        color-adjust: economy !important;
        color-interpolation-filters: linearrgb !important;
        color-interpolation: srgb !important;
        color-rendering: auto !important;
        color-scheme: normal !important;
        color: rgb(0, 0, 0) !important;
        column-count: auto !important;
        column-fill: balance !important;
        column-gap: normal !important;
        column-rule-color: rgb(0, 0, 0) !important;
        column-rule-style: none !important;
        column-rule-width: 0px !important;
        column-rule: 0px none rgb(0, 0, 0) !important;
        column-span: none !important;
        column-width: auto !important;
        columns: auto auto !important;
        contain-intrinsic-block-size: auto !important;
        contain-intrinsic-height: auto !important;
        contain-intrinsic-inline-size: auto !important;
        contain-intrinsic-size: auto !important;
        contain-intrinsic-width: auto !important;
        contain: none !important;
        content-visibility: visible !important;
        content: normal !important;
        counter-increment: none !important;
        counter-reset: none !important;
        counter-set: none !important;
        css-float: none !important;
        cursor: auto !important;
        cx: 0px !important;
        cy: 0px !important;
        d: none !important;
        direction: ltr !important;
        dominant-baseline: auto !important;
        empty-cells: show !important;
        fill-opacity: 1 !important;
        fill-rule: nonzero !important;
        fill: rgb(0, 0, 0) !important;
        filter: none !important;
        flex-basis: auto !important;
        flex-direction: row !important;
        flex-flow: row nowrap !important;
        flex-grow: 0 !important;
        flex-shrink: 1 !important;
        flex-wrap: nowrap !important;
        flex: 0 1 auto !important;
        float: none !important;
        flood-color: rgb(0, 0, 0) !important;
        flood-opacity: 1 !important;
        font-family: sans-serif !important;
        font-feature-settings: normal !important;
        font-kerning: auto !important;
        font-language-override: normal !important;
        font-optical-sizing: auto !important;
        font-size-adjust: none !important;
        font-size: 16px !important;
        font-stretch: 100% !important;
        font-style: normal !important;
        font-synthesis: weight style small-caps !important;
        font-variant-alternates: normal !important;
        font-variant-caps: normal !important;
        font-variant-east-asian: normal !important;
        font-variant-ligatures: normal !important;
        font-variant-numeric: normal !important;
        font-variant-position: normal !important;
        font-variant: normal !important;
        font-variation-settings: normal !important;
        font-weight: 400 !important;
        font: 16px sans-serif !important;
        forced-color-adjust: auto !important;
        gap: normal !important;
        grid-area: auto / auto / auto / auto !important;
        grid-auto-columns: auto !important;
        grid-auto-flow: row !important;
        grid-auto-rows: auto !important;
        grid-column-end: auto !important;
        grid-column-gap: normal !important;
        grid-column-start: auto !important;
        grid-column: auto / auto !important;
        grid-gap: normal normal !important;
        grid-row-end: auto !important;
        grid-row-gap: normal !important;
        grid-row-start: auto !important;
        grid-row: auto / auto !important;
        grid-template-areas: none !important;
        grid-template-columns: none !important;
        grid-template-rows: none !important;
        grid-template: none / none / none !important;
        grid: none / none / none / row / auto / auto !important;
        height: auto !important;
        height: auto !important;
        hyphens: manual !important;
        image-orientation: from-image !important;
        image-rendering: auto !important;
        ime-mode: auto !important;
        inline-size: auto !important;
        inset-block-end: auto !important;
        inset-block-start: auto !important;
        inset-block: auto !important;
        inset-inline-end: auto !important;
        inset-inline-start: auto !important;
        inset-inline: auto !important;
        inset: auto !important;
        isolation: auto !important;
        justify-content: normal !important;
        justify-items: normal !important;
        justify-self: auto !important;
        left: auto !important;
        letter-spacing: normal !important;
        lighting-color: rgb(255, 255, 255) !important;
        line-break: auto !important;
        line-height: normal !important;
        list-style-image: none !important;
        list-style-position: outside !important;
        list-style-type: disc !important;
        list-style: outside none disc !important;
        margin-block-end: 0px !important;
        margin-block-start: 0px !important;
        margin-block: 0px !important;
        margin-bottom: 0px !important;
        margin-inline-end: 0px !important;
        margin-inline-start: 0px !important;
        margin-inline: 0px !important;
        margin-left: 0px !important;
        margin-right: 0px !important;
        margin-top: 0px !important;
        margin: 0px !important;
        marker-end: none !important;
        marker-mid: none !important;
        marker-start: none !important;
        marker: none !important;
        mask-clip: border-box !important;
        mask-composite: add !important;
        mask-image: none !important;
        mask-mode: match-source !important;
        mask-origin: border-box !important;
        mask-position-x: 0% !important;
        mask-position-y: 0% !important;
        mask-position: 0% 0% !important;
        mask-repeat: repeat !important;
        mask-size: auto !important;
        mask-type: luminance !important;
        mask: none !important;
        max-block-size: none !important;
        max-height: none !important;
        max-inline-size: none !important;
        max-width: none !important;
        min-block-size: 0px !important;
        min-height: 0px !important;
        min-inline-size: 0px !important;
        min-width: 0px !important;
        mix-blend-mode: normal !important;
        object-fit: fill !important;
        object-position: 50% 50% !important;
        offset-anchor: auto !important;
        offset-distance: 0px !important;
        offset-path: none !important;
        offset-rotate: auto 0deg !important;
        offset-rotate: auto !important;
        offset: none 0px auto 0deg !important;
        opacity: 1 !important;
        order: 0 !important;
        orphans: 2 !important;
        outline-color: rgb(0, 0, 0) !important;
        outline-offset: 0px !important;
        outline-style: none !important;
        outline-width: 0px !important;
        outline: rgb(0, 0, 0) none 0px !important;
        overflow-anchor: auto !important;
        overflow-block: visible !important;
        overflow-clip-margin: 0px !important;
        overflow-inline: visible !important;
        overflow-wrap: normal !important;
        overflow-x: visible !important;
        overflow-y: visible !important;
        overflow: visible !important;
        overscroll-behavior-block: auto !important;
        overscroll-behavior-inline: auto !important;
        overscroll-behavior-x: auto !important;
        overscroll-behavior-y: auto !important;
        overscroll-behavior: auto !important;
        padding-block-end: 0px !important;
        padding-block-start: 0px !important;
        padding-block: 0px !important;
        padding-bottom: 0px !important;
        padding-inline-end: 0px !important;
        padding-inline-start: 0px !important;
        padding-inline: 0px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
        padding-top: 0px !important;
        padding: 0px !important;
        page-break-after: auto !important;
        page-break-before: auto !important;
        page-break-inside: auto !important;
        page: auto !important;
        paint-order: normal !important;
        parent-rule: null !important;
        perspective-origin: 50% 50% !important;
        perspective-origin: 50% 50% !important;
        perspective: none !important;
        place-content: normal !important;
        place-items: normal !important;
        place-self: auto !important;
        pointer-events: auto !important;
        position: static !important;
        quotes: auto !important;
        r: 0px !important;
        resize: none !important;
        right: auto !important;
        rotate: none !important;
        row-gap: normal !important;
        ruby-align: space-around !important;
        ruby-position: alternate !important;
        ruby-position: over !important;
        rx: auto !important;
        ry: auto !important;
        scale: none !important;
        scroll-behavior: auto !important;
        scroll-margin-block-end: 0px !important;
        scroll-margin-block-start: 0px !important;
        scroll-margin-block: 0px !important;
        scroll-margin-bottom: 0px !important;
        scroll-margin-inline-end: 0px !important;
        scroll-margin-inline-start: 0px !important;
        scroll-margin-inline: 0px !important;
        scroll-margin-left: 0px !important;
        scroll-margin-right: 0px !important;
        scroll-margin-top: 0px !important;
        scroll-margin: 0px !important;
        scroll-padding-block-end: auto !important;
        scroll-padding-block-start: auto !important;
        scroll-padding-block: auto !important;
        scroll-padding-bottom: auto !important;
        scroll-padding-inline-end: auto !important;
        scroll-padding-inline-start: auto !important;
        scroll-padding-inline: auto !important;
        scroll-padding-left: auto !important;
        scroll-padding-right: auto !important;
        scroll-padding-top: auto !important;
        scroll-padding: auto !important;
        scroll-snap-align: none !important;
        scroll-snap-stop: normal !important;
        scroll-snap-type: none !important;
        scrollbar-color: auto !important;
        scrollbar-gutter: auto !important;
        scrollbar-width: auto !important;
        shape-image-threshold: 0 !important;
        shape-margin: 0px !important;
        shape-outside: none !important;
        shape-rendering: auto !important;
        speak: normal !important;
        stop-color: rgb(0, 0, 0) !important;
        stop-opacity: 1 !important;
        stroke-dasharray: none !important;
        stroke-dashoffset: 0px !important;
        stroke-linecap: butt !important;
        stroke-linejoin: miter !important;
        stroke-miterlimit: 4 !important;
        stroke-opacity: 1 !important;
        stroke-width: 1px !important;
        stroke: none !important;
        tab-size: 8 !important;
        table-layout: auto !important;
        text-align-last: auto !important;
        text-align: start !important;
        text-anchor: start !important;
        text-combine-upright: none !important;
        text-decoration-color: rgb(0, 0, 0) !important;
        text-decoration-line: none !important;
        text-decoration-skip-ink: auto !important;
        text-decoration-style: solid !important;
        text-decoration-thickness: auto !important;
        text-decoration: none solid rgb(0, 0, 0) !important;
        text-decoration: rgb(0, 0, 0) !important;
        text-emphasis-color: rgb(0, 0, 0) !important;
        text-emphasis-position: over right !important;
        text-emphasis-style: none !important;
        text-indent: 0px !important;
        text-justify: auto !important;
        text-orientation: mixed !important;
        text-overflow: clip !important;
        text-rendering: auto !important;
        text-shadow: none !important;
        text-size-adjust: auto !important;
        text-transform: none !important;
        text-underline-offset: auto !important;
        text-underline-position: auto !important;
        top: auto !important;
        touch-action: auto !important;
        transform-box: border-box !important;
        transform-box: view-box !important;
        transform-origin: 50% 50% !important;
        transform-origin: 50% 50% !important;
        transform-style: flat !important;
        transform: none !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        transition-property: all !important;
        transition-timing-function: ease !important;
        transition: all 0s ease 0s !important;
        translate: none !important;
        unicode-bidi: isolate !important;
        unicode-bidi: normal !important;
        user-select: auto !important;
        vector-effect: none !important;
        vertical-align: baseline !important;
        visibility: visible !important;
        white-space: normal !important;
        widows: 2 !important;
        width: auto !important;
        will-change: auto !important;
        word-break: normal !important;
        word-spacing: 0px !important;
        word-wrap: normal !important;
        writing-mode: horizontal-tb !important;
        x: 0px !important;
        y: 0px !important;
        z-index: auto !important;
        zoom: 1 !important;
    }
`

const parseStyle = (cssString) => {
    parseStyle.styleElement.innerHTML = cssString
    // style won't load unless node is mounted to the dom
    document.body.appendChild(parseStyle.rootElement)
    const output = parseStyle.shadowRoot.styleSheets[0]
    document.body.removeChild(parseStyle.rootElement)
    return output
}
    parseStyle.rootElement = document.createElement("div")
    parseStyle.rootElement.style.display = "none"
    parseStyle.styleElement = document.createElement("style")
    parseStyle.shadowRoot = parseStyle.rootElement.attachShadow({mode:"closed"})
    parseStyle.shadowRoot.appendChild(parseStyle.styleElement)


// 
// 
// Custom Component Class Maker
// 
// 
const ComponentClass = ({defaultName, constructor, css, onConnect, onDisconnect, attributes={}, onShallowChange={}, advanced={}})=>{
    // dynamically changing this would break everything, so freeze it to indicate "yo, don't change this after the fact"
    onShallowChange = Object.freeze(onShallowChange)
    const styleSheet = parseStyle(css)
    const componentStyleElement = parseStyle.styleElement.cloneNode(true)
    componentStyleElement.innerHTML += cssImportantifySheet(styleSheet)

    class Component extends HTMLElement {
        constructor(...args) {
            super()
            let shadow = this.attachShadow({mode: 'open'})
            const shadowRoot =  shadow
            shadowRoot.innerHTML=`
                <div style="display: none;">
                    <link rel="stylesheet" href="https://unpkg.com/css-baseline@1.3.0/css/3.css">
                </div>
            `
            // use div as a container for all the style elements
            this.styleContainer = shadowRoot.firstElementChild
            this.styleContainer.appendChild(baselineStyleElement.cloneNode(true))
            this.styleContainer.appendChild(componentStyleElement.cloneNode(true))
            // mixin many of the shadowRoot proprties
            Object.defineProperties(this, {
                innerHTML:                { get(){ return shadowRoot.innerHTML                }, set(value){return shadowRoot.innerHTML                = value } },
                getInnerHTML:             { get(){ return shadowRoot.getInnerHTML             }, set(value){return shadowRoot.getInnerHTML             = value } },
                children:                 { get(){ return shadowRoot.children                 }, set(value){return shadowRoot.children                 = value } },
                append:                   { get(){ return shadowRoot.append                   }, set(value){return shadowRoot.append                   = value } },
                getElementById:           { get(){ return shadowRoot.getElementById           }, set(value){return shadowRoot.getElementById           = value } },
                prepend:                  { get(){ return shadowRoot.prepend                  }, set(value){return shadowRoot.prepend                  = value } },
                querySelector:            { get(){ return shadowRoot.querySelector            }, set(value){return shadowRoot.querySelector            = value } },
                querySelectorAll:         { get(){ return shadowRoot.querySelectorAll         }, set(value){return shadowRoot.querySelectorAll         = value } },
                replaceChildren:          { get(){ return shadowRoot.replaceChildren          }, set(value){return shadowRoot.replaceChildren          = value } },
                hasChildNodes:            { get(){ return shadowRoot.hasChildNodes            }, set(value){return shadowRoot.hasChildNodes            = value } },
                insertBefore:             { get(){ return shadowRoot.insertBefore             }, set(value){return shadowRoot.insertBefore             = value } },
                removeChild:              { get(){ return shadowRoot.removeChild              }, set(value){return shadowRoot.removeChild              = value } },
                replaceChild:             { get(){ return shadowRoot.replaceChild             }, set(value){return shadowRoot.replaceChild             = value } },
                childNodes:               { get(){ return shadowRoot.childNodes               }, set(value){return shadowRoot.childNodes               = value } },
                firstChild:               { get(){ return shadowRoot.firstChild               }, set(value){return shadowRoot.firstChild               = value } },
                lastChild:                { get(){ return shadowRoot.lastChild                }, set(value){return shadowRoot.lastChild                = value } },
                nodeValue:                { get(){ return shadowRoot.nodeValue                }, set(value){return shadowRoot.nodeValue                = value } },
                textContent:              { get(){ return shadowRoot.textContent              }, set(value){return shadowRoot.textContent              = value } },
                appendChild:              { get(){ return shadowRoot.appendChild              }, set(value){return shadowRoot.appendChild              = value } },
                cloneNode:                { get(){ return shadowRoot.cloneNode                }, set(value){return shadowRoot.cloneNode                = value } },
                childElementCount:        { get(){ return shadowRoot.childElementCount        }, set(value){return shadowRoot.childElementCount        = value } },
                contains:                 { get(){ return shadowRoot.contains                 }, set(value){return shadowRoot.contains                 = value } },
                styleSheets:              { get(){ return shadowRoot.styleSheets              }, set(value){return shadowRoot.styleSheets              = value } },
                delegatesFocus:           { get(){ return shadowRoot.delegatesFocus           }, set(value){return shadowRoot.delegatesFocus           = value } },
                slotAssignment:           { get(){ return shadowRoot.slotAssignment           }, set(value){return shadowRoot.slotAssignment           = value } },
                activeElement:            { get(){ return shadowRoot.activeElement            }, set(value){return shadowRoot.activeElement            = value } },
                pointerLockElement:       { get(){ return shadowRoot.pointerLockElement       }, set(value){return shadowRoot.pointerLockElement       = value } },
                fullscreenElement:        { get(){ return shadowRoot.fullscreenElement        }, set(value){return shadowRoot.fullscreenElement        = value } },
                adoptedStyleSheets:       { get(){ return shadowRoot.adoptedStyleSheets       }, set(value){return shadowRoot.adoptedStyleSheets       = value } },
                elementFromPoint:         { get(){ return shadowRoot.elementFromPoint         }, set(value){return shadowRoot.elementFromPoint         = value } },
                elementsFromPoint:        { get(){ return shadowRoot.elementsFromPoint        }, set(value){return shadowRoot.elementsFromPoint        = value } },
                getSelection:             { get(){ return shadowRoot.getSelection             }, set(value){return shadowRoot.getSelection             = value } },
                pictureInPictureElement:  { get(){ return shadowRoot.pictureInPictureElement  }, set(value){return shadowRoot.pictureInPictureElement  = value } },
                getAnimations:            { get(){ return shadowRoot.getAnimations            }, set(value){return shadowRoot.getAnimations            = value } },
                firstElementChild:        { get(){ return shadowRoot.firstElementChild        }, set(value){return shadowRoot.firstElementChild        = value } },
                lastElementChild:         { get(){ return shadowRoot.lastElementChild         }, set(value){return shadowRoot.lastElementChild         = value } },
                nodeType:                 { get(){ return shadowRoot.nodeType                 }, set(value){return shadowRoot.nodeType                 = value } },
                nodeName:                 { get(){ return shadowRoot.nodeName                 }, set(value){return shadowRoot.nodeName                 = value } },
                baseURI:                  { get(){ return shadowRoot.baseURI                  }, set(value){return shadowRoot.baseURI                  = value } },
                isConnected:              { get(){ return shadowRoot.isConnected              }, set(value){return shadowRoot.isConnected              = value } },
                ownerDocument:            { get(){ return shadowRoot.ownerDocument            }, set(value){return shadowRoot.ownerDocument            = value } },
                getRootNode:              { get(){ return shadowRoot.getRootNode              }, set(value){return shadowRoot.getRootNode              = value } },
                isDefaultNamespace:       { get(){ return shadowRoot.isDefaultNamespace       }, set(value){return shadowRoot.isDefaultNamespace       = value } },
                isEqualNode:              { get(){ return shadowRoot.isEqualNode              }, set(value){return shadowRoot.isEqualNode              = value } },
                isSameNode:               { get(){ return shadowRoot.isSameNode               }, set(value){return shadowRoot.isSameNode               = value } },
                lookupNamespaceURI:       { get(){ return shadowRoot.lookupNamespaceURI       }, set(value){return shadowRoot.lookupNamespaceURI       = value } },
                lookupPrefix:             { get(){ return shadowRoot.lookupPrefix             }, set(value){return shadowRoot.lookupPrefix             = value } },
                normalize:                { get(){ return shadowRoot.normalize                }, set(value){return shadowRoot.normalize                = value } },
            })
            this.connectedCallback = onConnect
            this.disconnectedCallback = onDisconnect
            this.adoptedCallback = advanced.adoptedCallback
            setTimeout(()=>{
                // make an importantified version of the css
                this.setAttribute("style", baselineStylesString+cssImportantifyString(attributes.style||""))
                // TODO make a method for converting object-style to CSS string
                // TODO: other attributes like classes and children will be treated as special, but right now this just copies all of them
                for (const [key, value] of Object.entries(attributes)) {
                    if (key == 'style') {
                        continue
                    }
                    this.setAttribute(key, value)
                }
                constructor.apply(this, ...args)
            })
        }
        static get observedAttributes() {
            return Object.keys(onShallowChange)
        }
        attributeChangedCallback(name, oldValue, newValue) {
            onShallowChange[name](newValue, oldValue)
        }
    }
    return Component
}

// TODO:
    // use #_ as a performance hack instead of inline styles
        // hash the content baseline style string
        // then check for that as a symbol
        // if doesn't exist, create the style element and add it to head, then set the flag
        // then give every custom component the same ID so they receive the attributes with the highest priority
    // make the baseline css external, and just link it for efficiency/performance
    // convert the style getter into a proxy object
    // consider converting all top level text nodes into spans (would need a mutation observer though)
    // improve attributes:
        // make all assigned CSS attributes gain !important
        // make innerHTML & friends not ovewrite stylesheets
    // fix the CSS importantify hack

window.ComponentClass = ComponentClass
window.Component = ComponentClass({
    defaultName: "exampleComponent1",
    attributes: {
        style: `
            min-height: 10rem;
            min-width: 10rem;
            background-color: lightsalmon;
        `,
    },
    css: `
        :host, * {
            color: lightgreen;
            font-size: 10px;
            font-family: sans-serif;
        }
    `,
})
customElements.define("test-ing", Component)
window.element = document.createElement("test-ing")
document.body.append(element)
element.innerHTML += `<div>
    Howdy
    <div>
        Howdy2
        Howdy3
    </div>
!</div>`
element.innerHTML += "Howdy!"