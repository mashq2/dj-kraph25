let audio = document.getElementById("audioPlayer");
let video = document.getElementById("videoPlayer");
let title = document.getElementById("nowPlaying");

// Store current track list for previous/next functionality
let trackList = [];
let currentTrackIndex = 0;

function stopAll() {
  audio.pause();
  video.pause();
  audio.style.display = "none";
  video.style.display = "none";
}

// Store track info and redirect to payment page
function goToPayment(src, name, amount) {
  // Store track info for after payment
  sessionStorage.setItem('lastTrackSrc', src);
  sessionStorage.setItem('lastTrackName', name);
  
  // Determine type from file extension
  const type = src.includes('.mp3') ? 'audio' : 'video';
  
  // Create URL with payment parameters
  const params = new URLSearchParams({
    track: name,
    price: amount,
    type: type,
    src: src
  });
  
  // Redirect to payment page
  window.location.href = 'pay.html?' + params.toString();
}

// Legacy function for backward compatibility
function payToUnlock(type, src, name, amount){
  goToPayment(src, name, amount);
}

// Player control functions
function playTrack() {
  if (audio.style.display === "block") {
    audio.play();
  } else if (video.style.display === "block") {
    video.play();
  }
  updatePlayPauseButton();
}

function pauseTrack() {
  if (audio.style.display === "block") {
    audio.pause();
  } else if (video.style.display === "block") {
    video.pause();
  }
  updatePlayPauseButton();
}

function previousTrack() {
  if (trackList.length === 0) return;
  currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
  const prevTrack = trackList[currentTrackIndex];
  loadAndPlayTrack(prevTrack.src, prevTrack.name);
}

function nextTrack() {
  if (trackList.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  const nextTrack = trackList[currentTrackIndex];
  loadAndPlayTrack(nextTrack.src, nextTrack.name);
}

function loadAndPlayTrack(src, name) {
  stopAll();
  const isAudio = src.includes('.mp3');
  if (isAudio) {
    audio.src = src;
    audio.style.display = "block";
    audio.play();
  } else {
    video.src = src;
    video.style.display = "block";
    video.play();
  }
  title.innerText = "Now Playing: " + name;
  updatePlayPauseButton();
}

function updatePlayPauseButton() {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  
  const isPlaying = (audio.style.display === "block" && !audio.paused) || 
                    (video.style.display === "block" && !video.paused);
  
  if (isPlaying) {
    playBtn.style.opacity = '0.5';
    pauseBtn.style.opacity = '1';
  } else {
    playBtn.style.opacity = '1';
    pauseBtn.style.opacity = '0.5';
  }
}

// Add event listeners to control buttons
document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (playBtn) playBtn.addEventListener('click', playTrack);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTrack);
  if (prevBtn) prevBtn.addEventListener('click', previousTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  
  // Collect all available tracks from the page
  document.querySelectorAll('[data-track]').forEach((element, index) => {
    trackList.push({
      src: element.getAttribute('data-src'),
      name: element.getAttribute('data-track')
    });
  });
  
  updatePlayPauseButton();
});

// Check if returning from successful payment
function checkPaymentStatus() {
  const hash = window.location.hash;
  const audio = document.getElementById("audioPlayer");
  const video = document.getElementById("videoPlayer");

  if (hash === "#audio_unlocked" || hash === "#video_unlocked") {
    // Payment was successful, play the content
    const savedSrc = sessionStorage.getItem('lastTrackSrc');
    const savedName = sessionStorage.getItem('lastTrackName');
    
    if (savedSrc && savedName) {
      if (hash === "#audio_unlocked") {
        stopAll();
        audio.src = savedSrc;
        audio.style.display = "block";
        audio.play();
        document.getElementById("nowPlaying").innerText = "Now Playing: " + savedName;
      } else if (hash === "#video_unlocked") {
        stopAll();
        video.src = savedSrc;
        video.style.display = "block";
        video.play();
        document.getElementById("nowPlaying").innerText = "Now Playing: " + savedName;
      }
      
      // Clear stored data
      sessionStorage.removeItem('lastTrackSrc');
      sessionStorage.removeItem('lastTrackName');
      
      // Clear hash
      window.history.replaceState("", document.title, window.location.pathname);
      updatePlayPauseButton();
    }
  }
}

// Run check on page load
window.addEventListener('load', checkPaymentStatus);

