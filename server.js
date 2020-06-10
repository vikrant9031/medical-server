const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connect = require('knex');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

const postgres = connect({

client:'pg',
connection:{
	connectionString :'process.env.DATABASE_URL',
    ssl:true,
	// user : 'postgres',
	// password : 'vikrant',
	// database : 'clinic'
}
})

app.get('/',function(req,res){
	res.send('welcome');
})

app.post('/signAdmin',function(req,res){
	const {Fname,Lname,username,password,pass2,mobile,email} = req.body;
	if(password==pass2){
postgres.insert({fname:Fname,lname:Lname,username:username,password:password,mobile:mobile,email:email})
.into('admin').returning('*').
then(data=>{
	res.json(data);
	console.log(data);
})
}else{
	res.json({error:'error'});
}
})

app.post('/book',function(req,res){
const {name,gender,cause,mob,date,time} = req.body;
const ran = Math.floor(Math.random()*10000);
console.log("Random :"+ran);
console.log("Random :"+name);
postgres.insert({name:name,gender:gender,cause:cause,mob:mob,date:date,time:time,pass:ran}).into('book').returning('*').then(data=>{
	res.json({id:data[0].id,pass:data[0].pass});
})

})

app.post('/show',function(req,res){
const {id,pass} = req.body;
postgres.select('*').from('book').where({id:id,pass:pass}).returning('*').then(data=>{
	res.json(data);
})

})
app.post('/loginAdmin',function(req,res){
  const {email,password} = req.body;
  postgres.select('*').from('admin').where({email:email,password:password}).returning('*').then(data=>{
	console.log("loginAdmin"+data.length);
	  res.json(data.length);
	  
  })
})

app.post('/grab',function(req,res){
	const user=req.body;
	console.log("grab ran "+JSON.stringify(user));
	for(let value of (user.checked)){
			postgres.select('*').from('book').where({id:value}).returning('*').then(data=>{
				// console.log("grab after "+data[0].name);
				
				postgres.insert({name:data[0].name,gender:data[0].gender,cause:data[0].cause,mob:data[0].mob,date:data[0].date,time:data[0].time,pass:data[0].pass}).into('checked').then(da=>{
					res.json('success');
				})
				
				// res.json(data);
			})
 }
})

app.post('/loginpatient',function(req,res){
	const {name,pass} = req.body;
	console.log("login patient "+name,pass);
	postgres.select('*').from('checked').where({name:name,pass:pass}).then(data=>{
        // console.log("login patient"+);
		res.json(data);
		console.log("login patient success");
	})
})

app.post('/check',function(req,res){
	postgres.select('*').from('book').then(data=>{
		console.log("after login Admin "+data);
		res.json(data);
	})
})
// app.post('/login',function(req,res){
// 	const {username,password} = req.body;
// 	postgres.select('*').from('patient').where({username:username,password:password}).returning('*').then(data=>{
// 		res.json(data);
// 	})
// })


app.listen(process.env.PORT || 3003,()=>{
	console.log(' second running');
})
