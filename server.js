const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      express = require('express'),
      bodyParser = require('body-parser'),
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      shortid = require('shortid'),
      session = require( 'express-session' ),
      passport = require( 'passport' ),
      Local = require( 'passport-local' ).Strategy,
      responseTime = require('response-time'),
      morgan = require('morgan'),
 
      dir  = 'public/',
      port = 3000,
      app = express(),
      adapter = new FileSync('db.json'), //Make the database file
      db = low( adapter )

db.defaults({ data:[] }).write() 
app.use( bodyParser.json() )
app.use(express.static('public'))
app.use(responseTime()) // Adds "x-response-time" to response header
app.use(morgan("tiny"));

const myLocalStrategy = function( username, password, done ) {
  const user = db.get('data').find({ username:username}).write()
  if( user === undefined ) {return done( null, false, { message:'user not found' })}
  else if( user.password === password ) {return done( null, { username, password })}
  else{return done( null, false, { message: 'incorrect password' })}
}

passport.use( new Local( myLocalStrategy ) )
app.use( passport.initialize())
app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use( passport.session() )

passport.serializeUser( ( user, done ) => done( null, user.username ) )

passport.deserializeUser( ( username, done ) => {
  const user = db.get('data').find({ username:username}).write()
  console.log( 'deserializing:', name )
  
  if( user !== undefined ) {done( null, user )}
  
  else{done( null, false, { message:'user not found; session not restored' })}
})

const checkData = function (error, json ){
  const volt = Number(json.voltage),
        curr = Number(json.current),
        [month, day, year] = json.date.split("/"),
        [hours, minutes] = json.time.split(":")
  if (volt <=0){ 
    console.log("Invalid Voltage value.")
    error += "Invalid Voltage value. " 
  }
  if (curr <=0){ 
    console.log("Invalid Current value.")
    error += "Invalid Current value. " 
  }
  if (month <1 || month >12){
    console.log("Invalid Month.")
    error += "Invalid Month. " 
  }
  
  if (day <1 ||  day >31){
    console.log("Invalid Day.")
    error += "Invalid Day. " 
  }
  
  if (year <0 || year >99){
    console.log("Invalid Year.")
    error += "Invalid Year. " 
  }
  
  if (hours <0 || hours >24){
    console.log("Invalid Hour")
    error += "Invalid Hour. " 
  }
  
  if ( minutes <0 || minutes >59){
    console.log("Invalid Minute.")
    error += "Invalid Minute. " 
  }
  return error
}

app.get('/', function(request, response) {response.sendFile(__dirname + '/views/index.html')})

app.post('/login', passport.authenticate( 'local'), function( req, res ) {
    res.json({ status:true })
  })

app.post('/addData', function( request, response){
  console.log(request.body)
  const json = request.body
  let error = ""
  error += checkData(error, json)

  if (error !== "" ){
    error += "Data will not be recorded"
    response.writeHead(400, 'OK', {'Content-Type': 'text/plain' })  //Write a reponse back to client
    response.write(error)
    response.end()
  }
  else{
    let userExists = false
    for (let entry of db.get('data').write()){
      if (entry.username === json.username){userExists = true}
    }
    
    json.power = json.voltage * json.current * json.current
    json.id = (shortid.generate())
    db.get( 'data' ).push(json).write()
    
    let message = "Data recorded. "
    if (userExists === false){
      message += "New user created."
    }
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) //Write a reponse back to client
    response.write(message)
    response.end()
  }
})

app.post("/delData", function( request, response){
  const json = request.body
  
  console.log(json)
  db.get('data').remove({id:json.id.trim()}).write()
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) //Write a reponse back to client
  response.write("If the record was found, it was deleted")
  response.end()
})

app.post("/modData", function( request, response){
  const json = request.body

  let error = ""
  error += checkData(error, json)
        
  if (error !== "" ){
    error += "Data will not be modified"
    response.writeHead(400, 'OK', {'Content-Type': 'text/plain' })  //Write a reponse back to client
    response.write(error)
    response.end()
  }
  else{
    json.power = json.voltage * json.current * json.current
    db.get('data').find({ id:json.id.trim()}).assign(json).write()
    
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) //Write a reponse back to client
    response.write("Data has been recorded")
    response.end()
  }
})

app.post("/getData", function(request, response){
  const allData = db.get( 'data' ).value(),
        username = request.body.username,
        password = request.body.password
  let userData = []
  if (username === 'admin' && password === 'admin'){
    userData = allData
  }
  else{
    for (let entry of allData){
      if (entry.username === request.body.username
          &&  entry.password === request.body.password) {
        userData.push(entry)
      }
    }
  }
  console.log(userData)
  const dataString = JSON.stringify(userData)
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' }) //Write a reponse back to client
  response.write(dataString)
  response.end()
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
