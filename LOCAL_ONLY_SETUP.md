# Local-only setup for Together Steps

This test version does not use Firebase.

Data is saved on the device/browser using local storage. That means:

- No Firebase project is needed.
- No Firestore rules are needed.
- No parent account sign-in is needed.
- Data will not sync between phones.
- Clearing browser/app data can delete the saved test data.

Upload these files together to your test host or GitHub Pages:

- index.html
- style.css
- script.js
- manifest.json
- sw.js
- icon.png
- icon-192.png
- README.md
- LOCAL_ONLY_SETUP.md
