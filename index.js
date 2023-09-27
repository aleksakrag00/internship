var screenshotmachine = require("screenshotmachine");
const fs = require("fs");
const { google } = require("googleapis");

const google_api_folder_id = "1peLu40txWS0jD8ytb5breBEQOoNKfl7f";
var customerKey = "f4186f";
var secretPhrase = "";
var options;
var apiUrl;
var output;

var urlList = {
  ifunded: "https://ifunded.de/en/",
  propertypartner: "https://www.propertypartner.co/",
  propertymoose: "https://propertymoose.co.uk/",
  homegrown: "https://www.homegrown.co.uk/",
  realtymogul: "https://www.realtymogul.com/",
};

//GOOGLE DOCS FUNCTION

async function uploadFile(name) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "internship-web-fc827e3dd1d7.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const driveService = google.drive({
      version: "v3",
      auth,
    });

    const fileMetaData = {
      name: name,
      parents: [google_api_folder_id],
    };

    const media = {
      mimeType: "image/jpg",
      body: fs.createReadStream(name),
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      field: "id",
    });
    return response.data.id;
  } catch (err) {
    console.log(err);
  }
}

//SCREENSHOT

for (let i = 0; i < Object.keys(urlList).length; i++) {
  console.log(Object.keys(urlList)[i]);
  console.log(Object.values(urlList)[i]);

  options = {
    url: Object.values(urlList)[i],
    dimension: "1920x1080",
    device: "desktop",
    format: "png",
    cacheLimit: "0",
    delay: "200",
    zoom: "100",
  };

  apiUrl = screenshotmachine.generateScreenshotApiUrl(
    customerKey,
    secretPhrase,
    options
  );

  output = i + 1 + "_" + Object.keys(urlList)[i] + ".jpg";

  screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output));
}

//GOOGLE DOCS UPLOAD

for (let i = 0; i < Object.keys(urlList).length; i++) {
  uploadFile(i + 1 + "_" + Object.keys(urlList)[i] + ".jpg").then((data) => {
    console.log(data);
  });
}
