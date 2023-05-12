# Drawly
The World's Worst Drawing App

## Explanation
This app was my attempt at the phase-1-project. I'm an instructor, so I didn't really care about making it meet all the requirements.

## Event Listeners
This app has so many event listeners.
- For the pen: 'mousedown', 'touchstart', 'mousemove', 'touchmove', 'mouseup', 'touchend', 'mouseleave', 'touchcancel'
- For the buttons: 'click'
- For some inputs: 'change'
- For background images: 'load'
- For the window: 'resize'
- For the document: 'keyup'

## Data Model
This app is currently using LocalStorage but the code is there to make it use json-server and db.json. The state of the data may look like this at any given time.
```json
{
  "type": {
    "name": "THICK",
    "width": 10
  },
  "strokeColor": "#000000",
  "marks": [
    {
      "x1": 183,
      "y1": 180,
      "x2": 183,
      "y2": 180,
      "strokeGroupId": 27,
      "type": {
        "name": "THICK",
        "width": 10
      },
      "color": "#000000"
    }
  ],
  "background": "#a35c5c",
  "mode": "DRAW",
  "currentId": 56
}
```

## Array Iteration Methods
- .forEach
- .map
- .filter

## Good Coding Practices
I did pretty well with good coding practices at the beginning but then a few features really messed me up. Anyways, here's a brief explanation of my good coding.
- I'm using Git, so if something goes wrong, I just discard my changes since my last commit. 
- I made a todo list (which is gitignored). It helps me stay focused.
- I'm using a version of the Model-View-Controller design pattern. This means I have one layer of code responsible for the View (all the stuff on the UI). I have another layer that is responsible for the Model (all the data, knowing the state of the application). And there is another layer that goes between the two called the Controller. The View can call Controller methods when a button is clicked or the UI interacted with somehow. The Controller then sends a message to the Model to let it know that it needs to change the background color or change to Eraser mode. The View subscribes to changes from the Model. The Model messages all subscribers when the data (the state of the Model) has changed. The main View class has an onChange method that reacts to these messages, which may involve redrawing the Canvas or changing some other UI element's value. My StorageService classes (LocalStorageService and JsonServerStorageService) can subscribe to the Model, too, and then save the state whenever the Model changes.
- I'm using ES6 Modules. This means each file in this project has just one bit of functionality. Each file can 'import' the functions/variables/etc from other files. This keeps my code nicely organized.

## Cool Features
- You can change the thickness and color of pen strokes
- You can change the background color
- You can erase
- You can 'undo' strokes
- You can 'clear all strokes'
- You can download the image
- You can use hotkeys like 'ctrl+z' to undo
- You can see previously-used colors and click any of those colors to set the stroke color

## Room for Improvement
- Initially the downloaded image was 1920x1080 pixels, which looked really weird on mobile. My code for changing the size of the downloaded image got complex and spaghetti-ish. I blame HTML Canvas.
- My background image feature didn't work very well. Images need to 'load' before they can be drawn on the Canvas and that didn't fit my code very well. I got it resolved, but performance wasn't great, especially on Android Chrome.
- I'd love to have something like a directory structure, so the user can save multiple files and then open them later.