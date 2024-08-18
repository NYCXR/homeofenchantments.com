let img;
let video;
let videoReady = false;
let seedCircles = [];
let animateSeed = false;
let animationProgress = 0;
let fadeInProgress = 0;
let videoOpacity = 0;
let glowGraphics;
let startButton;
let staticGlowBuffer; // Buffer to store the static glow effect

// Load the image and video.
function preload() {
  img = loadImage('assets/tome.png');
  video = createVideo(['assets/water.mp4'], videoLoaded);
  video.hide(); // Hide the video element, we only want to draw it on the canvas.
}

function videoLoaded() {
  video.volume(0); // Mute video to allow autoplay
  video.elt.controls = false; // Disable controls
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create the glow graphics buffer
  glowGraphics = createGraphics(windowWidth, windowHeight);
  glowGraphics.clear();

  // Create a static buffer to store the glow effect
  staticGlowBuffer = createGraphics(windowWidth, windowHeight);
  staticGlowBuffer.clear();

  // Create a start button to handle user interaction
  startButton = createButton('Click to begin');
  startButton.position(windowWidth / 2 - 50, windowHeight / 2);
  startButton.style('width', '100px');
  startButton.style('height', '50px');
  startButton.style('background-color', 'black');
  startButton.style('color', 'white');
  startButton.style('border', '2px solid white');
  startButton.style('font-size', '16px');
  startButton.mousePressed(startAnimation);
}

function startAnimation() {
  startButton.hide();
  video.loop(); // Loop the video once it's ready
  videoReady = true;

  // Gradually increase the video opacity over 1 second
  let fadeInInterval = setInterval(() => {
    videoOpacity += 1 / (60 * 1); // Assuming 60 frames per second, fade in over 1 second
    if (videoOpacity >= 1) {
      videoOpacity = 1;
      clearInterval(fadeInInterval);
    }
  }, 1000 / 60); // Update opacity 60 times per second

  // Start the Seed of Life animation after an additional 4 seconds (5 seconds total delay)
  setTimeout(() => {
    animateSeed = true;
    createGlowEffect(); // Create the glow effect when animation starts
  }, 5000); // Start animation after 5 seconds total (1s video fade + 4s delay)
}

function createGlowEffect() {
  // Draw the Seed of Life circles on the static buffer to create the glow effect
  let imgSize = min(width / 2, height / 2);
  let ellipseSize = imgSize * 0.35;  // Slightly smaller size
  let videoX = (width - imgSize) / 2 + imgSize * 0.53 - ellipseSize / 2;  // Shift right
  let videoY = (height - imgSize) / 2 + imgSize * 0.47 - ellipseSize / 2;  // Shift up
  let seedRadius = (ellipseSize / 4);

  let centerX = videoX + ellipseSize / 2;
  let centerY = videoY + ellipseSize / 2;

  staticGlowBuffer.clear();
  staticGlowBuffer.stroke(255, 150); // Slightly lower alpha for glow effect
  staticGlowBuffer.strokeWeight(15); // Larger stroke weight for the glow
  staticGlowBuffer.noFill();
  
  for (let i = 0; i < 7; i++) {
    let angle = TWO_PI / 6 * i;
    let x = centerX + cos(angle) * seedRadius;
    let y = centerY + sin(angle) * seedRadius;
    staticGlowBuffer.ellipse(x, y, seedRadius * 2);
  }
  
  staticGlowBuffer.filter(BLUR, 5); // Apply a smaller blur for a reduced glow radius
}

function draw() {
  background(0);

  if (videoReady) {
    // Draw the background image, centered.
    let imgSize = min(width / 2, height / 2);
    let imgX = (width - imgSize) / 2;
    let imgY = (height - imgSize) / 2;
    image(img, imgX, imgY, imgSize, imgSize);

    // Adjust these parameters to fit the inner circle
    let ellipseSize = imgSize * 0.35;  // Slightly smaller size
    let videoX = imgX + imgSize * 0.53 - ellipseSize / 2;  // Shift right
    let videoY = imgY + imgSize * 0.47 - ellipseSize / 2;  // Shift up
    let thickness = 15; // Adjust the thickness if needed

    // Create a series of arcs to simulate a stroked ellipse
    for (let i = 0; i < thickness; i++) {
      let maskedVideo = video.get();
      let videoMask = createGraphics(ellipseSize, ellipseSize);
      videoMask.noFill();
      videoMask.stroke(255);
      videoMask.strokeWeight(2);
      videoMask.ellipse(ellipseSize / 2, ellipseSize / 2, ellipseSize - i * 2, ellipseSize - i * 2);
      maskedVideo.mask(videoMask);

      tint(255, 255 * videoOpacity); // Apply opacity to the video texture
      image(maskedVideo, videoX, videoY, ellipseSize, ellipseSize);
      noTint(); // Reset tint

      // Dispose of the graphics buffer after use to prevent memory buildup
      videoMask.remove();
    }

    // Draw the static glow effect from the buffer
    image(staticGlowBuffer, 0, 0);

    // Draw the Seed of Life circles centered within the video-textured ellipse.
    if (animateSeed) {
      fadeInProgress += 0.01; // Adjust speed of fade-in
      if (fadeInProgress > 1) fadeInProgress = 1;

      let seedRadius = (ellipseSize / 6) * fadeInProgress; // Smaller seed radius
      let centerX = videoX + ellipseSize / 2;
      let centerY = videoY + ellipseSize / 2;

      // Draw the solid circles on top
      stroke(255, 255 * fadeInProgress);
      strokeWeight(4);
      noFill();
      for (let i = 0; i < 7; i++) {
        let angle = TWO_PI / 6 * i;
        let x = centerX + cos(angle) * seedRadius;
        let y = centerY + sin(angle) * seedRadius;
        ellipse(x, y, seedRadius * 2);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  startButton.position(windowWidth / 2 - 50, windowHeight / 2); // Reposition the start button if the window is resized
}
