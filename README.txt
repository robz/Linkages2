This is a tool that makes it easy to quickly build fivebar linkages to trace out complex paths. The linkages available are actuated by two rotatary inputs running at constant rates. Play with it at http://robbynevels.com/Linkages2/.

To test the effectiveness of this tool, I will use it make a "linkage font" by creating a linkage to trace the shape of each letter of the alphabet. See curves/letters.js for the letters that I've currently made.

Current features:
- Tweaking any feature of the linkage, including bar lengths, couple length and angle, ground points, and input rates 
- Recalculates and displays path in realtime while tweaking
- Invalid configurations are automatically prevented 
- Rudimentary optimization of linkage to trace out a user-drawn path
- Import/export JSON linkage spec

Planned features:
- Fix scale range controller
- Expose all optmization parameters
- Add 'smart' segment optmization by combining current path with drawn one
- History of linkages found, ability to revert/branch
- Make sharable URL containing linkage spec
- Uniformly redistribute points along path 

Wishlist:
- Improve optimization error functions (http://math.stackexchange.com/questions/1091205/comparing-two-collection-of-points)
- Improve optimization algorithm using legit hill climbing or some such 
- Redesign UI to be prettier (better organized and resize nicely for smaller screens)
- Refactor to use react

