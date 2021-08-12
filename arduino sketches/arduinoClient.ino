#include <WiFi.h>
#include <HTTPClient.h> //for sending http requests to server
#include "ArduinoJson.h" //parse body response in json format
#define ONBOARD_LED  2 //setting different blinking LED patterns for each state

typedef struct Plante Plante; // define Plant structure to combine linked info about each plant
struct Plante {
  long plantId;
  int temperature;
  int moisture;
  int nitrogen;
  int phosphorus;
  int potassium;
  int oxygen;
  int carbon;
  int light;
};

// wifi ssid
const char* ssid = "Orange-7A78";
// wifi password
const char* password = "0J8RNB60NNL";
// the id of the arduino card that will execute this code
unsigned long arduinoId = 1111;
// ip of the server hosting the backend
const String ipAdress_DomaineName = "192.168.1.102"; //change this with the ip adress or domaine name of server
// url for sending measurements (POST requests)
const String measurementsServerName = "http://" + ipAdress_DomaineName + ":5001/api/arduino/" + arduinoId;
// url for retreiving plant ids by card (GET request)
const String plantIdsServerName = "http://" + ipAdress_DomaineName + ":5001/api/arduino/plants/" + arduinoId;
// array of plants to store each plant's measurements and the changes to apply
Plante plantes[4];
// initialize last time when a post request was sent
unsigned long lastTime = 0;
//15 minutes (900000 milliseconds) between each 2 requests
const unsigned long timerDelay = 10*1000; // change for debugging purposes 

// runs once after booting the card
void setup() {
  // initialse serial monitor for logging info and debugging
  Serial.begin(115200);

  //connecting to wifi network
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    // runs in case connection failed
    Serial.println("Failed, retrying ...");
    delay(2000);
    // blink led once to indicate failing to connect to wifi 
    for(int i = 0; i < 1; i++){
      digitalWrite(ONBOARD_LED,HIGH);
      delay(200);
      digitalWrite(ONBOARD_LED,LOW);
      delay(200);
    }
  }
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 15 minutes, it will take 15 minutes before publishing the first reading.");

  // initiate plantsIds (with a GET request)
  String plantsIdsRaw = httpGETplantIds(plantIdsServerName.c_str());
  //parse string response to json decument
  StaticJsonDocument<1000> plantsJson;
  DeserializationError error = deserializeJson(plantsJson, plantsIdsRaw);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    sendErrorRequest();
    blinkLed(2);
  }

  // store results of get request in plants array
  for(int i = 0; i < 4; i++){
     plantes[i].plantId = plantsJson["plants"][i];
  }
}

void loop() {
  //Send an HTTP POST request every 15 minutes
  // checks if a periode suerior to timerDelay passed since the last request
  if ((millis() - lastTime) > timerDelay) {  
    //Check WiFi connection status
    if(WiFi.status()!= WL_CONNECTED){
      Serial.println("WiFi Disconnected");
      Serial.println("Connecting");
      while(WiFi.status() != WL_CONNECTED) {
        Serial.println("Failed, retrying ...");
        delay(2000);
        // blink once to indicate failing connection status
        for(int i = 0; i < 1; i++){
          digitalWrite(ONBOARD_LED,HIGH);
          delay(200);
          digitalWrite(ONBOARD_LED,LOW);
          delay(200);
        }
      }
      Serial.println("");
      Serial.print("Connected to WiFi network with IP Address: ");
      Serial.println(WiFi.localIP());
    }
    else {
      // send measurements
      httpPostMeasurments(measurementsServerName.c_str());
    }
    // reset last time of sending request
    lastTime = millis();
  }
}

// helper functions
String httpGETplantIds(const char* serverName) {
  // send GET request to retreive ids of plants associated to this card and return result as string
  
  // initialise http client object
  HTTPClient http;

  // set url of request
  http.begin(plantIdsServerName);

  // send get request and retrieve response code
  // Send HTTP POST request
  int httpResponseCode = http.GET();

  // get response
  String payload;

  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    sendErrorRequest();
    blinkLed(2);
  }
  // Free resources
  http.end();

  // return response as a string
  return payload;
}

