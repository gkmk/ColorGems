#pragma strict

var Players:GameObject[];	//	to assign the game objects
var btnBack : GUIStyle;	//	the style for the back button
var endGameTex : Texture2D[]; //	textures for endings

var DebugStr:String;
var Right:float;	//	right ofset to deploy balls
var UpDown:float;	//	up down offset
var GuiTextures:Texture2D[];	//	used for showing the next color
var ColorGUI:Transform;	//	the element that shows the next color
var cgStyle:GUIStyle;	//	the style for the points
var WonStyle:GUIStyle;	//	the style for game end
var FirstClick=false;
var Ended=false;
private var Points:int[];	//	players points
//--------------------------------------------------------------------------

function Start () {
	
	var defaultRotation = Quaternion.identity; //Players[0].transform.rotation;
	//	Starting up...
	if (!Right) Right=19.15f; if (!UpDown) UpDown=2.5f; 
	var newLine=0;
	var shiftRight=0;

	for (var i=0; i<80; i++) {	//	align the balls
		shiftRight=i%20;
		
		if (shiftRight == 0) newLine--;
		
		//	init player 1 ball
		Instantiate (Players[0], Vector3(-10, newLine*1.815-UpDown-4.3f, (shiftRight*2.009f)-Right), defaultRotation);
		
		//	init player 2 ball
		Instantiate (Players[1], Vector3(-10, (-1.815*newLine)+UpDown-.1f, (shiftRight*2.009f)-Right), defaultRotation);
	}
	
	Points = new int[2];
	Points[0]=0; Points[1]=0;
	
	DebugStr="started";
	//	ok
}
//--------------------------------------------------------------------------

function Update () {
if (Input.GetKeyDown (KeyCode.Escape))
    Application.LoadLevel ("Menu"); 
    
if(!Ended && Input.GetMouseButtonDown(0)){
	//	check if ball was hit
	var hit : RaycastHit;
 	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	if (Physics.Raycast (ray, hit, 100)) {
	    	hit.collider.BroadcastMessage("iClickedYou");
	    	//print("iMove "+hit.collider.name+" from "+hit.collider.transform.position);
	    	if (!FirstClick) {
	    		Destroy(GameObject.FindGameObjectWithTag("Click"));
	    		FirstClick=true;
	    	}
		}
	}
}
//--------------------------------------------------------------------------

function AI_Play() {
	
	if (Ended) return;
	// store balls that can be moved
	var tmpInfo: Array = new Array();
	var hit: RaycastHit;
	//MainCamera.SendMessage ("UpdateDebug", "Thinking...");

	for (var i:GameObject in GameObject.FindGameObjectsWithTag("Player")) {
	
		//	we don't care about player1
		if (i == null || i.name == "TopceA(Clone)") continue;	
	
		//	get that ball info
		var tempCID:ClickSkripta = i.GetComponent("ClickSkripta") as ClickSkripta;
	
		// check if ball can move
		var fwd = i.transform.TransformDirection (Vector3.down);
   		
   		if (Physics.Raycast (i.transform.position, fwd, tempCID.FirstMove)) {
       		//	skip balls that are stuck
       		 continue;
       	}
       		 
       	var tmpDist = 0;
		if (tempCID.FirstMove > 3) tmpDist = tempCID.FirstMove/2;
		else tmpDist = tempCID.FirstMove;
		
       	// see if i can collect
       	//	check for balls around me
		var allBalls:Collider[] = Physics.OverlapSphere(i.transform.position, tmpDist*4.2, 1);
		for (var dBall:Collider in allBalls) {
			//	did i hit other ball
			if (dBall != i.collider && dBall.name != i.name && dBall != null) {	
				//print (dBall.name+" - "+i.name+ " : "+(dBall.name == i.name));
				//	what color is it
				var tempCID2:ClickSkripta = dBall.GetComponent("ClickSkripta") as ClickSkripta;
				if (tempCID2.MyColorID == tempCID2.NextColorID) {
					print("I "+i.name+" "+i.transform.position+" taking "+dBall.name+" @ "+dBall.transform.position);
					if (tempCID) {
						i.renderer.material = tempCID2.Materials[3];
						tempCID.MoveBall();	//	take it!
       					return;
       					}
				}
				var dDist=Vector3.Distance(dBall.transform.position, i.transform.position);
				if (dDist > 5) {
					print("sphere closer - "+dDist);
					tempCID.MoveBall();	//	get close to it
       				return;
				}
			}
		}	
		
		//	see far ahead if i can block
		if (Physics.Raycast (i.transform.position, fwd, hit, tmpDist*7)) {
			
			var tempCID3:ClickSkripta = hit.collider.GetComponent("ClickSkripta") as ClickSkripta;
			
			if ( (hit.distance > 3.1 || tempCID3.MyColorID==7) && hit.collider.name != i.name) {
				print("closing in - "+hit.distance);
       			tempCID.MoveBall();
       			return;
       		}
       	}
   		
   		//	there is no perfect move, add to potential movers
   		tmpInfo.Add(tempCID);
	}
		
	//	didn't find any good move, move random
	var tmpMany:int = tmpInfo.length;
	if (tmpMany>0) {
		tempCID = tmpInfo[Mathf.Floor(Random.Range(0, tmpInfo.length))] as ClickSkripta;
		print("random move");
		tempCID.MoveBall();
		}
	else EndGame();	//	no moves, end game
}
//--------------------------------------------------------------------------

function ChangeNextColor(ID:byte) {
	ColorGUI.guiTexture.texture = GuiTextures[ID];
}
//--------------------------------------------------------------------------

function UpdatePoints(thePoints:int[]) {
	Points = thePoints;
}
//--------------------------------------------------------------------------

function UpdateDebug(dbg:String) {
	DebugStr = dbg;
}
//--------------------------------------------------------------------------

function EndGame() {
	Ended = true;
}
//--------------------------------------------------------------------------

function OnGUI () {  
	//GUI.Label (Rect ( 0, 0, 500, 100), "Debug: "+DebugStr);
    GUI.Label (Rect ( -75, 55, 300, 100), Points[0].ToString(), cgStyle);
    GUI.Label (Rect ( 785, 55, 300, 100), Points[1].ToString(), cgStyle);
    if (Ended) {
    		//	the back button
    		var tmpAI:Settings = GameObject.FindGameObjectWithTag("Setting").GetComponent("Settings") as Settings;
    		var selTex2d:byte=0;
			if ( tmpAI.AIon ) {
				if (Points[1] > Points[0]) selTex2d=1;
			} else {
				if (Points[0] > Points[1]) selTex2d=2;
				else selTex2d=3;
			}
    		GUI.DrawTexture( Rect( 239,80, 545,393), endGameTex[selTex2d], 
    			ScaleMode.ScaleToFit, true, 0);
    		if (GUI.Button( Rect( 437,430, 150,54), "", btnBack)) {
        		Application.LoadLevel ("Menu"); 
     		}
    	}
}
//--------------------------------------------------------------------------
