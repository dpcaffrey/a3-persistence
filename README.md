## Power Monitoring Database

http://a3-danielcaffrey.glitch.me

The goal of the application  is to allow users to track their power usage by entering
voltage and current readings from certain times and dates.
Making sure the table correctly deleted data but not heading rows was one of the more 
challenging aspects of the application.
I chose to use lowdb and passport becuase they seemed to work together very seamlessly
I used the Picnic CSS Framework, v6.5.0. I chose this becuase I particulrarly liked how
tables and buttons looked in this framework
- I added CSS to create a grid layout so I could easily organize the page.
- I also add borders to each cell in the table, and centered the headings and tabel text

Middlewear:
- body-parser: Used to parse the JSON data sent from the client
- passport: Used for user identification
- cookie-session: Used to establish a cookie once a user is identified
- morgan: Used to log all requests sent 
- response-time: Used to record the time that each Fetch request takes

Notes:
- Users can view data specific to them, or view all data in the database by using "admin" 
as the username and password
  - This is not secure, but it is asked for in the directions
- A new user is created by adding data with a new username and password to the database
- The Login buttons only purpose is to check if a user is in the database or not using Passport


## Technical Achievements
- **Tech Achievement 1**: Server implementation with Express. Server allows users to add, remove, or modify data.
- **Tech Achievement 2**: Persistant data storage with lowdb
- **Tech Achievement 3**: User authetication with Passport Local Authentication Strategy.
- **Tech Achievement 4**: Automatic logging of HTML requests using Morgan
- **Tech Achievement 5**: Automatic recording in the response header of the time an HTML request took using Response-Time 
- **Tech Achievement 6**: The ability to display data for either a given user, or for the entire databse.
- **Tech Achievement 7**: Using window.alert, created a pop up window that appears if a user
attempts to click a button wihtout filling in all of the input boxes associated with that button
- **Tech Achievement 8**: Implemented checks for invalid Date and Time values
- **Tech Achievement 9**: Deleted the rows of the table without deleting the table itself. 
This allows the table to be included in the grid layout 

### Design/Evaluation Achievements
- **Design Achievement 1**: Use of Picnic CSS Template
- **Design Achievement 2**: Use of grid system to place elements on page