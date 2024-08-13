let circles = [];
let expanding = false;
let expandRate = 8;
let showText = false;
let timer;
let fadeInStart;
let fadeInDuration = 2000; // Duration for text fade-in
let alphaValue = 0; // Starting alpha value for text
let showClickText = false;
let clickTextTimeout;
let septahedronRadius = 0;
let septahedronDelay = 2000; // Delay before septahedron starts growing (in milliseconds)
let septahedronStartTime;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(32);
  textFont('sans-serif');
  fill(255);

  // Create 7 circles in the center
  let centerX = width / 2;
  let centerY = height / 2;

  for (let i = 0; i < 7; i++) {
    circles.push({
      x: centerX,
      y: centerY,
      radius: 50,
      angle: TWO_PI / 7 * i,
      targetX: centerX + 150 * cos(TWO_PI / 7 * i),
      targetY: centerY + 150 * sin(TWO_PI / 7 * i),
      currentX: centerX,
      currentY: centerY,
      pulseFactor: 0,
      pulseDirection: random([3, 2])
    });
  }

  // Set timeout for showing the "Click" text
  clickTextTimeout = setTimeout(() => {
    showClickText = true;
  }, 5000);
}

function draw() {
  background(0);

  stroke(255);
  strokeWeight(5);
  noFill();

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    let currentRadius = circle.radius + circle.pulseFactor;
    ellipse(circle.currentX, circle.currentY, currentRadius * 2);

    if (expanding) {
      circle.radius += expandRate * 0.1;
      circle.currentX = lerp(circle.currentX, circle.targetX, 0.05);
      circle.currentY = lerp(circle.currentY, circle.targetY, 0.05);
    } else {
      circle.pulseFactor += circle.pulseDirection * 0.02; // Slower pulsing effect
      if (circle.pulseFactor > 2 || circle.pulseFactor < -2) { // Adjusted limits for subtler effect
        circle.pulseDirection *= -1;
      }
    }
  }

  if (expanding && millis() - septahedronStartTime >= septahedronDelay) {
    drawSeptahedron();
    septahedronRadius += 0.5; // Slower expansion
  }

  if (showText) {
    let elapsedTime = millis() - fadeInStart;
    if (elapsedTime < fadeInDuration) {
      alphaValue = map(elapsedTime, 0, fadeInDuration, 0, 255);
    } else {
      alphaValue = 255;
    }

    push();
    noStroke(); // Remove stroke from text
    textAlign(CENTER, CENTER);
    fill(255, 255, 255, alphaValue); // Fade-in effect with alpha value
    
    // Draw the header
    fill(0,0,0, alphaValue);
    textFont('Dancing Script');
    textSize(52);
    text('Home of Enchantments', width / 2, height / 2 - 100);
    textFont('sans-serif');
    textSize(26);
    text('A multiplatform Experience', width / 2, height / 2 - 50);
    
    // Draw the links
    textFont('sans-serif');
    textSize(16);
    text('ABOUT', width / 2 - 100, height / 2);
    text('TICKETS', width / 2 + 100, height / 2);
    pop();
  }

  if (showClickText && !expanding) {
    push();
    noStroke();
    textAlign(CENTER, CENTER);
    fill(0); // Black text for "CLICK TO AWAKEN"
    textSize(16);
    text('CLICK TO AWAKEN', width / 2, height / 2 + 100);
    pop();
  }
}

function drawSeptahedron() {
  push();
  translate(width / 2, height / 2);
  fill(255);
  noStroke();
  beginShape();
  for (let i = 0; i < 7; i++) {
    let angle = TWO_PI / 7 * i;
    let x = septahedronRadius * cos(angle);
    let y = septahedronRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function handleUserInteraction() {
  if (showClickText) {
    showClickText = false; // Hide "Click" text immediately
  }
  expanding = true;
  septahedronStartTime = millis(); // Set the start time for the septahedron
  timer = millis(); // Start the timer
  setTimeout(() => {
    showText = true;
    fadeInStart = millis(); // Start the fade-in timer
  }, 7000);
  clearTimeout(clickTextTimeout); // Clear the timeout if interaction happens before 5 seconds
}

function mousePressed() {
  console.log('Mouse pressed'); // Debug statement
  handleUserInteraction();
}

function touchMoved() {
  console.log('Touch moved'); // Debug statement
  handleUserInteraction();
  return false; // Prevent default behavior to avoid conflicts with mousePressed
}

function mouseClicked() {
  if (showText) {
    let dAbout = dist(mouseX, mouseY, width / 2 - 100, height / 2);
    let dTickets = dist(mouseX, mouseY, width / 2 + 100, height / 2);

    if (dAbout < 50) {
      window.open('https://newyorkcityxr.com/loveliness/about', '_blank');
    } else if (dTickets < 50) {
      window.open('https://newyorkcityxr.com/loveliness/tickets', '_blank');
    }
  }
}

function touchEnded() {
  console.log('Touch ended'); // Debug statement
  if (showText) {
    let dAbout = dist(touches[0].x, touches[0].y, width / 2 - 100, height / 2);
    let dTickets = dist(touches[0].x, touches[0].y, width / 2 + 100, height / 2);

    if (dAbout < 50) {
      window.open('https://newyorkcityxr.com/loveliness/about', '_blank');
    } else if (dTickets < 50) {
      window.open('https://newyorkcityxr.com/loveliness/tickets', '_blank');
    }
  }
  return false; // Prevent default behavior to avoid conflicts with mouseClicked
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
