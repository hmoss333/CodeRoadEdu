﻿#pragma strict

var startTime : float;

var debug : boolean;

var heightCurve : AnimationCurve;

var upAnimation : AnimationClip;
var downAnimation : AnimationClip;
var landAnimation : AnimationClip;
var idleAnimation : AnimationClip;

var multiplier : float = 1.0;
var offset : float = 0.0;
var timeOffset : float;

private var verticalSpeed : float;
private var previousYPosition : float;
static var maxVerticalSpeed : float = 5.0;

private var upDownBlend : float;
private var idleLandBlend : float;

var upDownBlendCurve : AnimationCurve;

private var isLanding : boolean = false;
static var landBlendDuration : float = .5;
private var landStartTime : float;

private var isGrounded : boolean = false;

function Start () {
	GetComponent.<Animation>()[upAnimation.name].layer = 1;
	GetComponent.<Animation>()[downAnimation.name].layer = 1;
	GetComponent.<Animation>()[landAnimation.name].layer = 0;
	GetComponent.<Animation>()[idleAnimation.name].layer = 0;
}

function Update () {
	transform.localPosition.y = heightCurve.Evaluate(Time.time - startTime + timeOffset) 	* multiplier + offset;
	
	verticalSpeed = (transform.localPosition.y - previousYPosition) / Time.deltaTime;
	previousYPosition = transform.localPosition.y;
	
	upDownBlend = Mathf.Clamp01((verticalSpeed + maxVerticalSpeed)/ (maxVerticalSpeed * 2));
	
	upDownBlend = upDownBlendCurve.Evaluate(upDownBlend);
	
	//Is grounded.
	if(transform.localPosition.y < .1 + offset) isGrounded = true;
	else isGrounded = false;

	
	if(isGrounded){
		GetComponent.<Animation>().Blend(upAnimation.name, 0, .05);
		GetComponent.<Animation>().Blend(downAnimation.name, 0, .05);
		
		if(!isLanding){
			isLanding = true;
			landStartTime = Time.time;
		}
		
		idleLandBlend = 1 - Mathf.Clamp01((Time.time - landStartTime) / landBlendDuration);

		GetComponent.<Animation>().Blend(landAnimation.name, idleLandBlend, .05);
		GetComponent.<Animation>().Blend(idleAnimation.name, 1 - idleLandBlend, .05);
	}
	else{
		isLanding = false;

		GetComponent.<Animation>().Blend(upAnimation.name, upDownBlend, .05);
		GetComponent.<Animation>().Blend(downAnimation.name, 1 - upDownBlend, .05);
		

		idleLandBlend = 0;
	}
	
	
}

function OnGUI(){
	if(debug){
		GUILayout.Label("Vertical Speed: " + verticalSpeed.ToString());
		GUILayout.Label("Up & Down Blend: " + upDownBlend.ToString());
		GUILayout.Label("Idle & Land Blend: " + idleLandBlend.ToString());
	}
}