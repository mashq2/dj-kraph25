// Mix Manager - Handle uploads, storage, and Firebase
const STORAGE_KEY = 'djkraph_mixes';

class MixManager {
    constructor() {
        this.mixes = this.loadMixes();
        this.initEventListeners();
        this.displayMixes();
    }

    initEventListeners() {
        const form = document.getElementById('uploadForm');
        const fileInput = document.getElementById('audioFile');
        const fileLabel = document.getElementById('fileLabel');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // File drag and drop
        if (fileLabel) {
            fileLabel.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileLabel.classList.add('drag-over');
            });

            fileLabel.addEventListener('dragleave', () => {
                fileLabel.classList.remove('drag-over');
            });

            fileLabel.addEventListener('drop', (e) => {
                e.preventDefault();
                fileLabel.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    this.updateFileName(files[0]);
                }
            });
        }

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.updateFileName(e.target.files[0]);
                }
            });
        }
    }

    updateFileName(file) {
        const fileNameEl = document.getElementById('fileName');
        if (fileNameEl) {
            fileNameEl.textContent = `✓ ${file.name} (${this.formatFileSize(file.size)})`;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    handleSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('mixTitle').value;
        const artist = document.getElementById('artistName').value;
        const image = document.getElementById('artistImage').value;
        const price = parseInt(document.getElementById('mixPrice').value);
        const description = document.getElementById('mixDescription').value;
        const genre = document.getElementById('mixGenre')?.value || 'Mixed';
        const bpm = parseInt(document.getElementById('mixBPM')?.value || 120);
        const duration = document.getElementById('mixDuration')?.value || '0:00';
        const trackList = document.getElementById('mixTracks')?.value?.split('\n').filter(t => t.trim()) || [];
        const audioUrl = document.getElementById('audioUrl')?.value || '';
        const fileInput = document.getElementById('audioFile');

        // Validate that either URL or file is provided
        if (!audioUrl && (!fileInput || !fileInput.files[0])) {
            this.showMessage('Please provide an audio URL or select a file', 'error');
            return;
        }

        // If URL is provided, use it directly (no file storage needed)
        if (audioUrl) {
            const mix = {
                id: Date.now(),
                title,
                artist,
                image,
                price,
                description,
                genre,
                bpm,
                duration,
                trackList,
                audioUrl: audioUrl,
                fileName: audioUrl.split('/').pop() || 'audio.mp3',
                fileType: 'audio/mpeg',
                dateAdded: new Date().toLocaleDateString(),
                averageRating: 0,
                reviewCount: 0
            };

            this.mixes.push(mix);
            this.saveMixes();
            this.displayMixes();
            document.getElementById('uploadForm').reset();
            this.showMessage(`✅ Mix "${title}" uploaded successfully!`, 'success');
            return;
        }

        // If file is uploaded, create a local URL reference (not storing full data)
        const file = fileInput.files[0];
        const mix = {
            id: Date.now(),
            title,
            artist,
            image,
            price,
            description,
            genre,
            bpm,
            duration,
            trackList,
            audioUrl: '', // Will be populated when uploaded to cloud storage
            fileName: file.name,
            fileType: file.type,
            fileSize: this.formatFileSize(file.size),
            dateAdded: new Date().toLocaleDateString(),
            averageRating: 0,
            reviewCount: 0,
            uploadPending: true // Flag to indicate file needs to be uploaded to cloud
        };

        this.mixes.push(mix);
        this.saveMixes();
        this.displayMixes();
        document.getElementById('uploadForm').reset();
        document.getElementById('fileName').textContent = '';
        this.showMessage(`✅ Mix "${title}" added! Note: Upload audio file to cloud storage and update with URL.`, 'success');
    }

    deleteMix(id) {
        if (confirm('Are you sure you want to delete this mix?')) {
            this.mixes = this.mixes.filter(mix => mix.id !== id);
            this.saveMixes();
            this.displayMixes();
            this.showMessage('Mix deleted successfully', 'success');
        }
    }

    editMix(id) {
        const mix = this.mixes.find(m => m.id === id);
        if (!mix) return;

        const audioUrl = prompt('Enter Audio URL (leave empty to keep current):', mix.audioUrl || '');
        if (audioUrl !== null) {
            mix.audioUrl = audioUrl || mix.audioUrl;
            mix.uploadPending = !audioUrl;
            this.saveMixes();
            this.displayMixes();
            this.showMessage(`Mix "${mix.title}" updated successfully!`, 'success');
        }
    }

    saveMixes() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mixes));
        // Also sync to Firebase if available
        if (typeof syncToFirebase === 'function') {
            syncToFirebase(this.mixes);
        }
    }

    loadMixes() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    displayMixes() {
        const mixesList = document.getElementById('mixesList');
        if (!mixesList) return;

        if (this.mixes.length === 0) {
            mixesList.innerHTML = '<div class="empty-message">No mixes uploaded yet. Create your first mix above!</div>';
            return;
        }

        // Update total count
        const totalCount = document.getElementById('totalMixes');
        if (totalCount) {
            totalCount.textContent = this.mixes.length;
        }

        mixesList.innerHTML = this.mixes.map(mix => `
            <div class="mix-item">
                <div class="mix-info">
                    <h3>${mix.title}</h3>
                    <p><strong>Artist:</strong> ${mix.artist}</p>
                    <p><strong>Genre:</strong> ${mix.genre || 'Mixed'}</p>
                    <p><strong>Price:</strong> KSh ${mix.price}</p>
                    <p><strong>Added:</strong> ${mix.dateAdded}</p>
                    ${mix.audioUrl ? `<p><strong>Status:</strong> <span style="color: #22B14C;">✓ Ready</span></p>` : `<p><strong>Status:</strong> <span style="color: #ff6b6b;">⚠ Needs Audio URL</span></p>`}
                </div>
                <div class="mix-actions">
                    <button class="btn-edit" onclick="mixManager.editMix(${mix.id})">Edit</button>
                    <button class="btn-delete" onclick="mixManager.deleteMix(${mix.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            setTimeout(() => {
                messageEl.className = 'message';
            }, 4000);
        }
    }
}

// Initialize Mix Manager
let mixManager;
document.addEventListener('DOMContentLoaded', () => {
    mixManager = new MixManager();
});

// Export mixes for use in index.html
function getUploadsedMixes() {
    return new MixManager().loadMixes();
}
