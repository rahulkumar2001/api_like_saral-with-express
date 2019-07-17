var express = require('express');
var fs=require('fs')
// const bodyParser = require('body-parser');
//theh we call express
const app = express();

app.use(express.json())

			// Here we get all data from courses json files.			
app.get("/course", (req, res)=>{
	var data = fs.readFileSync('courses.json')
	var get_data = JSON.parse(data)
	return res.send(get_data);
})
				// here we post the data it means insert data in courses.json
app.post("/allcourse", (req,res)=>{		
	var mydic = {
		"course":req.body.course,
		"description":req.body.description
	}
	var data = fs.readFileSync(__dirname+"/courses.json");
	var Data = JSON.parse(data);
	mydic["id"]=Data.length+1;
	Data.push(mydic)
	fs.writeFileSync(__dirname + "/courses.json",JSON.stringify(Data,null,2))
	return res.send(Data);
})

					// Here we can modify or update the Data of courses json
app.put("/update_course/:id", (req, res)=>{
	// console.log(__dirname + "/courses.json")
	var data = fs.readFile(__dirname + "/courses.json", (err, data)=>{
		if (err){
			return ({"err":"check your json file "})
		}else{
			var mydata = JSON.parse(data)
			// console.log(mydata)
			var get_details = mydata[req.params.id-1];
			if (get_details.hasOwnProperty('course')){
				get_details["course"] = req.body.course;
			}if (get_details.hasOwnProperty('description')){
				get_details["description"] = req.body.description;
			}
			else{
				return res.json("aapka json galat hai");
			}
			// console.log(mydata);
			fs.writeFileSync(__dirname+"/courses.json", JSON.stringify(mydata,null,2))
			return res.json(mydata);
		}
	})
})

				// Here we get all data from exercises json files.
app.get("/allCourses", (req, res)=>{
    var data = fs.readFileSync('exercises.json')
    var Data = JSON.parse(data)
    return res.send(Data)
})
				// Here we insert new data with their exercises's key in exercises json files.
app.post('/postCourses',(req,res)=>{
	var mydic={
		"course":req.body.course,
		"description":req.body.description,
		"exercises":[]
	}
	var data = fs.readFileSync('exercises.json');
	var Data = JSON.parse(data)
	mydic["id"]=Data.length+1;
	Data.push(mydic)
	fs.writeFileSync(__dirname + '/exercises.json',(JSON.stringify(Data,null,2)))
	return res.send(Data)
})
				// Here we get data through their Id from exercises json files.			
app.get("/get_course/:id",(req, res)=>{
	var data = fs.readFileSync(__dirname+"/exercises.json");
	var Data = JSON.parse(data);
	var get_data = Data[req.params.id-1];
	var mydic = {
		"course":get_data.course,
		"description":get_data.description,
		"id":get_data.id
	}
	return res.send(mydic)
})
				// Here we can modify exercises's json files of their courses and description.
app.put('/course/:id',(req,res)=>{
	var course = req.body.course;
	var description = req.body.description;
	var data = fs.readFileSync('exercises.json');
	var Data = JSON.parse(data)
	var mydic = Data[req.params.id - 1];
	mydic.course = course;
	mydic.description = description;
	Data[req.params.id-1]=mydic;
	fs.writeFileSync(__dirname + '/exercises.json',(JSON.stringify(Data,null,2)))
	return res.send(Data)

})
					// Here we can insert new submission key of data.
app.post('/postCourses/:id',(req, res)=>{
	var id1=req.params.id;
	var sdata=req.body;
	fs.readFile(__dirname+"/exercises.json",(err,data)=>{
		data=JSON.parse(data)
		for (i of data){
			if (i.id==id1){
				sdata["id"]=i.exercises.length+1
				sdata["submission"] = []
				i.exercises.push(sdata)
				fs.writeFileSync(__dirname+"/exercises.json",JSON.stringify(data,null,2))
				return res.send(sdata)
			}
		}
		// res.send("<h1>Page Not Found 404 </h1>")
	})

})

						// Here we can get all exercises accoording to courses Id
app.get('/courses/:id/allexercises', (req,res)=>{
	var data = fs.readFileSync("exercises.json");
	var Data_ = JSON.parse(data)
	var corurs_data =Data_[req.params.id-1]["exercises"];
	return res.send(corurs_data)
	
});
	
						// Here we can insert data in exercises according to their courses Id
app.post('/courses/:id/allexercises',(req, res)=>{
	fs.readFile(__dirname + "/exercises.json", (err, data)=>{
		if (err){
			return ({"ErrorMsg":"check your json"});

		}else{
			var mydata = JSON.parse(data);
			// console.log("yes");
			// console.log(mydata);
			var exercises = {
				courses_id:req.params.id,
				name:req.body.name,
				description:req.body.description,
				"submission":[]
			}
			exercises.id = mydata[req.params.id-1].exercises.length+1;
			mydata[req.params.id-1].exercises.push(exercises)
			fs.writeFile('exercises.json',JSON.stringify(mydata,null,2))
			return res.json(mydata);
		}
	})
})	

						// Here we can do modify data according to exercises's Id of courses's Id.
app.put('/course/:id/exercise/:exerid',(req,res)=>{
	var data = fs.readFileSync('exercises.json')
	var Data = JSON.parse(data)
	var dic = Data[req.params.id-1].exercises[req.params.exerid-1]
	dic.name=req.body.name
	dic.description=req.body.description
	Data[req.params.id-1].exercises[req.params.exerid-1]=dic
	fs.writeFileSync('exercises.json',(JSON.stringify(Data,null,2)))
	return res.send(Data)
})
						// Here we get exercises data throigh their Id from courses Id.
app.get("/course/:id/exercises/:Id",(req,res)=>{
	var dicData = fs.readFileSync("exercises.json");
	var dicDatas = JSON.parse(dicData);
	for (i of dicDatas){
		if (i.id==req.params.id)
			for (j of i.exercises){
				if (j.id==req.params.Id)
					return res.send(j);
			}
		}
})
							// Here we insert submission data in exercise.
app.post("/course/:id/exercises/:Id/submission",(req, res)=>{
	var submission = {
		courses_id:req.params.id,
		exercises_id:req.params.Id,
		content:req.body.content,
		user_name:req.body.user_name
	}
	var data = fs.readFileSync(__dirname+"/exercises.json");
	var Data = JSON.parse(data);
	submission.id = Data[req.params.id-1].exercises[req.params.Id-1].submission.length+1;
	Data[req.params.id-1].exercises[req.params.Id-1].submission.push(submission);
	fs.writeFileSync("exercises.json",(JSON.stringify(Data,null,2)))
	return res.send(Data);

})
app.listen(8000,()=>{
    console.log('Example app listening on port !');
    console.log("successfully")
});