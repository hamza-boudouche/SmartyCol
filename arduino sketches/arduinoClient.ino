#include <WiFi.h>
#include <HTTPClient.h>
#include "ArduinoJson.h"

typedef struct Plante Plante;
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

const char* ssid = "Orange-7A78";
const char* password = "0J8RNB60NNL";
unsigned long arduinoId = 1111;
const String ipAdress_DomaineName = "192.168.1.102"; //change this with the ip adress or domaine name of server
const String measurementsServerName = "http://" + ipAdress_DomaineName + ":5000/api/arduino/" + arduinoId;
const String plantIdsServerName = "http://" + ipAdress_DomaineName + ":5000/api/arduino/plants/" + arduinoId;
Plante plantes[4];
unsigned long lastTime = 0;
//15 minutes (900000 milliseconds) between each 2 requests
const unsigned long timerDelay = 10000; 

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println("Failed, retrying ...");
    delay(500);
  }
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 15 minutes, it will take 15 minutes before publishing the first reading.");

  // initiate plantsIds (with a GET request)
  String plantsIdsRaw = httpGETplantIds(plantIdsServerName.c_str());
   StaticJsonDocument<1000> plantsJson;
   DeserializationError error = deserializeJson(plantsJson, plantsIdsRaw);
   if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
   }

  for(int i = 0; i < 4; i++){
     plantes[i].plantId = plantsJson["plants"][i];
  }
}

void loop() {
  //Send an HTTP POST request every 15 minutes
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      httpPostMeasurments(measurementsServerName.c_str());
    }
    else {
      Serial.println("WiFi Disconnected");
      Serial.println("Connecting");
      while(WiFi.status() != WL_CONNECTED) {
        Serial.println("Failed, retrying ...");
        delay(500);
      }
      Serial.println("");
      Serial.print("Connected to WiFi network with IP Address: ");
      Serial.println(WiFi.localIP());
    }
    lastTime = millis();
  }
}


String httpGETplantIds(const char* serverName) {
  HTTPClient http;

  // Your IP address with path or Domain name with URL path 
  http.begin(plantIdsServerName);

  // Send HTTP POST request
  int httpResponseCode = http.GET();

  String payload;

  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}

void httpPostMeasurments(const char* serverName){
  HTTPClient http;

  // Your IP address with path or Domain name with URL path 
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json"); 
  
  //get all measurments
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
  // Send HTTP POST request
  int httpResponseCode = http.POST(body);

  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    response = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    return ;
  }
  // Free resources
  http.end();

  Serial.println(response);

  //Store response in array of plants
  StaticJsonDocument<1024> doc1;
  
  DeserializationError error = deserializeJson(doc1, response);
  
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return ;
  }
  
  bool success = doc1["success"];
  if(!success){
    Serial.println("something went wrong");
    return;
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