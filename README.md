# URL Throttler 2024
This Firefox add-on is based on Sean Everest's ([GitHub Profile Link](https://github.com/severest)) _URL Throttler_ extension for Chrome. 

**URL Throttler:** ([Chrome Web Store](https://chromewebstore.google.com/detail/url-throttler/kpkeghonflnkockcnaegmphgdldfnden?pli=1) | [GitHub Repo link](https://github.com/severest/url-throttler))

Much of the Chrome extension developer community felt somewhat "throttled" when Google decided it was in everyone's best interests to see more ads and disable the underlying technology powering popular ad blockers such as uBlock Origin. Unfortunately, this change will also make Sean's fantastic plugin, one which I use extensively in my work, no longer functional.

I borrowed some logic and conceptual approaches from that project to make this Firefox alternative.

If you're interested in reading more about the breaking changes that were introduced with Chrome Manifest V3, I think the following links are a good place to start:

* [Wilders Security Forums](https://www.wilderssecurity.com/threads/chrome-extension-manifest-v3-proposal-the-death-of-ublock-origin-and-umatrix.412351/)
* [Mozilla Add-ons Community Blog](https://blog.mozilla.org/addons/2022/05/18/manifest-v3-in-firefox-recap-next-steps/)

## Major Changes
* Now built on functional React instead of Vue, because that's what I'm most familiar with.
* Webpack introduced to compile scripts, leveraging transpiling and minification features
* Configurations can now be imported/exported via the UI

## How to Run as Developer
1. Clone this repo
2. (optional) Make your changes, then compile with Webpack by running `npm run build`
3. Navigate to the following URL: `about:debugging#/runtime/this-firefox`
4. Select _Load Temporary Add-on..._
5. Open the _public/manifest.json_ file
6. Navigate to the following URL: `about:addons`
7. Select the ellipse button to the right of _URL Throttler_
8. Select _Manage_
9. Choose the _Permissions_ tab
10. Enable the permission _Access your data for all websites_
11. _URL Throttler_ should now be accessible in your list of Firefox extensions and functional.