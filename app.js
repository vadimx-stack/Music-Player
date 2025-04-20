document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressHandle = document.querySelector('.progress-bar-handle');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackTitle = document.querySelector('.track-info h2');
    const trackArtist = document.querySelector('.track-info p');
    const albumCover = document.querySelector('.album-cover img');
    const volumeBtn = document.getElementById('volume');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-slider-fill');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
    const playlistItems = document.querySelector('.playlist-items');
    const waveAnimation = document.querySelector('.wave');
    const nowPlayingText = document.querySelector('.now-playing-text');
    
    const state = {
        isPlaying: false,
        currentTrackIndex: 0,
        volume: 1,
        isMuted: false,
        prevVolume: 1,
        shuffle: false,
        repeat: false,
        playlist: [
            {
                title: 'Летний дождь',
                artist: 'Алексей Чумаков',
                cover: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
            },
            {
                title: 'Тишина',
                artist: 'Марина Смирнова',
                cover: 'https://images.unsplash.com/photo-1541704328070-20bf4601ae3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                src: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946293aa4d.mp3?filename=lo-fi-chill-hip-hop-beat-9495.mp3'
            },
            {
                title: 'Вечерний блюз',
                artist: 'Сергей Дроздов',
                cover: 'https://images.unsplash.com/photo-1549834125-80f9e8a94f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0fd5496f7.mp3?filename=lofi-chill-medium-version-159456.mp3'
            },
            {
                title: 'Рассвет',
                artist: 'Анна Соколова',
                cover: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                src: 'https://cdn.pixabay.com/download/audio/2022/08/23/audio_0f1a579f8a.mp3?filename=chill-lofi-melody-115453.mp3'
            }
        ]
    };

    function initPlayer() {
        renderPlaylist();
        loadTrack(state.currentTrackIndex);
        
        if (state.playlist.length > 0) {
            document.querySelector('.playlist-empty').style.display = 'none';
        } else {
            document.querySelector('.playlist-empty').style.display = 'flex';
        }
    }

    function loadTrack(index) {
        if (state.playlist.length === 0) return;
        
        const track = state.playlist[index];
        audioElement.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        albumCover.src = track.cover;
        
        currentTimeEl.textContent = '0:00';
        
        const playlistElements = document.querySelectorAll('.playlist-item');
        playlistElements.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        audioElement.load();
        
        state.currentTrackIndex = index;
    }

    function renderPlaylist() {
        playlistItems.innerHTML = '';
        
        state.playlist.forEach((track, index) => {
            const item = document.createElement('li');
            item.classList.add('playlist-item');
            if (index === state.currentTrackIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            `;
            
            item.addEventListener('click', () => {
                if (index === state.currentTrackIndex) {
                    togglePlay();
                } else {
                    loadTrack(index);
                    playTrack();
                }
            });
            
            playlistItems.appendChild(item);
        });
    }

    function playTrack() {
        audioElement.play()
            .then(() => {
                state.isPlaying = true;
                updatePlayButton();
                waveAnimation.classList.add('playing');
                nowPlayingText.textContent = 'Сейчас играет';
            })
            .catch(error => {
                console.error('Ошибка воспроизведения:', error);
            });
    }

    function pauseTrack() {
        audioElement.pause();
        state.isPlaying = false;
        updatePlayButton();
        waveAnimation.classList.remove('playing');
        nowPlayingText.textContent = 'На паузе';
    }

    function togglePlay() {
        if (state.isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function nextTrack() {
        let nextIndex;
        
        if (state.shuffle) {
            do {
                nextIndex = Math.floor(Math.random() * state.playlist.length);
            } while (nextIndex === state.currentTrackIndex && state.playlist.length > 1);
        } else {
            nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
        }
        
        loadTrack(nextIndex);
        playTrack();
    }

    function prevTrack() {
        let prevIndex;
        
        if (state.shuffle) {
            do {
                prevIndex = Math.floor(Math.random() * state.playlist.length);
            } while (prevIndex === state.currentTrackIndex && state.playlist.length > 1);
        } else {
            prevIndex = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
        }
        
        loadTrack(prevIndex);
        playTrack();
    }

    function updatePlayButton() {
        if (state.isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateVolume(value) {
        state.volume = value;
        audioElement.volume = value;
        
        volumeFill.style.width = `${value * 100}%`;
        
        if (value === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            state.isMuted = true;
        } else if (value < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            state.isMuted = false;
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            state.isMuted = false;
        }
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        shuffleBtn.classList.toggle('active', state.shuffle);
    }

    function toggleRepeat() {
        state.repeat = !state.repeat;
        repeatBtn.classList.toggle('active', state.repeat);
    }

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    
    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickPosition = e.offsetX;
        const clickPercentage = clickPosition / progressWidth;
        const duration = audioElement.duration;
        
        audioElement.currentTime = duration * clickPercentage;
    });
    
    volumeSlider.addEventListener('click', (e) => {
        const sliderWidth = volumeSlider.clientWidth;
        const clickPosition = e.offsetX;
        const clickPercentage = clickPosition / sliderWidth;
        
        updateVolume(clickPercentage);
    });
    
    volumeBtn.addEventListener('click', () => {
        if (state.isMuted) {
            updateVolume(state.prevVolume || 1);
        } else {
            state.prevVolume = state.volume;
            updateVolume(0);
        }
    });
    
    shuffleBtn.addEventListener('click', toggleShuffle);
    
    repeatBtn.addEventListener('click', toggleRepeat);
    
    audioElement.addEventListener('timeupdate', () => {
        const duration = audioElement.duration;
        const currentTime = audioElement.currentTime;
        
        if (isNaN(duration)) return;
        
        const progressPercent = (currentTime / duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressHandle.style.left = `${progressPercent}%`;
        
        currentTimeEl.textContent = formatTime(currentTime);
    });
    
    audioElement.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioElement.duration);
    });
    
    audioElement.addEventListener('ended', () => {
        if (state.repeat) {
            audioElement.currentTime = 0;
            playTrack();
        } else {
            nextTrack();
        }
    });
    
    initPlayer();
}); 