void httpPostMeasurments(const char* serverName){
  // sent measurements in a POST request
  // initialize http client object
  HTTPClient http;

  // set request url
  http.begin(serverName);
  // set request headers
  http.addHeader("Content-Type", "application/json"); 
  
  //make all measurments
  plantes[0].temperature = 0;
  plantes[0].moisture = 0;
  plantes[0].nitrogen = 0;
  plantes[0].phosphorus = 0;
  plantes[0].potassium = 0;
  plantes[0].oxygen = 0;
  plantes[0].carbon = 0;
  plantes[0].light = 0;
  plantes[1].temperature = 0;
  plantes[1].moisture = 0;
  plantes[1].nitrogen = 0;
  plantes[1].phosphorus = 0;
  plantes[1].potassium = 0;
  plantes[1].oxygen = 0;
  plantes[1].carbon = 0;
  plantes[1].light = 0;
  plantes[2].temperature = 0;
  plantes[2].moisture = 0;
  plantes[2].nitrogen = 0;
  plantes[2].phosphorus = 0;
  plantes[2].potassium = 0;
  plantes[2].oxygen = 0;
  plantes[2].carbon = 0;
  plantes[2].light = 0;
  plantes[3].temperature = 0;
  plantes[3].moisture = 0;
  plantes[3].nitrogen = 0;
  plantes[3].phosphorus = 0;
  plantes[3].potassium = 0;
  plantes[3].oxygen = 0;
  plantes[3].carbon = 0;
  plantes[3].light = 0;

  //make JSON object for request body
  String body = "";
  DynamicJsonDocument doc(1024);
  JsonObject obj = doc.createNestedObject();
  obj["arduinoId"] = 1111;
  JsonArray  plants = doc.createNestedArray("plants");
  for(int i = 0; i < 4; i++){
    JsonObject plant  = doc.createNestedObject();
    plant["plantID"] = plantes[i].plantId;
    plant["temperature"] = plantes[i].temperature;
    plant["moisture"] = plantes[i].moisture;
    plant["nitrogen"] = plantes[i].nitrogen;
    plant["phosphorus"] = plantes[i].phosphorus;
    plant["potassium"] = plantes[i].potassium;
    plant["oxygen"] = plantes[i].oxygen;
    plant["carbon"] = plantes[i].carbon;
    plant["light"] = plantes[i].light;
    plants.add(plant);
  }
  
  serializeJson(doc, body);
  Serial.println(body);
  String response;
  // assign body to HTTP POST request, send it, and retrieve response code
  int httpResponseCode = http.POST(body);

  // retrieve response as string
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    response = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    sendErrorRequest();
    blinkLed(3);
  }
  // Free resources
  http.end();

  Serial.println(response);
 
  //parse response as json document and store it in the plants array
  StaticJsonDocument<1024> doc1;
  
  DeserializationError error = deserializeJson(doc1, response);
  
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    sendErrorRequest();
    blinkLed(3);
  }
  
  bool success = doc1["success"];
  if(!success){
    Serial.println("something went wrong");
    sendErrorRequest();
    blinkLed(2);
  }
  int i = 0;
  for (JsonObject elem : doc1["plants"].as<JsonArray>()) {
    plantes[i].temperature = elem["temperature"];
    plantes[i].moisture = elem["moisture"];
    plantes[i].nitrogen = elem["nitrogen"];
    plantes[i].phosphorus = elem["phosphorus"];
    plantes[i].potassium = elem["potassium"];
    plantes[i].oxygen = elem["oxygen"];
    plantes[i].carbon = elem["carbon"];
    plantes[i].light = elem["light"];
    i++;
  }

  //Act accordingly (apply changes)
  //...
}


void sendErrorRequest(){
    // send GET request to inform the server of a potential parsing error
    HTTPClient http;
    String errorServerName = "http://" + ipAdress_DomaineName + ":5000/api/arduino/error/" + arduinoId;;
 
    http.begin(errorServerName);

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode>0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
}

void blinkLed(int no){
  // helper function for blinking blue LED of esp32 module in a certain pattern
  int blinkingDelai = timerDelay / (2400 * no);
  for(int i = 0; i < blinkingDelai; i++){
    delay(2000);
    for(int j = 0; j < 3; j++){
      digitalWrite(ONBOARD_LED,HIGH);
      delay(200);
      digitalWrite(ONBOARD_LED,LOW);
      delay(200);
    }
  }
}