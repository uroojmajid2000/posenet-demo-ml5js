let capture;
let posenet;
let noseX, noseY;
let reyeX, reyeY;
let leyeX, leyeY;
let singlePose, skeleton;
let actor_img;
let specs, smoke;

let counter = 0;
let stage = "down";

function calculateAngle(a, b, c) {
  let radians =
    Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

function setup() {
  // createCanvas(1366, 768);
  createCanvas(360, 640);

  let constraints = {
    video: {
      mandatory: {
        // minWidth: 1366,
        // minHeight: 768,
        minWidth: 360,
        minHeight: 640,
      },
    },
  };
  capture = createCapture(VIDEO);

  capture.hide();

  var canvas = document.getElementById("counter");
  var ctx = canvas.getContext("2d");
  ctx.font = "30px Arial";
  ctx.fillText(counter, 40, 50);

  posenet = ml5.poseNet(capture, modelLoaded);
  posenet.on("pose", receivedPoses);

  actor_img = loadImage("images/shahrukh.png");
  specs = loadImage("images/spects.png");
  smoke = loadImage("images/cigar.png");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function receivedPoses(poses) {
  console.log(poses);
  let shoulder = [
    poses[0].pose.keypoints[5].position.x,
    poses[0].pose.keypoints[5].position.y,
  ];
  let elbow = [
    poses[0].pose.keypoints[7].position.x,
    poses[0].pose.keypoints[7].position.y,
  ];
  let wrist = [
    poses[0].pose.keypoints[9].position.x,
    poses[0].pose.keypoints[9].position.y,
  ];

  let angle = calculateAngle(shoulder, elbow, wrist);

  if (angle > 160) {
    stage = "down";
  }
  if (angle < 30 && stage === "down") {
    stage = "up";

    var canvas = document.getElementById("counter");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillText(counter, 40, 50);

    counter += 1;

    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText(counter, 40, 50);
  }

  //   console.log(shoulder);

  if (poses.length > 0) {
    singlePose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("Model has loaded");
}

function draw() {
  // images and videos(webcam)
  // image(capture, 0, 0);
  // fill(255, 0, 0);
  background(100);
  fill(255, 255, 0);
  ellipse(width/2, height/2, 150, 150);

  if (singlePose) {
    for (let i = 0; i < singlePose.keypoints.length; i++) {
      ellipse(
        singlePose.keypoints[i].position.x,
        singlePose.keypoints[i].position.y,
        20
      );
    }

    stroke(255, 255, 255);
    strokeWeight(5);
    for (let j = 0; j < skeleton.length; j++) {
      line(
        skeleton[j][0].position.x,
        skeleton[j][0].position.y,
        skeleton[j][1].position.x,
        skeleton[j][1].position.y
      );
    }

    //image(specs,singlePose.nose.x-35,singlePose.nose.y-50,80,80);
    //image(smoke,singlePose.nose.x-35,singlePose.nose.y+10,40,40);
  }
}
