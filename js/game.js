// Get the necessary elements from the DOM
const targetImage = document.getElementById('target-image');
const artifactImage = document.getElementById('artifact-image');
const splashImage = document.getElementById('splash-image');
const scoreDisplay = document.getElementById('score');

let score = 0;
let artifactPosition = { x: 0, y: 0 };
const artifactSpeed = 10; // Adjust the speed as needed
let isMovingWithMouse = false;
let isSplashVisible = false;

// Function to generate a random position for the target image
function generateRandomPosition() {
  const targetWidth = targetImage.clientWidth;
  const targetHeight = targetImage.clientHeight;
  const maxWidth = window.innerWidth - targetWidth;
  const maxHeight = window.innerHeight - targetHeight;
  const randomX = Math.floor(Math.random() * maxWidth);
  const randomY = Math.floor(Math.random() * maxHeight);
  return { x: randomX, y: randomY };
}

// Function to update the position of the target image
function updateTargetPosition() {
  const randomPosition = generateRandomPosition();
  targetImage.style.left = `${randomPosition.x}px`;
  targetImage.style.top = `${randomPosition.y}px`;
}

// Function to handle the user's artifact movement with arrow keys
function moveArtifactWithArrowKeys(x, y) {
  const artifactRect = artifactImage.getBoundingClientRect();
  const artifactWidth = artifactRect.width;
  const artifactHeight = artifactRect.height;
  const maxWidth = window.innerWidth - artifactWidth;
  const maxHeight = window.innerHeight - artifactHeight;

  // Calculate the new position
  const newPosition = {
    x: artifactPosition.x + x,
    y: artifactPosition.y + y
  };

  // Make sure the artifact stays within the boundaries
  const clampedPosition = {
    x: Math.max(0, Math.min(newPosition.x, maxWidth)),
    y: Math.max(0, Math.min(newPosition.y, maxHeight))
  };

  // Update the artifact position and style
  artifactPosition = clampedPosition;
  artifactImage.style.left = `${clampedPosition.x}px`;
  artifactImage.style.top = `${clampedPosition.y}px`;

  // Check if the artifact intersects with the target
  const artifactRectTopLeft = {
    x: clampedPosition.x + 50,
    y: clampedPosition.y + 10
  };
  const artifactRectBottomRight = {
    x: clampedPosition.x + 150,
    y: clampedPosition.y + 50
  };

  const targetRect = targetImage.getBoundingClientRect();
  const targetRectTopLeft = { x: targetRect.left, y: targetRect.top };
  const targetRectBottomRight = { x: targetRect.right, y: targetRect.bottom };

  if (
    artifactRectTopLeft.x <= targetRectBottomRight.x &&
    artifactRectBottomRight.x >= targetRectTopLeft.x &&
    artifactRectTopLeft.y <= targetRectBottomRight.y &&
    artifactRectBottomRight.y >= targetRectTopLeft.y
  ) {
    // Artifact intersects with the target
    if (!isSplashVisible) {
      showSplash();
    }
  } else {
    hideSplash();
  }
}

// Function to handle the user's artifact movement with the mouse
function moveArtifactWithMouse(event) {
  if (!isMovingWithMouse) return;

  const x = event.clientX - artifactImage.clientWidth / 2;
  const y = event.clientY - artifactImage.clientHeight / 2;

  moveArtifactWithArrowKeys(x - artifactPosition.x, y - artifactPosition.y);
}

// Function to show the splash image
function showSplash() {
  splashImage.style.left = `${artifactPosition.x}px`;
  splashImage.style.top = `${artifactPosition.y}px`;
  splashImage.style.display = 'block';
  isSplashVisible = true;

  // Increase the score
  score++;
  scoreDisplay.textContent = score;

  // Change the target image to target-image1.jpg for 2 seconds
  targetImage.src = 'img/target-image1.jpg';

  // Hide the splash image and restore the target image after 2 seconds
  setTimeout(() => {
    hideSplash();
    targetImage.src = 'img/target.jpg';
  }, 2000);
}

// Function to hide the splash image
function hideSplash() {
  splashImage.style.display = 'none';
  isSplashVisible = false;
}

// Function to handle the keydown event
function handleKeyDown(event) {
  const key = event.key.toLowerCase();

  switch (key) {
    case 'arrowup':
      moveArtifactWithArrowKeys(0, -artifactSpeed);
      break;
    case 'arrowdown':
      moveArtifactWithArrowKeys(0, artifactSpeed);
      break;
    case 'arrowleft':
      moveArtifactWithArrowKeys(-artifactSpeed, 0);
      break;
    case 'arrowright':
      moveArtifactWithArrowKeys(artifactSpeed, 0);
      break;
  }
}

// Function to handle the mousedown event
function handleMouseDown(event) {
  if (event.target === artifactImage) {
    isMovingWithMouse = true;
  }
}

// Function to handle the mouseup event
function handleMouseUp() {
  isMovingWithMouse = false;
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', moveArtifactWithMouse);

// Update the target position initially
updateTargetPosition();

// Update the target position every 5 seconds
setInterval(updateTargetPosition, 5000);

// Change the target image every 3 seconds
setInterval(() => {
  const randomImageIndex = Math.floor(Math.random() * 2) + 1;
  targetImage.src = `img/target2-image1.jpg`;
}, 3000);

