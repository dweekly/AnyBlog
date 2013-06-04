Overview
--------

This app showcases [dynamic websites](http://parse.com/docs/cloud_code_guide#webapp)
using Parse Hosting. It's a simple blog
that lets you create posts and your readers
to leave comments.

You can check out the official hosted version
at [www.anyblog.co](http://www.anyblog.co).

Setup
-----

1. Created a new app on Parse, and make sure you go
through our [getting started guide for Cloud Code](https://parse.com/docs/cloud_code_guide#started-installing).

2. Type `parse new .` in the directory where this
README resides, authenticate with your Parse credentials,
and choose the app name you created.

3. Delete `public/index.html`

4. Edit `cloud/app.js` and specify your `userEmail`, `userDisplayName`
and `userDescription`.

5. Type `parse deploy`. This deploys your app to Parse.

6. Now, we'll need to configure the url where you can
reach your app. Go to your app's setting page and set
a unique subdomain for your Web Hosting url.

7. Go to yoursubdomain.parseapp.com and view your copy of Anyblog!

