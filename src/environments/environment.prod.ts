
var systemSettings = localStorage.getItem("settings");
var serverUrl="";
if(systemSettings){ 
  systemSettings = JSON.parse(systemSettings);
  if (systemSettings && systemSettings['common'] && systemSettings['common'].serverUrl) {
    serverUrl=systemSettings['common'].serverUrl;
  }
} 

export const environment = {
  production: true
};

export const apiUrl = serverUrl; 