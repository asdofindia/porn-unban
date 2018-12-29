function listener(details) {
    let mapping = {
        "xvideos.com": "xvideos2.com",
        "pornhub.com": "pornhub.net",
        "xnxx.com": "xnxx.tv",
        "youporn.com": "you-porn.com",
        "redtube.com": "redtube.net",
        "tube8.com": "tube8.es"
    };
    let url = new URL(details.url);
    redirectUrl = mapping[url.hostname];
    if (redirectUrl === undefined) {
        // subdomain check
        let indexofprimarydomain = url.hostname.lastIndexOf('.');
        let indexofsubdomain = url.hostname.lastIndexOf('.', indexofprimarydomain - 1)
        let primarydomain = url.hostname.slice(indexofsubdomain + 1)
        redirectUrl = mapping[primarydomain]
    }
    if (redirectUrl === undefined) {
        return {}
    } else {
        url.hostname = redirectUrl;
        return {
            "redirectUrl": url.href
        }
    }
}

let enabled_sites_filter = {
    "urls": [
        "*://*.xvideos.com/*",
        "*://*.pornhub.com/*",
        "*://*.xnxx.com/*",
        "*://*.youporn.com/*",
        "*://*.redtube.com/*",
        "*://*.tube8.com/*"
    ]
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    enabled_sites_filter,
    ["blocking"]
)
