let img;
let video;
let videoReady = false;
let seedCircles = [];
let animateSeed = false;
let animationProgress = 0;
let fadeInProgress = 0;
let glowGraphics;
let startButton;

// Load the image and video.
function preload() {
  img = loadImage('assets/tome.png');
  video = createVideo(['assets/water.mp4'], videoLoaded);
  video.hide(); // Hide the video element, we only want to draw it on the canvas.
}

function videoLoaded() {
  video.volume(0); // Mute video to allow autoplay
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create the glow graphics buffer
  glowGraphics = createGraphics(windowWidth, windowHeight);
  glowGraphics.clear();

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

  setTimeout(() => {
    animateSeed = true;
  }, 4000); // Start animation after 4 seconds
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

      image(maskedVideo, videoX, videoY, ellipseSize, ellipseSize);

      // Dispose of the graphics buffer after use to prevent memory buildup
      videoMask.remove();
    }

    // Draw the Seed of Life circles centered within the video-textured ellipse.
    if (animateSeed) {
      fadeInProgress += 0.01; // Adjust speed of fade-in
      if (fadeInProgress > 1) fadeInProgress = 1;

      let seedRadius = (ellipseSize / 5) * fadeInProgress;
      let centerX = videoX + ellipseSize / 2;
      let centerY = videoY + ellipseSize / 2;

      // Clear the glow graphics buffer
      glowGraphics.clear();

      // Draw glow effect
      glowGraphics.stroke(255, 255 * fadeInProgress);
      glowGraphics.strokeWeight(15); // Larger stroke weight for the glow
      glowGraphics.noFill();
      for (let i = 0; i < 7; i++) {
        let angle = TWO_PI / 6 * i;
        let x = centerX + cos(angle) * seedRadius;
        let y = centerY + sin(angle) * seedRadius;
        glowGraphics.ellipse(x, y, seedRadius * 2);
      }
      
      if (frameCount % 2 == 0) {
        glowGraphics.filter(BLUR, 10); // Apply blur less frequently
      }
      
      image(glowGraphics, 0, 0); // Draw the glow graphics

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
