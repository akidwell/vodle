## Specification notes

* app name will be "vodle", logo exists
* main focus for now: get base functionality going (setting up polls, voting, closing a poll)

### Prioritised list of wanted features

* poll setup, invitation by email
* basic nonencrypted communication via realtime.co
* interactive voting gui, changing pin color depending on approval state
* at deadline: poll tally, broadcast result via realtime.co
* add non-probabilistic mode ("allocate a budget", "allocate resources", "elect temporary representatives" 
* optimized explanations, howtos, guides (using text of different detail and animations)
* custom uri scheme & file extension
* standard notification when some bar has changed by more than 5% or some pin's distance to bar end gets below 5% or time gets late
* invitation and notifications via other messengers
* "vodle" button for integration in websites, using custom uri + standard webservice interface to open polls
* integration with slack via slackbot "vodle"
* extracting lists of potential options from webpages (e.g. movie theatre program) 
* personal prioritization of polls
* customized notification options (updates, result)
* text message broadcast and personal messages
* observer-only view for stakeholders or public projection 

## Ideas for publication

### channels

* app shops
* "vodle.co" web app
* promote "vodle" button to cinemas etc.
* get startups to use it

### application situations

#### probabilistic:

* movie (<-- movie theatre)
* restaurant (<-- gastro pages)
* hotel (<-- booking engine)
* what to cook (<-- recipe server)
* date
* train/flight connection (<-- carrier or specialized search engine)
* holiday destination
* product variant (<-- webshop)
* band name
* company logo

### proportional allocation:

* art award money
* group speaker/rep temporary service time
* budget, time or other resources for projects

## Implementation notes

* many small TODOs etc. are contained in inline comments in code

### Building

I did the following to get the unsigned android debug build going:

* sudo npm i -g cordova
* npm install @ionic-native/push
* npm install cordova-plugin-ionic@^5.0.0
* npm install ajv@^6.9.1
* npm install fsevents@1.2.7
* sudo apt install openjdk-8-jdk
* sudo update-alternatives - -config java
  then select 1.8
* sudo update-alternatives - -config javac
  then select 1.8
* export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
* sudo apt install gradle android-sdk-build-tools
* ...android-sdk-linux/tools/bin/sdkmanager --install "platforms;android-27"
* ...android-sdk-linux/tools/bin/sdkmanager --install "build-tools;26.0.2"
* ...android-sdk-linux/tools/bin/sdkmanager --update
* yes | ...android-sdk-linux/tools/bin/sdkmanager --licenses
* export ANDROID_HOME=...android-sdk-linux/
* ionic cordova build --prod android --verbose

### Useful commands

* running in dev mode: in main directory of git repo: ionic serve
* updating icons using source put in resources: 

### Message retention

On the free plan, realtime.co deletes unserved messages after 2 minutes, so an offline user will get only the messages from the last two minutes when reconnecting.
Hence we must make sure someone sends full rating state data at least every two minutes, 
so that a reconnecting app will receive at least one such full state together with all subsequent updates.
The protocol for this is this:

* whenever receiving a full state, the app adds a random number between 1 and 2 minutes to that state's timestamp 
  and sets this as her "broadcast full state time".
* when receiving newer full states, a new "broadcast full state time" is set.
* when reaching the "broadcast full state time" before another full state is received, 
  the app broadcasts the current full state.
* to make sure state does not get lost when users are only online sporadically,
  a central, continuously online maxparc server listens on the same channel, 
  and when it has not received a full state for longer than, say, 110 seconds, 
  it computes a new full state and broadcasts it.
  this could even be done by a cron job executing every, say, 55 seconds.
* note that with 100 voters and 10 options, a full state is just 1KB of data,
  so the server only needs that much permanent storage per open poll.

### Useful links

* http://unhosted.org/ for ideas on decentralization
* sorting and filtering a list: https://www.djamware.com/post/5a37ceaf80aca7059c142970/ionic-3-and-angular-5-search-and-sort-list-of-data
* push notifications: https://ionicframework.com/docs/native/push/
* realtime.co: https://framework.realtime.co/messaging/, http://demos.realtime.co/demos/poll2.aspx, http://messaging-public.realtime.co/documentation/starting-guide/quickstart-js.html
* possible alternative to realtime.co: http://sockethub.org/
* app-specific url schemes (use "maxparc"?): 
    https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app
    https://stackoverflow.com/questions/2448213/how-to-implement-my-very-own-uri-scheme-on-android
* file extension "maxparc":
    https://www.codenameone.com/blog/associating-your-app-with-file-extension-mime-types-iphone-android-windows.html
    https://stackoverflow.com/questions/3760276/android-intent-filter-associate-app-with-file-extension
    
