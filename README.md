# Child&Parent app - plain local test baseline

This is the plain-theme local-only test version.

## App identity

- App name: Child&Parent app
- Android package name: com.childparent.app
- Theme: plain fixed theme
- Storage: local device/browser storage only

## Included features

- Child Mode and Parent Mode
- Parent PIN
- Coin reward system
- Feelings page
- Calendar
  - Child Mode: next 7 days
  - Parent Mode: current full month
- Timer tab
- Family tab
- Reports and history
- Notifications via service worker

## Not included in this test version

- Cloud sync
- Cloud database rules
- Parent account sign-in
- Cross-device syncing

## Privacy cleanup

- No child photo is included
- No personal names are used
- No personal creator branding is used
- Generic app icons are included

## Files

Upload these files together:

- index.html
- style.css
- script.js
- manifest.json
- sw.js
- icon.png
- icon-192.png
- README.md
- LOCAL_ONLY_SETUP.md

## Baseline note

This version keeps the v51 Timer and Family tab functionality, uses a plain neutral interface, and saves test data locally on the device.
