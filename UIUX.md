**UI/UX description**
- Colourful and cohesive gradient based colour schemes
- Glassmorphism containers throughout the application
- Used Material UI for consistency and responsiveness (including selection of icons)
- Reused a lot of components (e.g. cards, modals, forms);
- Enhanced design of login and signup pages with abstract backgrounds
- Icon buttons have tooltips and labels with text description for greater accessibility 
- Error messages for each input with detailed explanations. For example, the edit game page uses extensive error checking and shows errors with explanations such as 'Time limit must be between 00:05-04:59'. To check the extensive error checking, try out the edit page e.g. with empty inputs or single type questions with multiple correct answers
- Sorts game by published date so the order does not change on re-rendering
- Shows successful or unsuccessful outcomes of edit game after submitted via an alert
- Lobby page utilises animations and a quotes api with the unsplash api to gather and rotate through aesthetic images along with quotes
- Lobby also uses polling and immediately starts once admin starts game
- Result page has user friendly and easily understandable graphs and metrics
- Past quiz results are easily accessible via icon buttons on the dashboard page
- Buttons for starting and stopping/advancing game are conditionally rendered, preventing issues with stopping an already stopped game 
- Logical layout of playing the game. Admin selects the play button then the advance icon appears. After starting the game by selecting the advance icon, the admin is also able to visualise the game through a non-interactive version of the game page the player sees. A description on whether to select 1 or many answers are shown. When the timer goes to 0, text highlights if they got the answer correct/incorrect and the correct/incorrect answers are shown via colouring. The admin is then able to go to the next question after the timer goes to 0. Also, the admin can stop the game at any time via a stop button on the dashboard. Once the stop button is pressed, both the admin and the player are sent to their respective game pages. (player remains on the last game question page until the admin selects to stop button located on a dashboard game card)
- Alt tags for images that explain what is going on in the image
- Closing popups when a user clicks off the popup and darkening background to draw focus on popup
- Accessible font 
- Results page has the leaderboard ordered in rank
- Charts on results page with numbers are rounded to avoid ugly decimals 
- Navigation bar is sticky with the most important functions so that they can be accessed anywhere. It also only appears on pages requiring admin access
- Hover and focus states of buttons and inputs highlights certain elements and draws attention
- Empty states for when there's no games or results etc to inform the user & some empty state messages include calls to action such as letting users know to add games or add questions to games
- Placeholders for inputs to inform users what they should be typing
- Using verbs in buttons/labels so users can see clearly what each button will do
- Utilising whitespace and colour to separate and spice up the page, separate sections/information
- Hierarchy of importance with font sizing e.g. headings
- Responsive grid layouts
- Disabled states of buttons when inputs are empty or when there are no previous sessions of games 
- Point system is not overly complicated and explained on result pages 



