#pragma strict

var Speed:float = 2;	//	the speed of the ball moving
var Materials:Material[];	//	flash has color change bug so we need to assign materials
var SleepM:Material[];	//	flash has color change bug so we need to assign materials
var TracerClone:Transform;
static var MainCamera:Transform;

private var SelfDestruct=false;
private var endPos : float;	//	the end position that ball has to move to
private var animToPos:byte=0;	//	do i have to move or not? save CPU on update
public var FirstMove:float = 3.66;	//	the first move will start with X (2) fields
public var MyColorID: byte=7;	//	the id of the ball (used to check against other balls)

static public var playerTurn:int=0;	//	who's turn is it?
static public var allowedTurn:byte=1;	//	can i click and move?
static public var ComboMulti:int;	//	if you hit more balls at once get more points with combo
static public var Points:int[];	//	players points
static public var Sounds:AudioSource[];	//	players points
static public var NextColorID: byte;	//	the next color ID

static public var CollisionStack:Array=new Array();	// collisions this round
static var AI=true;	//	is AI active
static var MUSIC=true;	//	is AI active
static var END=false;	//	is AI active
//--------------------------------------------------------------------------

//--------------------------------------------------------------------------


function Start() {
	playerTurn=0; END=false;
	NextColorID = Mathf.Floor(Random.Range(0,2.9));
		
	endPos = transform.position.y;
	MainCamera = Camera.mainCamera.transform;
	MainCamera.SendMessage ("ChangeNextColor", NextColorID);
	
	Sounds = new AudioSource[3];
	Sounds[0] = GameObject.Find("SoundHigh").GetComponent("AudioSource") as AudioSource;
	Sounds[1] = GameObject.Find("SoundLow").GetComponent("AudioSource") as AudioSource;
	Sounds[2] = GameObject.Find("SoundOUT").GetComponent("AudioSource") as AudioSource;
	
	Points = new int[2];
	Points[0]=0; Points[1]=0;

	var tmpAI:Settings = GameObject.FindGameObjectWithTag("Setting").GetComponent("Settings") as Settings;
	AI = tmpAI.AIon;
	MUSIC = tmpAI.MusicOn;
}
//--------------------------------------------------------------------------

function MoveBall() {
	print(transform.position);
	// destroying all tracers
	for (var traceC in GameObject.FindGameObjectsWithTag("Finish")) {
    	Destroy(traceC);
	}
	
	ComboMulti=0;
	CollisionStack.Clear();
	
		if (gameObject.name == "TopceB(Clone)") 
				endPos -= FirstMove;
		else	endPos += FirstMove;
	
	//	i can move, change the color
		allowedTurn=0;
		
		MyColorID = NextColorID;
		renderer.material = Materials[MyColorID];
		//	color changed
		
		NextColorID = Mathf.Floor(Random.Range(0,2.9));
		MainCamera.SendMessage ("ChangeNextColor", NextColorID);
		
		animToPos=1;
		if (FirstMove>2.0f) FirstMove /=2;
}
//--------------------------------------------------------------------------

function Update () {
 	if (animToPos) {
 		// moving 
 		transform.position.y = Mathf.Lerp(transform.position.y, endPos, Time.deltaTime* Speed);

 		if (gameObject.name == "TopceB(Clone)" && transform.position.y <= endPos+.001 ) 
 		 	CheckBallIDs();

    	else if ( gameObject.name == "TopceA(Clone)" && transform.position.y >= endPos-.001 ) 	
    		CheckBallIDs();

   	 }  	 
}
//--------------------------------------------------------------------------

function SelectActive() {
		
	// destroying all tracers
	for (var traceC in GameObject.FindGameObjectsWithTag("Finish")) {
    	Destroy(traceC);
	}
	
	//	check if out of box
	if (this!=null) {
	if (gameObject.transform.position.y > 9.5f && gameObject.name == "TopceA(Clone)")
	{
		if (MUSIC) Sounds[2].Play();
		Points[0] += 500;
		SelfDestruct=true;
	}
	if (gameObject.transform.position.y < -13.5f && gameObject.name == "TopceB(Clone)")
	{
		if (MUSIC) Sounds[2].Play();
		Points[1] += 500;
		SelfDestruct=true; 
	}
	}
	
	var tmpCheckA:int=0;
	var tmpCheckB:int=0;
	var cmA:int=0; var cmB:int=0;
//	selecting active balls
for (var i:GameObject in GameObject.FindGameObjectsWithTag("Player")) {
	
	if (i == null) continue;
	
	if (i.name == "TopceA(Clone)") tmpCheckA++;
	if (i.name == "TopceB(Clone)") tmpCheckB++;
	
	var tempCID:ClickSkripta = i.GetComponent("ClickSkripta") as ClickSkripta;
	var theCID:byte = tempCID.MyColorID;
	
	
	var fwd = i.transform.TransformDirection (Vector3.up);
	if (i.name == "TopceB(Clone)")
		fwd = i.transform.TransformDirection (Vector3.down);
		
	if (Physics.Raycast (i.transform.position, fwd, tempCID.FirstMove)) {
       	if (i.name == "TopceB(Clone)") cmB++;
       	else cmA++;
    }
	
	
	if (theCID == 7) continue;	//	skip if not moved yet
	
	if (playerTurn%2 == 0 && i.name == "TopceA(Clone)") {
		i.renderer.material = Materials[theCID];
		var tc:Transform = Instantiate (TracerClone, i.transform.position, Quaternion.identity);
		var trc:Tracer = tc.GetComponent("Tracer") as Tracer;
		trc.SetMaterial(theCID);
    	}
    else if (playerTurn%2 == 1 && i.name == "TopceB(Clone)"){
   	 	i.renderer.material = Materials[theCID];
   	 	tc = Instantiate (TracerClone, i.transform.position, Quaternion.identity);
		trc = tc.GetComponent("Tracer") as Tracer;
		trc.SetMaterial(theCID);
    } else i.renderer.material = SleepM[theCID];
  }
  //	active balls selected
  
  //	check game end
  if (tmpCheckA==0 || tmpCheckB==0 || 
  	(SelfDestruct && (tmpCheckA<2 || tmpCheckB<2)) ||
  	 	tmpCheckA == cmA || tmpCheckB == cmB )  {  	 	
  	 		END=true;
  	 		MainCamera.SendMessage ("EndGame");
  	 	}
}
//--------------------------------------------------------------------------

