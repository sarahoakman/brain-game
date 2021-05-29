**Component Testing**

1. Testing Navigation Bar (nav.js)

The main purpose of a navigation bar depends on:
*  its ability to be seen across admin pages that require being logged in - dashboard, edit game, old sessions, admin results page. Testing on edit game, old sessions and admin results page was more difficult because they use useParams() hooks, but we were able to demonstrate that the dashboard includes nav and the other pages which don't require being logged in (login, signup) don't show the nav bar. 
* ability to be seen despite scrolling. This is tested by the fact the nav bar has the attribute 'position' set to 'sticky'. 
* ability to redirect users to important features. All buttons on the nav bar were tested on their onClick abilities, and for accessibility if their tooltip text descriptions showed on hover. 

2. Testing Old Sessions Page (old-sessions.js)

The main component of this page is the table which has a header labelling the two columns (session id and view results button), and rows for each previous session. 
The main purpose of this component is to correctly display all previous sessions and a link to the results of these sessions. 
* The case of there being no previous sessions was considered - the dashboard was designed so games with 0 previous sessions have a disabled results button, meaning it's not possible to navigate to this page for games with 0 previous sessions unless the user saves the quiz id and manually inputs the url (rare case). 

The following elements were tested: 
* View Results Button: should be clickable and aria label defined 
* There should be 1 table that's aria label defined
    * Table should be have 1 header 
        * Header should have two column titles: Session IDs and View Results
    * There should be 1 body section
        * Number of rows should match number of session IDs
        * For each row: first column should be the session ID, second column should be a view results button 

3. Testing Helper Component for Admin Results Page (helpers.js)

The Admin Results page was not tested itself because it's complicated and involves hooks and displaying data on charts. Instead the main logic behind this page (regarding matching quiz question information to players' answers, calculations ) was extracted as a component and tested. 

The main purpose of this component is to make sure these helper functions correctly handle edge cases. 
The following scenarios were considered and tested: 
* If there are no questions to the game, the game is started and stopped without advancing or the game is started and advanced but there are no players who joined: there are no results to display and explanation text will render.
* If there's only one player: points, average time and percentage of correct answers are calculated as normal. Average time would just be this player's times. 
* If players don't answer the question and wait until time runs out: The player would get 0 points, average time defaults to the max time limit and it's counted as an incorrect answer.
* If a player answers incorrectly: The player gets 0 points, time is still end - start, and counted as incorrect answer. 
* If players answer correctly and speed needs to be factored in: player gets max_points * (time_limit - time_taken). 

The following functions were considered and tested: 
* Calculating top 5 players given a list of players and their scores
    * Ability to sort players including possibilities of duplicates
    * If there are more than 5 players, truncating the list 
    * If there are less than 5 players, just return them in order
* Calculating points 
    * Ability to calculate time difference including difference in minutes and seconds 
    * Making sure the points formula gives the highest points to fastest person who gets answer right 
* Calculating average time 
    * Ability to convert any time difference to seconds 
    * Ability to average these seconds no matter how many entries (including the scenario where a player doesn't answer and the max time limit is used instead)
    * Ability to handle when the time taken to answer a question is 0 
    * Converting/rounding the time to an easily readable format 

4. Testing Game Card Component for the Dashboard Page (grid-item.js)

The main component of the dashboard page are the game card components that populate it. It contains a title, thumbnail (optional), number of questions, total time, edit button, delete button, play or advance and/or stop button and a button to view past results.

The following elements were tested: 
* Game Card Buttons: buttons that appear on the card were tested 
    * Ability to trigger onClick events
    * Aria labels
    * Ability to trigger tooltips when hovered over
    * Ability to change the type of button e.g. edit, delete, etc, according to the input given
    * Ability to show certain buttons according to the input given e.g. if it is active, has questions and the position of the quiz
* Game Card: the content of the game cards were tested
    * All components on the game card are present and behave as expected. For example, if not thumbnail was given, then the default FontAwesomeIcon must be shown.

5. Testing Add Game Component for the Dashboard Page (add-button.js)

One of the purposes of the dashboard page is to provide the ability to add a new game. This component was tested and the test cases included the add button that is shown on the dashboard as well as the modal that appears and allows inputs to add a new game. The button and the modal were tested as a whole but also each component that resides within it were also tested. 

The following elements were tested: 
* New Game Button: button that appears on the dashboard to add a game
    * Ability to trigger onClick events
    * Aria labels
    * Ability to trigger tooltips when hovered over 
    * Ability to set aria-modal depending on if the modal is open or closed
* New Game Modal: contents of the new game modal were tested
    * Shows a game name input, game upload button (for json files) and buttons to cancel or submit
* Game Name Input: game name input for entering the title
    * Changing the input triggers an onChange event
    * Error messages if the input is empty
* Game JSON Input: input button for uploading a json file
    * Ability to trigger an onClick event 
    * Ability to show helper text that provides the name of the json file 
* Modal Buttons: buttons on the modal for submitting or cancelling
    * Ability to trigger an onClick event 
    * Ability to diversify into cancel or submit button according to input

6. Testing Result Accordian for the Player's Result Page (player-results.js)

The main purpose of the players result page is to show whether they got the questions correct or incorrect and within what time limit. This was tested on a Result Accordian component which is used to show the question number and then the details of correctness and time upon expanding. Also, the page as a whole was tested by checking if numerous Result Accordians were shown when given as inputs. 

The following elements were tested: 
* Result Details: content of the accordian that is visible upon expanding
    * Ability to have different styling and contents depending on correctness of the answer
    * Ability to show different times and text according to inputs given
* Result Accordian: the heading of the accordian
    * Ability to show the question number and the correct styling according to correctness of the answer
* All Results: test if all or none of the results are shown
    * Ability to show a message of 0 questions answered when given as an input
    * Ability to show all results with multiple Result Accordians
    * Testing of the time calculation function and whether it rounds correctly
    * Ability to set correctness of the answers when given as inputs
    
**UI Testing**

1. Happy path test

*Make sure before running this path, manually 'yarn reset && yarn start' backend and 'yarn start' frontend. Note: due to weird backend errors, all tests were put under one 'it' statement*

    1. Registers successfully
    2. Creates a new game successfully
    3. Updates the name of the game successfully
    4. Starts a game successfully
    5. Ends a game successfully
    6. Loads the results page successfully
    7. Logs out of the application successfully
    8. Logs back into the application successfully

2. Additional testing path

*Make sure before running this path, manually 'yarn reset && yarn start' backend and 'yarn start' frontend*

    1. Registers unsuccessfully with invalid email address 
    2. Registers unsuccessfully with empty input fields 
    3. Registers unsuccessfully with account already existing
    4. Log in unsuccessfully with empty fields 
    5. Log in unsuccessfully with invalid password
    6. Log in successfully
    7. Create a new game successfully
    8. Delete new game successfully
    9. Join a game unsuccessfully with empty input fields
    10. Join a game unsuccessfully with invalid session id 
    11. Return to dashboard

Rationale behind this path choice:
We wanted to test an unsuccessful path that would still be frequented a lot by users and making sure there's the right error messages to direct a user to fix the issues and be able to complete a task successfully eventually. Being unable to register or log in on the first try is very common and this path handles the many edge cases of why an unsuccessful login or signup occurs. We also tested additional features like joining a game and deleting a game. 