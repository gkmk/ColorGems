#pragma strict

static var MusicOn=true;
static var AIon=true;

static var muteS:AudioSource;

var btnMute	   : GUIStyle;
var btnPlay	   : GUIStyle;

function Awake () {
	DontDestroyOnLoad (this);
	muteS = gameObject.GetComponent("AudioSource") as AudioSource;
	if (MusicOn) muteS.Play();
}


function OnGUI () {
     //	the mute button
     if (MusicOn) {
     	if (GUI.Button( Rect( 700,10, 150,54), "", btnMute)) {
        	MusicOn=false;
        	muteS.Stop();
     	}
     } else {
     	if (GUI.Button( Rect( 700,10, 150,54), "", btnPlay)) {
        	MusicOn=true;
        	muteS.Play();
     		}
     }
}