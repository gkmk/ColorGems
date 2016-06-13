#pragma strict

var btnBack	   : GUIStyle;

function Update () {
if (Input.GetKeyDown (KeyCode.Escape))
    Application.LoadLevel ("Menu"); 
}

function OnGUI () {
     //	the back button
     if (GUI.Button( Rect( 10,700, 150,54), "", btnBack)) {
        Application.LoadLevel ("Menu"); 
     }
}