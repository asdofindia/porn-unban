const SIMPLE_MIRRORS = {
  "xvideos.com": "www.xvideos3.com",
  "pornhub.com": "pornhub.net",
  "xnxx.com": "xnxx.tv",
  "youporn.com": "you-porn.com",
  "redtube.com": "redtube.net",
  "tube8.com": "tube8.es",
};

const generateResponse = (redirectUrl) => {
  if (redirectUrl !== undefined) {
    return {
      redirectUrl,
    };
  }
  return {};
};

const getPrimaryDomain = (hostname) => hostname.split(".").slice(-2).join(".");

const getSimpleRedirect = (url) => {
  if (url.hostname in SIMPLE_MIRRORS) {
    return SIMPLE_MIRRORS[url.hostname];
  }
  // else, check subdomain
  const primaryDomain = getPrimaryDomain(url.hostname);
  return SIMPLE_MIRRORS[primaryDomain];
};

const getSimpleRedirectURL = (url) => {
  const hostname = getSimpleRedirect(url);
  if (hostname === undefined) {
    return undefined;
  }
  url.hostname = hostname;
  return url.href;
};

const getStreamableVideoIDFromURL = (url) => {
  const possibleID = url.pathname.slice(1); // slice the first char "/" from pathname
  if (possibleID.length === 6) {
    return possibleID;
  }
};

const getStreamableRedirect = async (url) => {
  const ID = getStreamableVideoIDFromURL(url);
  if (ID === undefined) {
    return undefined;
  }
  return fetch(`https://api.streamable.com/videos/${ID}`)
    .then((res) => res.json())
    .then((data) => data.files.mp4.url);
};

async function listener(details) {
  let url = new URL(details.url);
  let redirectUrl;
  if (Object.values(SIMPLE_MIRRORS).includes(url.hostname)) {
    console.log(`won't redirect redirection ${url.hostname}`);
    redirectUrl = undefined;
  } else if (url.hostname === "streamable.com") {
    redirectUrl = await getStreamableRedirect(url);
  } else {
    console.log(`Trying to redirect ${url.hostname}`);
    redirectUrl = getSimpleRedirectURL(url);
  }
  return generateResponse(redirectUrl);
}

let enabled_sites_filter = {
  urls: [
    "*://*.xvideos.com/*",
    "*://*.pornhub.com/*",
    "*://*.xnxx.com/*",
    "*://*.youporn.com/*",
    "*://*.redtube.com/*",
    "*://*.tube8.com/*",
    "*://*.streamable.com/*",
  ],
};

browser.webRequest.onBeforeRequest.addListener(listener, enabled_sites_filter, [
  "blocking",
]);
