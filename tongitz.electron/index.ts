import {app, BrowserWindow} from "electron";
import path = require("path");

let ready = false;
let win = null;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(path.resolve(__dirname, "/pages/index.html"));
  win.webContents.openDevTools();
  win.on("closed", function () {
    win = null;
  });
}

app.on("ready", () => {
  ready = true;
  createWindow();
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (win === null && ready) {
    createWindow();
  }
});
