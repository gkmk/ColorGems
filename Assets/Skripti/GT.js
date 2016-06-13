#pragma strict

var btnStyleGB : GUIStyle;
var btnStyleP2 : GUIStyle;

private var tmpAI:Settings;

function Start() {
	tmpAI = GameObject.FindGameObjectWithTag("Setting").GetComponent("Settings") as Settings;
}

function OnGUI () {
     if (GUI.Button( Rect( 253,130, 518,219), "", btnStyleGB)) {
     	tmpAI.AIon=true;
        Application.LoadLevel ("MainLoader"); 
     }
     if (GUI.Button( Rect( 253,360, 518,219), "", btnStyleP2)) {
     	tmpAI.AIon=false;
        Application.LoadLevel ("MainLoader"); 
     }
}
//--------------------------------------------------------------------------