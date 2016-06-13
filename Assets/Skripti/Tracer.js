#pragma strict

var TracerM:Material[];	//	flash has color change bug so we need to assign materials

function SetMaterial(ID:byte) {
	renderer.material = TracerM[ID];
}