#pragma strict

var guiObject : GUITexture ; 

var fadeTime = 1.0; 

enum Fade {In, Out} 


// Fade in the GUITexture, wait a couple of seconds, then fade it out 

function Start  () { 

   yield FadeGUITexture(guiObject, fadeTime, Fade.In); 

   yield WaitForSeconds (2.0); 

   yield FadeGUITexture(guiObject, fadeTime, Fade.Out); 

   Application .LoadLevel("Loading");

   } 

 

function FadeGUITexture (guiObject : GUITexture , timer : float, fadeType : Fade) { 

   var start = fadeType == Fade.In? 0.0 : 1.0; 

   var end = fadeType == Fade.In? 1.0 : 0.0; 

   var i = 0.0; 

   var step = 1.0/timer; 

    

   while (i < 1.0) { 

      i += step * Time .deltaTime ; 

      guiObject.color.a = Mathf .Lerp (start, end, i)*.5; 

      yield; 

   } 

}