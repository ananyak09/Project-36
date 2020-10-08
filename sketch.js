var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var changeState , readState;
var bedroom, garden,  washroom;

var gameState;

function preload(){
   dogImg=loadImage("Images/dogImg.png");
   dogImg1=loadImage("Images/happy dog.png");
   bedroom=loadImage("Images/IMAGES/Bed Room.png");
   garden=loadImage("Images/IMAGES/Garden.png");
   washroom=loadImage("Images/IMAGES/Wash Room.png")

  }


function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed the dog");
  feed.position(670,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(770,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

}

// function to display UI
function draw() {
  background(46,139,87);

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry");
    foodObj.display();
   }

   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
  }

  //fedTime=database.ref('FeedTime');
  //fedTime.on("value",function(data){
  //  lastFed=data.val();
  //});

  drawSprites();
  
  
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to write values in DB

function feedDog(){
  dog.addImage(dogImg1);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState : "Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}