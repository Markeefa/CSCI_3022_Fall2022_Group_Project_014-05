# November 7, 2022 Meeting:

Assaf's goal this week is to try to create a post page for posting, using images and adding to the database. Last week he created the tables, and will likely add first/last name to the user database. He is going to look at the cloudinary image api database for posting an image of the "thing". It is ideal to have a second person working on the cloudinary for help.

Max has the Use Case Diagram, is going to be finding his tasks for this week at the group meeting.

Reda finished the wireframes and typed up the test case planning document, and he is looking to outline the index.js for the docker compose and to start work on the profile page this week.

Nick finished the register.ejs and the register APIs in the back end index.js, which worked in his old lab, so it is tested. He is looking to working on the home page and helping Assaf with the cloudinary.

Mark worked on the login page, simple setup with username password, if you do not have an account, and he set up the index.js, so he knows his login page, and just needs the SQL. He is interested in working on the item page this week, showing all the reviews for that item. Maybe make the reviews show up as a modal? Good idea.

Artur worked on the partials last week with the navbar, he added categories for the items that Mark talked about. He is interested in working on the trending tab for items talked about the most based on a trending coefficient. Python would be your friend, more effective than NodeJS although NodeJS is doable, there are packages that let you call Python Scripts at an API level. You can at least query the database in descending order, but there are many different options for this.

Important Notes:

- Code has to be modular, not hard-coded in, in order for our data to accurately show itself and be functional. It needs to be within the .ejs. Code should be dynamic.
- When we are discussing as a team, talk about the user experience on a single page as a team. Go through bit by bit with nav bar, reviews, etc.
- Make sure to make a pull request everytime you push, and have a team member merge it for you.