function iClickedYou () {
if (allowedTurn) {
	//	check player turn
	if ((playerTurn%2 == 0 && gameObject.name == "TopceA(Clone)")
		|| (playerTurn%2 == 1 && gameObject.name == "TopceB(Clone)"))
	{
		//	can i move?	
		var fwd = transform.TransformDirection (Vector3.up);
		if (gameObject.name == "TopceB(Clone)")
			fwd = transform.TransformDirection (Vector3.down);
		
		if (Physics.Raycast (transform.position, fwd, FirstMove)) {
        	//	i can't move! there is someone in front of me!
        	return;
    	}
    	
		MoveBall();
	} //	it's not my turn, click the other balls
	}
	//	i am not allowed to move
}
//--------------------------------------------------------------------------

function CheckBallIDs() {
	animToPos=0;	// stop the animation
	
	//	moving stops, check for balls around me
	
	CollisionStack.Add(collider);

	//	check for collisions
	var allBalls:Collider[] = Physics.OverlapSphere(transform.position, 2.1, 1);

	for (var dBall:Collider in allBalls) {
		var foundTmp=false;
		if (dBall != collider && dBall.name != gameObject.name && dBall != null) {
			for (var i=0; i<CollisionStack.Count; i++ ) {
				if (CollisionStack[i] == dBall) {
					foundTmp=true;
					break;
				}
			}
			if (!foundTmp) {		
				//	found a nice ball, lets check her
				dBall.SendMessage ("CanItakeU", MyColorID);	//	send them check message
			}
		}
	}	
	
	if (CollisionStack.Count > 1) {
		// delete me
		//	take all the nice balls
		var theColliders:Collider;
		for (var j=0; j<CollisionStack.Count; j++ ) { //	delete all affected balls
			theColliders = CollisionStack[j] as Collider;
			theColliders.SendMessage ("RemoveMe");
		}
		MainCamera.SendMessage ("UpdatePoints", Points);
	}
		
	//	ok, the other player can play now
	playerTurn++;	//	change player turn
	allowedTurn=1;	//	allow them to play

	SelectActive();
	//	should AI play?
  	if (playerTurn%2 == 1 && AI && !END) {
  		MainCamera.SendMessage ("AI_Play");
  	}
  	if (SelfDestruct) DestroyImmediate(gameObject);
}
//--------------------------------------------------------------------------

function RemoveMe() {
	// destroy me
	DestroyImmediate(gameObject);
}
//--------------------------------------------------------------------------

function CanItakeU(Kako:byte) {
	if ( ( Kako == MyColorID && Kako < 3 ) || ( Kako < 3 && MyColorID == 7) ) {
		
		if (playerTurn%2 == 0) {	//	player 1 player
			if (gameObject.name == "TopceB(Clone)")	//	im player 2 ball
				Points[0] += 100+(10*ComboMulti);	//	give him points
				
			else return;
			}
		else {
			if (gameObject.name == "TopceA(Clone)")	//	else im player1 and he is player 2
				Points[1] += 100+(10*ComboMulti);	//	give him points
			else return;
			}
		ComboMulti++;
		//	add this ball in passed colliders
		CollisionStack.Add(collider);
		if (MUSIC) {
			if (MyColorID == 7) Sounds[1].Play();
			else Sounds[0].Play();
		}
		
		//	check for balls around me
		var allBalls:Collider[] = Physics.OverlapSphere(transform.position, 2.1, 1);
		
		for (var dBall:Collider in allBalls) {
			var foundTmp=false;
			if (dBall != collider && dBall.name == gameObject.name && dBall != null) {
				for (var i=0; i<CollisionStack.Count; i++ ) {
					if (CollisionStack[i] == dBall) {
						foundTmp=true;
						break;			
					}
				}
				if (!foundTmp) {
					dBall.SendMessage ("CanItakeU", MyColorID);	//	send them check message
				}
			}
		}	
	}
}
//--------------------------------------------------------------------------
