# Assignment7


 

The core part of Assignment 7 will consist of 2 parts:
1. First, you will implement Bezier Spline interpolation for keyframed properties in AniGraph
    - This will not require much code, but will require you to work through what it means to apply spline interpolation to different properties using 2D time-value controls.
    - This code will be written entirely in the file [`./code/src/classes/interpolation/ABezierInterpolator.js`](./code/src/classes/interpolation/ABezierInterpolator.js)
    
2. We will ask you to create a simple example animation based on some of the basic principles of animation.

Check [`./code/src/classes/interpolation/ABezierInterpolator.js`](./code/src/classes/interpolation/ABezierInterpolator.js) and the videos on Canvas under the Assignment 7 module for more details.


## Animation GUI:
![image](imgs/InterfaceLettered.jpg)
- A: Shape editor tab. This tab will bring you to the shape editor window from assignments 1 & 2.
- B: Custom controls tab. This will bring you to a tab with controls for custom view classes that will show in the Live View tab. There is also a dropdown menu that you can use to switch the view class of the selected object here. 
- C: Live View Tab. This will change the right window to live view, where you can see custom view classes, similar to assignments 1 & 2.
- D: Graph Editor Tab. This will change the right window to the graph editor from assignment 2.
- E: Tween Editor Tab. This will change the right window to the Tween Editor, shown in this image, which lets you adjust the interpolation between different keyframes
- F: Selected Keyframe Track Dropdown. This will select which property of the selected object to edit interpolation for in the Tween Tab Window.
- G: Playback controls and Current Keyframe-able tracks
- H: Timeline, with keyframe tracks, playhead, and tween regions
- I: Scroll Scale Window. Shows the portion of time that is displayed in the timeline. You can use the slider to the left to change the scale, which will adjust the size of t he blue region in the window. You can also click and drag the blue region to change which part of the composition you are zoomed in on.
- J: Tween Editor View: For each dimension of the property you are interpolating, there is a curve connecting keyframe values shown in this window. You can click and drag on handles to edit splines connecting keyframes. The vertical line in the window indicates the current time, and for each curve there is a larger colored dot representing the current value of the property.   

#### Animation Controls
![image](imgs/PlayControls.jpg)
- Current Time: Displays current time of playhead in seconds.
- Loop Time: Displays the time at which the animation will loop. You can click and drag the number or change it, or double click it and type in the duration you want.
- Play / Pause / Stop: The usual meaning...
- Timeline Zoom: Change the zoom of the timelines. Side Note: Currently, if you run into any display issues with the tween window, try adjusting this to see if it fixed things before resorting to anything more drastic.

#### Tween Editor:
![image](imgs/TweenView.jpg)

### Note for checking your work on spline interpolation:
The starter code lets you move the control points of splines in the Tween View. However, property values will be interpolated linearly until you have completed the first part of the assignment. This provides a visual way for you to check your results.
If you have completed the code in `ABezierInterpolator` correctly, then you should see the current value indicators move along the displayed splines over time.
