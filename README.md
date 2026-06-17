# Together Steps - plain local test baseline

This is the plain-theme local-only test version.

## App identity

- App name: Together Steps
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

- Firebase sync
- Firestore rules
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

## Profile photo

This version lets the user upload a profile photo in Settings. The photo is cropped square, saved locally on the device, and can be removed at any time.


## Theme pack

This local-only test version includes Plain, Retro / Mario-style, Space, Minecraft-style, and Bunny themes. Change the theme from Settings after unlocking Parent Mode. Theme choice is saved locally on the device.

## Familiar child-app layout update

This test build keeps the Together Steps branding, local-only saving, coin reward system, profile photo upload, timer, calendar, family tree, and theme pack, but switches the interface back closer to the earlier child-app layout: bigger rounded cards, stronger child dashboard, chunky navigation, and the familiar traffic-light home view.
