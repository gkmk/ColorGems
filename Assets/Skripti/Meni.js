#pragma strict

var btnStyleP : GUIStyle;
var btnStyleH : GUIStyle;
var btnStyleC : GUIStyle;
var btnExit	  : GUIStyle;

function OnGUI () {
     if (GUI.Button( Rect( 140,570, 186,108), "", btnStyleP)) {
        Application.LoadLevel ("GT"); 
     }
     if (GUI.Button( Rect( 400,570, 199,108), "", btnStyleH)) {
        Application.LoadLevel ("Help"); 
     }
     if (GUI.Button( Rect( 640,570, 248,108), "", btnStyleC)) {
        Application.LoadLevel ("Credits"); 
     }
     if (GUI.Button( Rect( 850,10, 150,54), "", btnExit)) {
        Application.Quit();
     }
}
//--------------------------------------------------------------------------