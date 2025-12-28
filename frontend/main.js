// Frontend JavaScript for LifeSpace

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const welcomeLoginBtn = document.getElementById('welcome-login-btn');
    const welcomeSignupBtn = document.getElementById('welcome-signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const uploadSongModal = document.getElementById('upload-song-modal');
    const closeButtons = document.querySelectorAll('.close');
    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const renamePlaylistModal = document.getElementById('rename-playlist-modal');
    const sleepTimerModal = document.getElementById('sleep-timer-modal');
    const lyricsModal = document.getElementById('lyrics-modal');
    const eqModal = document.getElementById('eq-modal');
    const pitchModal = document.getElementById('pitch-modal');
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const reportSongModal = document.getElementById('report-song-modal');
    const reviewModal = document.getElementById('review-modal');
    const reportUserModal = document.getElementById('report-user-modal');
    const whatsNewModal = document.getElementById('whats-new-modal');
    const deleteAccountModal = document.getElementById('delete-account-modal');

    if (welcomeLoginBtn) {
        welcomeLoginBtn.onclick = () => loginModal.style.display = 'block';
    }
    if (welcomeSignupBtn) {
        welcomeSignupBtn.onclick = () => signupModal.style.display = 'block';
    }

    const uploadSongBtn = document.getElementById('upload-song-btn');
    if(uploadSongBtn) {
        uploadSongBtn.onclick = () => uploadSongModal.style.display = 'block';
    }  

    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    if(createPlaylistBtn) {
        createPlaylistBtn.onclick = () => createPlaylistModal.style.display = 'block';
    }

    closeButtons.forEach(btn => {
        btn.onclick = () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            uploadSongModal.style.display = 'none';
            createPlaylistModal.style.display = 'none';
            if(renamePlaylistModal) renamePlaylistModal.style.display = 'none';
            if(sleepTimerModal) sleepTimerModal.style.display = 'none';
            if(lyricsModal) lyricsModal.style.display = 'none';
            if(eqModal) eqModal.style.display = 'none';
            if(pitchModal) pitchModal.style.display = 'none';
            if(addToPlaylistModal) addToPlaylistModal.style.display = 'none';
            if(reportSongModal) reportSongModal.style.display = 'none';
            if(reviewModal) reviewModal.style.display = 'none';
            if(whatsNewModal) whatsNewModal.style.display = 'none';
            if(reportUserModal) reportUserModal.style.display = 'none';
            if(deleteAccountModal) deleteAccountModal.style.display = 'none';
        }
    });

    window.onclick = (event) => {
        if (event.target == loginModal || event.target == signupModal || event.target == uploadSongModal || event.target == createPlaylistModal || event.target == renamePlaylistModal || event.target == sleepTimerModal || event.target == lyricsModal || event.target == eqModal || event.target == pitchModal || event.target == addToPlaylistModal || event.target == reportSongModal || event.target == reviewModal || event.target == whatsNewModal || event.target == reportUserModal || event.target == deleteAccountModal) {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            uploadSongModal.style.display = 'none';
            createPlaylistModal.style.display = 'none';
            if (renamePlaylistModal) renamePlaylistModal.style.display = 'none';
            if (sleepTimerModal) sleepTimerModal.style.display = 'none';
            if (lyricsModal) lyricsModal.style.display = 'none';
            if (eqModal) eqModal.style.display = 'none';
            if (pitchModal) pitchModal.style.display = 'none';
            if (addToPlaylistModal) addToPlaylistModal.style.display = 'none';
            if (reportSongModal) reportSongModal.style.display = 'none';
            if (reviewModal) reviewModal.style.display = 'none';
            if(whatsNewModal) whatsNewModal.style.display = 'none';
            if(reportUserModal) reportUserModal.style.display = 'none';
            if(deleteAccountModal) deleteAccountModal.style.display = 'none';
        }
    }

    // Password Visibility Toggle
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            icon.classList.toggle('ph-eye');
            icon.classList.toggle('ph-eye-slash');
        });
    });

    const BACKEND_URL = 'http://localhost:5000';

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const { token, user } = await response.json();
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('userRole', user.role);
                    await fetchCurrentUser();
                    alert('Login successful!');
                    loginModal.style.display = 'none';
                    updateUIAfterLogin();
                    showDashboard();
                } else {
                    const errorData = await response.json();
                    alert(errorData.msg || 'Login failed!');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login.');
            }
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const { token, user } = await response.json();
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('userRole', user.role);
                    alert('Signup successful!');
                    signupModal.style.display = 'none';
                    updateUIAfterLogin();
                    showDashboard();
                } else {
                    const errorData = await response.json();
                    alert(errorData.msg || 'Signup failed!');
                }
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during signup.');
            }
        });
    }

    const uploadSongForm = document.getElementById('upload-song-form');
    if(uploadSongForm) {
        uploadSongForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to upload a song.');
                return;
            }

            const xhr = new XMLHttpRequest();
            const cancelBtn = document.getElementById('cancel-upload-btn');
            xhr.open('POST', `${BACKEND_URL}/api/songs/upload`, true);
            xhr.setRequestHeader('x-auth-token', token);

            // Progress event
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    const progressBar = document.getElementById('upload-progress-bar');
                    const progressContainer = document.getElementById('upload-progress-container');
                    const spinner = document.getElementById('upload-spinner');
                    
                    if (progressContainer) progressContainer.style.display = 'block';
                    if (progressBar) progressBar.style.width = percentComplete + '%';

                    // If upload to server is done, show processing spinner
                    if (percentComplete === 100 && spinner) {
                        spinner.style.display = 'block';
                    }
                }
            };
            
            // Show Cancel Button
            if (cancelBtn) {
                cancelBtn.style.display = 'block';
                cancelBtn.onclick = () => {
                    xhr.abort();
                    cancelBtn.style.display = 'none';
                    const progressContainer = document.getElementById('upload-progress-container');
                    const spinner = document.getElementById('upload-spinner');
                    if (progressContainer) progressContainer.style.display = 'none';
                    if (spinner) spinner.style.display = 'none';
                    alert('Upload cancelled.');
                };
            }

            xhr.onload = function() {
                if (cancelBtn) cancelBtn.style.display = 'none';
                const spinner = document.getElementById('upload-spinner');
                if (spinner) spinner.style.display = 'none';

                if (xhr.status === 200) {
                    alert('Song uploaded successfully!');
                    uploadSongModal.style.display = 'none';
                    
                    // Reset progress bar
                    const progressBar = document.getElementById('upload-progress-bar');
                    const progressContainer = document.getElementById('upload-progress-container');
                    if (progressBar) progressBar.style.width = '0%';
                    if (progressContainer) progressContainer.style.display = 'none';

                    fetchAndDisplaySongs(); // Refresh song list
                } else {
                    let msg = 'Song upload failed!';
                    try {
                        const res = JSON.parse(xhr.responseText);
                        if (res.msg) msg = res.msg;
                    } catch(e) {}
                    alert(msg);
                }
            };

            xhr.onerror = function() {
                if (cancelBtn) cancelBtn.style.display = 'none';
                const spinner = document.getElementById('upload-spinner');
                if (spinner) spinner.style.display = 'none';
                console.error('Upload error');
                alert('An error occurred during song upload.');
            };

            xhr.send(formData);
        });
    }

    const createPlaylistForm = document.getElementById('create-playlist-form');
    if(createPlaylistForm) {
        createPlaylistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to create a playlist.');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/playlists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Playlist created successfully!');
                    createPlaylistModal.style.display = 'none';
                    fetchAndDisplayPlaylists(); // Refresh playlists
                } else {
                    // Read the actual error message from the server
                    const errorData = await response.json();
                    alert(errorData.msg || 'Playlist creation failed!');
                }
            } catch (error) {
                console.error('Create playlist error:', error);
                alert('An error occurred during playlist creation.');
            }
        });
    }

    const renamePlaylistForm = document.getElementById('rename-playlist-form');
    if(renamePlaylistForm) {
        renamePlaylistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('rename-playlist-id').value;
            const name = document.getElementById('rename-playlist-name').value;
            const token = localStorage.getItem('token');

            if (!token || !id) return;

            try {
                const response = await fetch(`${BACKEND_URL}/api/playlists/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ name }),
                });

                if (response.ok) {
                    alert('Playlist renamed successfully!');
                    renamePlaylistModal.style.display = 'none';
                    fetchAndDisplayPlaylists();
                } else {
                    alert('Failed to rename playlist');
                }
            } catch (error) {
                console.error('Rename playlist error:', error);
            }
        });
    }

    function updateUIAfterLogin() {
        const username = localStorage.getItem('username');
        if (username) {
            // Show logout button
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.style.display = 'block';
            // Show username, perhaps in the hero section or somewhere
            const heroSection = document.querySelector('.hero-section h2');
            if (heroSection) {
                // Update welcome message if element exists
                const welcomeMsg = document.getElementById('welcome-msg');
                if(welcomeMsg) welcomeMsg.textContent = `Welcome back, ${username}`;
                else heroSection.textContent = `Welcome back, ${username}`;
            }

            // Role Based UI
            const role = localStorage.getItem('userRole');
            const roleButtonsContainer = document.getElementById('role-buttons-container');
            if (roleButtonsContainer) {
                if (role === 'owner' || role === 'admin' || role === 'developer') {
                    roleButtonsContainer.style.display = 'flex';
                } else {
                    roleButtonsContainer.style.display = 'none';
                }
            }
        }
    }

    function resetUIAfterLogout() {
        // Hide logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.style.display = 'none';
        // Reset hero section
        const heroSection = document.querySelector('.hero-section h2');
        const roleButtonsContainer = document.getElementById('role-buttons-container');
        if (roleButtonsContainer) roleButtonsContainer.style.display = 'none';
        if (heroSection && document.getElementById('welcome-msg')) {
            heroSection.textContent = 'Welcome back, Varun'; // Or default
        }
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            resetUIAfterLogout();
            showWelcome();
            alert('Logged out successfully!');
        });
    }

    function showDashboard() {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
    }

    function showWelcome() {
        document.getElementById('welcome-page').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }

    // Check if already logged in on page load
    (async () => {
        if (localStorage.getItem('token')) {
            await fetchCurrentUser();
            updateUIAfterLogin();
            showDashboard();
            // Check for shared playlist link
            const urlParams = new URLSearchParams(window.location.search);
            const sharedPlaylistId = urlParams.get('playlist');
            if (sharedPlaylistId) {
                loadSharedPlaylist(sharedPlaylistId);
            }
            // Check for shared song link
            const sharedSongId = urlParams.get('song');
            if (sharedSongId) {
                loadSharedSong(sharedSongId);
            }
        } else {
            showWelcome();
        }
    })();

    // --- WHAT'S NEW POPUP ---
    const currentVersion = '1.2.0'; // Increment this to show popup again
    const lastSeenVersion = localStorage.getItem('whatsNewVersion');
    
    if (lastSeenVersion !== currentVersion && whatsNewModal) {
        whatsNewModal.style.display = 'block';
        const closeWhatsNewBtn = document.getElementById('close-whats-new-btn');
        if (closeWhatsNewBtn) {
            closeWhatsNewBtn.onclick = () => {
                whatsNewModal.style.display = 'none';
                localStorage.setItem('whatsNewVersion', currentVersion);
            };
        }
    }

    // --- THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggleBtn.innerHTML = newTheme === 'light' ? '<i class="ph ph-sun"></i> Theme' : '<i class="ph ph-moon"></i> Theme';
        };
    }

    // --- NAVIGATION & VIEWS ---
    const navHome = document.getElementById('nav-home');
    const navSearch = document.getElementById('nav-search');
    const navFeed = document.getElementById('nav-feed');
    const navLibrary = document.getElementById('nav-library');
    const navHistory = document.getElementById('nav-history');
    const navStats = document.getElementById('nav-stats');
    const navReviews = document.getElementById('nav-reviews');
    const navAdmin = document.getElementById('nav-admin');
    const navDeveloper = document.getElementById('nav-developer');
    const profileBtn = document.getElementById('profile-btn');
    
    const homeView = document.getElementById('home-view');
    const searchView = document.getElementById('search-view');
    const feedView = document.getElementById('feed-view');
    const profileView = document.getElementById('profile-view');
    const libraryView = document.getElementById('library-view');
    const historyView = document.getElementById('history-view');
    const statsView = document.getElementById('stats-view');
    const reviewsView = document.getElementById('reviews-view');
    const artistView = document.getElementById('artist-view');
    const adminView = document.getElementById('admin-view');
    const developerView = document.getElementById('developer-view');

    function switchView(viewName) {
        if(homeView) homeView.style.display = 'none';
        if(searchView) searchView.style.display = 'none';
        if(feedView) feedView.style.display = 'none';
        if(profileView) profileView.style.display = 'none';
        if(libraryView) libraryView.style.display = 'none';
        if(historyView) historyView.style.display = 'none';
        if(statsView) statsView.style.display = 'none';
        if(reviewsView) reviewsView.style.display = 'none';
        if(artistView) artistView.style.display = 'none';
        if(adminView) adminView.style.display = 'none';
        if(developerView) developerView.style.display = 'none';
        
        if(navHome) navHome.classList.remove('active');
        if(navSearch) navSearch.classList.remove('active');
        if(navFeed) navFeed.classList.remove('active');
        if(navLibrary) navLibrary.classList.remove('active');
        if(navHistory) navHistory.classList.remove('active');
        if(navStats) navStats.classList.remove('active');
        if(navReviews) navReviews.classList.remove('active');

        if (viewName === 'home') {
            if(homeView) homeView.style.display = 'block';
            if(navHome) navHome.classList.add('active');
        } else if (viewName === 'search') {
            if(searchView) searchView.style.display = 'block';
            if(navSearch) navSearch.classList.add('active');
            // Trigger search if input has value
            const searchInput = document.getElementById('search-input');
            if(searchInput && searchInput.value) searchInput.dispatchEvent(new Event('input'));
            
            // Show history if input is empty
            if (searchInput && !searchInput.value) {
                renderSearchHistory();
                document.getElementById('search-history-container').style.display = 'block';
            }
        } else if (viewName === 'feed') {
            if(feedView) feedView.style.display = 'block';
            if(navFeed) navFeed.classList.add('active');
            fetchFeed();
        } else if (viewName === 'profile') {
            if(profileView) profileView.style.display = 'block';
            renderProfile();
        } else if (viewName === 'library') {
            if(libraryView) libraryView.style.display = 'block';
            if(navLibrary) navLibrary.classList.add('active');
            renderQueue(); // Render queue in library
        } else if (viewName === 'history') {
            if(historyView) historyView.style.display = 'block';
            if(navHistory) navHistory.classList.add('active');
            fetchRecentlyPlayed(true); // Fetch and render to history view
        } else if (viewName === 'stats') {
            if(statsView) statsView.style.display = 'block';
            if(navStats) navStats.classList.add('active');
            fetchStats();
        } else if (viewName === 'reviews') {
            if(reviewsView) reviewsView.style.display = 'block';
            if(navReviews) navReviews.classList.add('active');
            fetchReviews();
        } else if (viewName === 'artist') {
            if(artistView) artistView.style.display = 'block';
        } else if (viewName === 'admin') {
            if(adminView) adminView.style.display = 'block';
        } else if (viewName === 'developer') {
            if(developerView) developerView.style.display = 'block';
        }
    }

    if(navHome) navHome.onclick = () => switchView('home');
    if(navSearch) navSearch.onclick = () => switchView('search');
    if(navFeed) navFeed.onclick = () => switchView('feed');
    if(navLibrary) navLibrary.onclick = () => switchView('library');
    if(navHistory) navHistory.onclick = () => switchView('history');
    if(navStats) navStats.onclick = () => switchView('stats');
    if(navReviews) navReviews.onclick = () => switchView('reviews');
    if(profileAdminBtn) profileAdminBtn.onclick = (e) => {
        e.preventDefault(); // Prevent any default form submission
        switchView('admin');
    };
    if(profileDevBtn) profileDevBtn.onclick = (e) => {
        e.preventDefault();
        switchView('developer');
    };
    if(profileBtn) profileBtn.onclick = () => switchView('profile');

    const moreNavBtn = document.getElementById('more-nav-btn');
    const moreNavList = document.getElementById('more-nav-list');
    if (moreNavBtn && moreNavList) {
        moreNavBtn.onclick = () => {
            const isHidden = moreNavList.style.display === 'none';
            moreNavList.style.display = isHidden ? 'block' : 'none';
            moreNavBtn.querySelector('i').className = isHidden ? 'ph-fill ph-caret-up' : 'ph-fill ph-caret-down';
        };
    }

    // --- LIBRARY TABS ---
    const tabQueue = document.getElementById('tab-queue');
    const tabFavorites = document.getElementById('tab-favorites');
    const libQueueContainer = document.getElementById('library-queue-container');
    const libFavContainer = document.getElementById('library-favorites-container');

    if(tabQueue && tabFavorites) {
        tabQueue.onclick = () => {
            tabQueue.classList.add('active');
            tabFavorites.classList.remove('active');
            libQueueContainer.style.display = 'block';
            libFavContainer.style.display = 'none';
        };
        tabFavorites.onclick = () => {
            tabFavorites.classList.add('active');
            tabQueue.classList.remove('active');
            libQueueContainer.style.display = 'none';
            libFavContainer.style.display = 'block';
            renderFavorites();
        };
    }

    // --- NOTIFICATION UI ---
    const notificationBtn = document.getElementById('notification-btn');
    const notificationMenu = document.getElementById('notification-menu');
    if (notificationBtn && notificationMenu) {
        notificationBtn.onclick = (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            
            // Mark as read when opening
            if (notificationMenu.classList.contains('show')) {
                const token = localStorage.getItem('token');
                if (token) {
                    fetch(`${BACKEND_URL}/api/notifications/read`, {
                        method: 'PUT',
                        headers: { 'x-auth-token': token }
                    }).then(() => document.getElementById('notification-dot').style.display = 'none');
                }
            }
        };

        document.addEventListener('click', (e) => {
            if (!notificationMenu.contains(e.target) && e.target !== notificationBtn) {
                notificationMenu.classList.remove('show');
            }
        });
    }

    // --- SHUFFLE PLAY ALL ---
    const libraryShuffleBtn = document.getElementById('library-shuffle-btn');
    if (libraryShuffleBtn) {
        libraryShuffleBtn.onclick = () => {
            if (allSongs.length === 0) return alert('No songs to shuffle');
            
            // Create a shuffled copy
            playbackQueue = [...allSongs].sort(() => Math.random() - 0.5);
            currentSongIndex = 0;
            isShuffle = true; // Enable shuffle mode visually if needed
            
            renderQueue();
            playSong(playbackQueue[0]);
            switchView('library');
        };
    }

    // --- ADMIN LOGIC ---
    const assignRoleForm = document.getElementById('assign-role-form');
    if (assignRoleForm) {
        assignRoleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/role`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token 
                    },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (res.ok) {
                    alert(result.msg);
                    assignRoleForm.reset();
                } else {
                    alert(result.msg || 'Failed to assign role');
                }
            } catch (e) { console.error(e); }
        });
    }

    // --- PROFILE LOGIC ---
    const updateProfileForm = document.getElementById('update-profile-form');
    if(updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem('token');
            
            if(!token) return;

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(data)
                });
                
                if(res.ok) {
                    const data = await res.json();
                    localStorage.setItem('username', data.username);
                    alert('Profile updated!');
                    updateUIAfterLogin();
                    updateProfileForm.reset();
                } else {
                    const err = await res.json();
                    alert(err.msg || 'Update failed');
                }
            } catch(err) { console.error(err); }
        });
    }

    // Delete Account Logic
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-account-btn');

    if (deleteAccountBtn) {
        deleteAccountBtn.onclick = () => {
            if (deleteAccountModal) deleteAccountModal.style.display = 'block';
        };
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    alert('Account deleted.');
                    localStorage.clear();
                    location.reload();
                } else {
                    alert('Failed to delete account.');
                }
            } catch (e) { console.error(e); }
        };
    }

    // --- SONG & PLAYER LOGIC ---

    let currentUser = null;
    let allSongs = [];
    let playbackQueue = [];
    let currentSongIndex = 0;
    let isShuffle = false;
    let likedSongIds = new Set();
    let repeatMode = 'off'; // 'off', 'all', 'one'
    let sleepTimerId = null;
    let fadeOutInterval = null;
    let fadeInInterval = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let bassFilter = null;
    let trebleFilter = null;
    let isPartyMode = false;
    let isKaraokeMode = false;
    let karaokeDryGain = null;
    let karaokeWetGain = null;
    let isSlowedReverb = false;
    let reverbNode = null;
    let reverbDryGain = null;
    let reverbWetGain = null;
    let isFocusMode = false;
    let isPrivateSession = false;
    let isDataSaver = false;
    let sleepTimerInterval = null;
    let crossfadeDuration = 0;

    // Default Shortcuts
    const defaultShortcuts = {
        playPause: ' ',
        next: 'ArrowRight',
        prev: 'ArrowLeft',
        volumeUp: 'ArrowUp',
        volumeDown: 'ArrowDown',
        mute: 'm',
        shuffle: 's',
        repeat: 'r'
    };

    function formatDuration(seconds) {
        if (!seconds) return '';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    async function fetchCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                currentUser = await res.json();
            }
        } catch (e) {
            console.error('Could not fetch user data', e);
            currentUser = null;
        }
    }

    async function loadSharedSong(id) {
        try {
            // We can find it in allSongs if loaded, or fetch specific
            // For simplicity, wait for allSongs or fetch it
            // Assuming allSongs is populated by fetchAndDisplaySongs called at bottom
            // We might need to fetch specifically if pagination existed, but here we fetch all.
            // Let's just wait a bit or rely on the user finding it? Better to fetch.
            // Since fetchAndDisplaySongs runs on load, we can try to find it there or just play it.
            // We will rely on allSongs being populated shortly.
        } catch (e) { console.error(e); }
    }

    async function loadArtistProfile(artistName) {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login.');
        
        switchView('artist');
        document.getElementById('artist-profile-name').textContent = artistName;
        const container = document.getElementById('artist-songs-grid');
        const actionsContainer = document.getElementById('artist-actions');
        if (container) container.innerHTML = '<p>Loading...</p>';

        try {
            const res = await fetch(`${BACKEND_URL}/api/songs/artist/${encodeURIComponent(artistName)}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const songs = await res.json();
                container.innerHTML = '';
                songs.forEach(song => container.appendChild(createSongCard(song)));

                // Inject Block/Report buttons if we have a user ID from the songs
                if (songs.length > 0 && songs[0].uploadedBy && actionsContainer) {
                    const artistId = songs[0].uploadedBy._id;
                    // Don't show for self
                    if (artistId !== localStorage.getItem('userId')) {
                        actionsContainer.innerHTML = `
                            <button class="profile-action-btn" onclick="openReportUserModal('${artistId}')"><i class="ph-fill ph-flag"></i> Report</button>
                            <button class="profile-action-btn" onclick="blockUser('${artistId}')" style="color:#ff4444;"><i class="ph-fill ph-prohibit"></i> Block</button>
                        `;
                    } else {
                        actionsContainer.innerHTML = '';
                    }
                }
            }
        } catch (e) { console.error(e); }
    }

    // Expose functions to global scope for HTML onclick attributes
    window.openReportUserModal = (userId) => {
        const modal = document.getElementById('report-user-modal');
        const idInput = document.getElementById('report-user-id');
        if(modal && idInput) {
            idInput.value = userId;
            modal.style.display = 'block';
        }
    };

    window.blockUser = async (userId) => {
        if(!confirm("Are you sure you want to block this user?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/block/${userId}`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if(res.ok) {
                alert('User blocked.');
                fetchBlockedUsers(); // Refresh list if on profile
                switchView('home'); // Go home
            }
        } catch(e) { console.error(e); }
    };

    async function unblockUser(userId) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/unblock/${userId}`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });
            if(res.ok) {
                alert('User unblocked.');
                fetchBlockedUsers();
            }
        } catch(e) { console.error(e); }
    }

    async function fetchBlockedUsers() {
        const container = document.getElementById('blocked-users-list');
        const token = localStorage.getItem('token');
        if (!container || !token) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/blocked`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const users = await res.json();
                container.innerHTML = '';
                if (users.length === 0) container.innerHTML = '<p style="color:var(--text-muted); font-size:13px;">No blocked users.</p>';
                
                users.forEach(u => {
                    const div = document.createElement('div');
                    div.className = 'blocked-user-item';
                    div.innerHTML = `<span>${u.username}</span>`;
                    const btn = document.createElement('button');
                    btn.className = 'unblock-btn';
                    btn.textContent = 'Unblock';
                    btn.onclick = () => unblockUser(u._id);
                    div.appendChild(btn);
                    container.appendChild(div);
                });
            }
        } catch(e) { console.error(e); }
    }

    function renderFavorites() {
        const grid = document.getElementById('favorites-grid');
        if(!grid) return;
        grid.innerHTML = '';
        
        const favSongs = allSongs.filter(s => likedSongIds.has(s._id));
        
        if (favSongs.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted);">No liked songs yet.</p>';
            return;
        }

        favSongs.forEach(song => {
            const card = createSongCard(song);
            grid.appendChild(card);
        });
    }

    function downloadSong(url, filename) {
        const a = document.createElement('a');
        a.style.display = 'none';
        // Try to force download via Cloudinary transformation if applicable
        if (url.includes('cloudinary.com') && url.includes('/upload/')) {
            a.href = url.replace('/upload/', '/upload/fl_attachment/');
        } else {
            a.href = url;
            a.download = filename || 'song.mp3';
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function createSongCard(song) {
        // Helper to create card element
        const originalIndex = allSongs.indexOf(song);
        const card = document.createElement('div');
        card.className = 'music-card';
        
        let imgUrl = 'Assets/default-art.png'; 
        if (song.coverImage) {
            imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
        }

        const durationHtml = song.duration ? ` • ${formatDuration(song.duration)}` : '';
        const artistHtml = `<span class="artist-link" data-artist="${song.artist}">${song.artist || 'Unknown Artist'}</span>`;

        card.innerHTML = `
            <div class="art-box" style="background-image: url('${imgUrl}'); background-size: cover;"></div>
            <h4>${song.title}</h4>
            <p>${artistHtml}${durationHtml}</p>
            <button class="share-song-btn" title="Share"><i class="ph-fill ph-share-network"></i></button>
            <button class="download-song-btn" title="Download">⬇</button>
        `;
        
        card.querySelector('.artist-link').onclick = (e) => {
            e.stopPropagation();
            loadArtistProfile(song.artist);
        };
        card.querySelector('.share-song-btn').onclick = (e) => {
            e.stopPropagation();
            copyToClipboard(`${window.location.origin}?song=${song._id}`);
        };
        card.querySelector('.download-song-btn').onclick = (e) => {
            e.stopPropagation(); downloadSong(song.url || song.songUrl, `${song.title}.mp3`);
        };
        card.onclick = () => playSong(originalIndex);
        return card;
    }

    function renderProfile() {
        const usernameInput = document.getElementById('profile-username-input');
        if(usernameInput) usernameInput.value = localStorage.getItem('username') || '';
        
        // Pre-fill settings form username
        const settingsUsername = document.getElementById('settings-username');
        if(settingsUsername) settingsUsername.value = localStorage.getItem('username') || '';

        const myUploadsGrid = document.getElementById('my-uploads-grid');
        const currentUserId = localStorage.getItem('userId');
        
        if(myUploadsGrid && currentUserId) {
            myUploadsGrid.innerHTML = '';
            const mySongs = allSongs.filter(s => s.uploadedBy === currentUserId);
            
            mySongs.forEach(song => {
                const card = document.createElement('div');
                card.className = 'music-card';
                let imgUrl = 'Assets/default-art.png'; 
                if (song.coverImage) {
                    imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
                }
                
                card.innerHTML = `
                    <div class="art-box" style="background-image: url('${imgUrl}'); background-size: cover;"></div>
                    <h4>${song.title}</h4>
                    <p>${song.artist || 'Unknown Artist'}</p>
                    <button class="download-song-btn" title="Download">⬇</button>
                    <button class="delete-song-btn" data-id="${song._id}" title="Delete Song">✕</button>
                `;
                
                // Re-use delete logic from renderSongs or attach here
                card.querySelector('.delete-song-btn').onclick = (e) => { e.stopPropagation(); if(confirm('Delete?')) deleteSong(song._id); };
                card.querySelector('.download-song-btn').onclick = (e) => {
                    e.stopPropagation(); downloadSong(song.url || song.songUrl, `${song.title}.mp3`);
                };
                myUploadsGrid.appendChild(card);
            });
        }

        // Render Shortcuts Settings
        const shortcutsContainer = document.getElementById('shortcuts-settings-container');
        if (shortcutsContainer && currentUserId) {
            const userShortcuts = JSON.parse(localStorage.getItem(`shortcuts_${currentUserId}`)) || defaultShortcuts;
            
            const labels = {
                playPause: 'Play / Pause',
                next: 'Next Song',
                prev: 'Previous Song',
                volumeUp: 'Volume Up',
                volumeDown: 'Volume Down',
                mute: 'Mute',
                shuffle: 'Toggle Shuffle',
                repeat: 'Toggle Repeat'
            };

            let html = '<div class="shortcuts-grid">';
            for (const [action, key] of Object.entries(userShortcuts)) {
                html += `
                    <div class="shortcut-row">
                        <div class="shortcut-label">${labels[action] || action}</div>
                        <button class="shortcut-key-btn" data-action="${action}">${key === ' ' ? 'Space' : key}</button>
                    </div>
                `;
            }
            html += '</div><button id="reset-shortcuts-btn" style="margin-top:10px; background:rgba(255,255,255,0.1); border:none; color:var(--text-muted); padding:8px 12px; border-radius:6px; cursor:pointer;">Reset Defaults</button>';
            
            shortcutsContainer.innerHTML = html;

            // Handle Remapping
            shortcutsContainer.querySelectorAll('.shortcut-key-btn').forEach(btn => {
                btn.onclick = () => {
                    btn.textContent = 'Press key...';
                    btn.classList.add('recording');
                    
                    const handleKey = (e) => {
                        e.preventDefault();
                        const newKey = e.key === ' ' ? ' ' : e.key;
                        const action = btn.dataset.action;
                        
                        userShortcuts[action] = newKey;
                        localStorage.setItem(`shortcuts_${currentUserId}`, JSON.stringify(userShortcuts));
                        
                        btn.textContent = newKey === ' ' ? 'Space' : newKey;
                        btn.classList.remove('recording');
                        document.removeEventListener('keydown', handleKey);
                    };
                    document.addEventListener('keydown', handleKey, { once: true });
                };
            });

            const resetBtn = document.getElementById('reset-shortcuts-btn');
            if(resetBtn) resetBtn.onclick = () => {
                localStorage.removeItem(`shortcuts_${currentUserId}`);
                renderProfile();
            };
        }
        fetchBlockedUsers();
    }

    // --- SORT LOGIC ---
    const sortSelect = document.getElementById('sort-songs');
    const filterGenre = document.getElementById('filter-genre');

    function applySortAndFilter() {
        let sortedSongs = [...allSongs];
        if (sortSelect) {
            const criteria = sortSelect.value;

            if (criteria === 'title-asc') {
                sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
            } else if (criteria === 'artist-asc') {
                sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
            } else if (criteria === 'date-asc') {
                // Assuming _id roughly correlates to creation time or if date field exists
                // If you have a specific date field, use that. Fallback to _id timestamp
                sortedSongs.sort((a, b) => a._id.localeCompare(b._id));
            } else if (criteria === 'date-desc') {
                sortedSongs.sort((a, b) => b._id.localeCompare(a._id));
            }
        }

        if (filterGenre) {
            const genre = filterGenre.value;
            if (genre !== 'all') {
                sortedSongs = sortedSongs.filter(song => song.genre === genre);
            }
        }

        renderSongs(sortedSongs);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', applySortAndFilter);
    }
    if (filterGenre) {
        filterGenre.addEventListener('change', applySortAndFilter);
    }

    // --- MOOD SELECTOR LOGIC ---
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.onclick = async () => {
            const mood = btn.dataset.mood;
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to use mood filters.');

            try {
                const res = await fetch(`${BACKEND_URL}/api/songs/mood/${mood}`, {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    const songs = await res.json();
                    renderSongs(songs); // Re-use renderSongs to show results in the main grid
                    alert(`Showing ${songs.length} ${mood} songs.`);
                }
            } catch (e) { console.error(e); }
        };
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => console.error('Failed to copy:', err));
    }

    // --- REVIEWS LOGIC ---
    const addReviewBtn = document.getElementById('add-review-btn');
    if (addReviewBtn) {
        addReviewBtn.onclick = () => {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to write a review.');
            document.getElementById('review-modal').style.display = 'block';
        };
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`${BACKEND_URL}/api/reviews`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token 
                    },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    alert('Review submitted!');
                    document.getElementById('review-modal').style.display = 'none';
                    fetchReviews();
                } else {
                    alert('Failed to submit review.');
                }
            } catch (e) { console.error(e); }
        });
    }

    async function fetchReviews() {
        try {
            const res = await fetch(`${BACKEND_URL}/api/reviews`);
            if (res.ok) {
                const reviews = await res.json();
                const container = document.getElementById('reviews-grid');
                if (container) {
                    container.innerHTML = '';
                    reviews.forEach(r => {
                        const div = document.createElement('div');
                        div.className = 'review-card';
                        div.innerHTML = `
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <strong>${r.user.username}</strong>
                                <span style="color:var(--teal-glow);">★ ${r.rating}</span>
                            </div>
                            <p style="color:var(--text-muted); font-size:14px;">${r.comment}</p>
                            <small style="color:var(--text-muted); opacity:0.6;">${new Date(r.date).toLocaleDateString()}</small>
                        `;
                        container.appendChild(div);
                    });
                }
            }
        } catch (e) { console.error(e); }
    }

    async function fetchStats() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/stats`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const stats = await res.json();
                renderStats(stats);
            }
        } catch (e) { console.error(e); }
    }

    function renderStats(stats) {
        const genresContainer = document.getElementById('top-genres-stats');
        const artistsContainer = document.getElementById('top-artists-stats');

        if (genresContainer) {
            let html = '<h3>Top Genres</h3>';
            if (stats.topGenres.length > 0) {
                stats.topGenres.forEach(item => {
                    html += `<div class="stats-item"><span>${item.name}</span><span>${item.count} plays</span></div>`;
                });
            } else {
                html += '<p>No listening data yet.</p>';
            }
            genresContainer.innerHTML = html;
        }

        if (artistsContainer) {
            let html = '<h3>Top Artists</h3>';
            if (stats.topArtists.length > 0) {
                stats.topArtists.forEach(item => {
                    html += `<div class="stats-item"><span>${item.name}</span><span>${item.count} plays</span></div>`;
                });
            } else {
                html += '<p>No listening data yet.</p>';
            }
            artistsContainer.innerHTML = html;
        }
    }

    const reportSongForm = document.getElementById('report-song-form');
    if(reportSongForm) {
        reportSongForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('report-song-id').value;
            const reason = document.getElementById('report-reason').value;
            const token = localStorage.getItem('token');

            if (!token) return alert('Please login to report songs.');

            try {
                const res = await fetch(`${BACKEND_URL}/api/songs/report/${id}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token 
                    },
                    body: JSON.stringify({ reason })
                });
                
                if (res.ok) {
                    alert('Report submitted. Thank you.');
                    reportSongModal.style.display = 'none';
                }
            } catch (e) { console.error(e); }
        });
    }

    const reportUserForm = document.getElementById('report-user-form');
    if(reportUserForm) {
        reportUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('report-user-id').value;
            const reason = document.getElementById('report-user-reason').value;
            const token = localStorage.getItem('token');

            if (!token) return alert('Please login.');

            try {
                const res = await fetch(`${BACKEND_URL}/api/auth/report/${id}`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token 
                    },
                    body: JSON.stringify({ reason })
                });
                
                if (res.ok) {
                    alert('User reported.');
                    document.getElementById('report-user-modal').style.display = 'none';
                }
            } catch (e) { console.error(e); }
        });
    }

    function openReportModal(songId) {
        const modal = document.getElementById('report-song-modal');
        const idInput = document.getElementById('report-song-id');
        if(modal && idInput) {
            idInput.value = songId;
            modal.style.display = 'block';
        }
    }

    function renderSongs(songs) {
        const cardGrid = document.getElementById('all-songs-grid');
        const currentUserId = localStorage.getItem('userId');
        if(cardGrid) {
            cardGrid.innerHTML = ''; // Clear placeholders
            
            songs.forEach(song => {
                const card = document.createElement('div');
                card.className = 'music-card';
                
                // Construct Image URL
                let imgUrl = 'Assets/default-art.png'; 
                if (song.coverImage) {
                    imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
                }

                // Delete Button Logic
                let deleteBtnHtml = '';
                if (currentUserId && song.uploadedBy === currentUserId) {
                    deleteBtnHtml = `<button class="delete-song-btn" data-id="${song._id}" title="Delete Song">✕</button>`;
                }

                // Follow Button Logic
                const isFollowing = currentUser && song.uploadedBy && currentUser.following.includes(song.uploadedBy._id);
                const followBtnHtml = (song.uploadedBy && currentUserId && song.uploadedBy._id !== currentUserId)
                    ? `<button class="follow-btn ${isFollowing ? 'following' : ''}" data-user-id="${song.uploadedBy._id}">${isFollowing ? 'Following' : 'Follow'}</button>`
                    : '';

                const reportBtnHtml = `<button class="report-song-btn" title="Report Song"><i class="ph-fill ph-flag"></i></button>`;
                const shareBtnHtml = `<button class="share-song-btn" title="Share"><i class="ph-fill ph-share-network"></i></button>`;
                const addToPlaylistBtnHtml = `<button class="add-to-playlist-btn" title="Add to Playlist">+</button>`;
                const downloadBtnHtml = `<button class="download-song-btn" title="Download">⬇</button>`;
                const durationHtml = song.duration ? ` • ${formatDuration(song.duration)}` : '';
                const genreHtml = song.genre && song.genre !== 'Unknown' ? ` • <span style="color:var(--teal-glow); font-size:11px;">${song.genre}</span>` : '';
                const artistHtml = `<span class="artist-link" data-artist="${song.artist}">${song.artist || 'Unknown Artist'}</span>`;
                
                // Verified Badge Logic
                const verifiedHtml = (song.uploadedBy && song.uploadedBy.isVerified) 
                    ? `<i class="ph-fill ph-seal-check verified-badge" title="Verified Artist"></i>` 
                    : '';

                card.innerHTML = `
                    <div class="art-box" style="background-image: url('${imgUrl}'); background-size: cover;"></div>
                    <h4>${song.title}</h4>
                    <p>${artistHtml}${verifiedHtml}${followBtnHtml}${durationHtml}${genreHtml}</p>
                    ${addToPlaylistBtnHtml}
                    ${deleteBtnHtml}
                    ${downloadBtnHtml}
                    ${reportBtnHtml}
                    ${shareBtnHtml}
                `;
                
                // Play song on click using original index
                card.onclick = (e) => {
                    // If delete button clicked, don't play
                    if (e.target.classList.contains('delete-song-btn')) {
                        e.stopPropagation();
                        if(confirm('Delete this song permanently?')) {
                            deleteSong(song._id);
                        }
                        return;
                    }
                    if (e.target.classList.contains('download-song-btn')) {
                        e.stopPropagation();
                        downloadSong(song.url || song.songUrl, `${song.title}.mp3`);
                        return;
                    }
                    if (e.target.closest('.share-song-btn')) {
                        e.stopPropagation();
                        copyToClipboard(`${window.location.origin}?song=${song._id}`);
                        return;
                    }
                    if (e.target.classList.contains('add-to-playlist-btn')) {
                        e.stopPropagation();
                        openAddToPlaylistModal(song._id);
                        return;
                    }
                    if (e.target.closest('.report-song-btn')) {
                        e.stopPropagation();
                        openReportModal(song._id);
                        return;
                    }
                    if (e.target.classList.contains('follow-btn')) {
                        e.stopPropagation();
                        followUser(e.target.dataset.userId, e.target);
                        return;
                    }
                    if (e.target.classList.contains('artist-link')) {
                        e.stopPropagation();
                        loadArtistProfile(song.artist);
                        return;
                    }
                    playSong(song);
                };
                cardGrid.appendChild(card);
            });
        }
    }

    async function deleteSong(id) {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BACKEND_URL}/api/songs/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                alert('Song deleted');
                fetchAndDisplaySongs();
            } else {
                alert('Failed to delete song');
            }
        } catch (err) { console.error(err); }
    }

    function renderRecentlyPlayed(songs, isHistoryView = false) {
        if (isHistoryView) {
            const container = document.getElementById('history-list');
            if(!container) return;
            container.innerHTML = '';
            
            songs.forEach(song => {
                const item = document.createElement('div');
                item.className = 'queue-item';
                
                let imgUrl = 'Assets/default-art.png';
                if (song.coverImage) {
                    imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
                }

                item.innerHTML = `
                    <img src="${imgUrl}" alt="art">
                    <div>
                        <h5>${song.title}</h5>
                        <span>${song.artist || 'Unknown Artist'}</span>
                    </div>
                    <button class="share-song-btn" style="position:static; opacity:1; margin-left:auto; margin-right:10px; background:transparent; color:var(--teal-glow); width:auto; height:auto; border-radius:0;" title="Share"><i class="ph-fill ph-share-network" style="font-size:20px;"></i></button>
                    <button class="add-to-playlist-btn" style="position:static; opacity:1; margin-left:auto; margin-right:10px; background:transparent; color:var(--text-muted); width:auto; height:auto; border-radius:0;" title="Add to Playlist"><i class="ph-fill ph-plus-circle" style="font-size:20px;"></i></button>
                    <button class="download-song-btn" style="position:static; opacity:1; margin-left:auto;" title="Download">⬇</button>
                `;
                
                item.querySelector('.share-song-btn').onclick = (e) => {
                    e.stopPropagation(); copyToClipboard(`${window.location.origin}?song=${song._id}`);
                };
                item.querySelector('.add-to-playlist-btn').onclick = (e) => {
                    e.stopPropagation(); openAddToPlaylistModal(song._id);
                };
                item.querySelector('.download-song-btn').onclick = (e) => {
                    e.stopPropagation(); downloadSong(song.url || song.songUrl, `${song.title}.mp3`);
                };
                item.onclick = () => playSong(song);
                container.appendChild(item);
            });
            return;
        }

        const container = document.getElementById('recently-played-grid');
        if(!container) return;
        container.innerHTML = '';

        songs.forEach(song => {
            // We play from the main list context, so we find the song in allSongs
            // If it's not in allSongs (e.g. deleted), we might skip or handle gracefully
            const mainIndex = allSongs.findIndex(s => s._id === song._id);
            
            const card = document.createElement('div');
            card.className = 'music-card';
            
            let imgUrl = 'Assets/default-art.png'; 
            if (song.coverImage) {
                imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
            }

            card.innerHTML = `
                <div class="art-box" style="background-image: url('${imgUrl}'); background-size: cover;"></div>
                <h4>${song.title}</h4>
                <p>${song.artist || 'Unknown Artist'}</p>
                <button class="download-song-btn" title="Download">⬇</button>
            `;
            
            if (mainIndex !== -1) {
                card.querySelector('.download-song-btn').onclick = (e) => {
                    e.stopPropagation(); downloadSong(song.url || song.songUrl, `${song.title}.mp3`);
                };
                card.onclick = () => playSong(allSongs[mainIndex]);
            }
            container.appendChild(card);
        });
    }

    function renderQueue() {
        // Target the queue list in the Library view
        const queueList = document.getElementById('library-queue-list');
        if (!queueList) return;
        queueList.innerHTML = '';

        if (playbackQueue.length === 0) {
            queueList.innerHTML = '<p style="color: var(--text-muted); padding: 10px;">Queue is empty</p>';
            return;
        }

        playbackQueue.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = `queue-item ${index === currentSongIndex ? 'active' : ''}`;
            item.draggable = true; // Enable Drag
            
            let imgUrl = 'Assets/default-art.png';
            if (song.coverImage) {
                imgUrl = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
            }

            item.innerHTML = `
                <img src="${imgUrl}" alt="art">
                <div>
                    <h5>${song.title}</h5>
                    <span>${song.artist || 'Unknown Artist'}</span>
                </div>
            `;

            // Remove Button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'queue-remove-btn';
            removeBtn.innerHTML = '✕';
            removeBtn.title = 'Remove from Queue';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeFromQueue(index);
            };
            item.appendChild(removeBtn);

            // Drag Events
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => item.classList.remove('dragging'));
            item.addEventListener('dragover', (e) => e.preventDefault()); // Allow drop
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex === toIndex) return;

                // Reorder Array
                const movedSong = playbackQueue[fromIndex];
                playbackQueue.splice(fromIndex, 1);
                playbackQueue.splice(toIndex, 0, movedSong);

                // Update Current Index
                if (currentSongIndex === fromIndex) currentSongIndex = toIndex;
                else if (currentSongIndex > fromIndex && currentSongIndex <= toIndex) currentSongIndex--;
                else if (currentSongIndex < fromIndex && currentSongIndex >= toIndex) currentSongIndex++;

                renderQueue();
            });

            item.onclick = () => playSong(song);
            queueList.appendChild(item);
        });
    }

    // Clear Queue Logic
    const clearQueueBtn = document.getElementById('clear-queue-btn');
    if (clearQueueBtn) {
        clearQueueBtn.onclick = () => {
            playbackQueue = [];
            currentSongIndex = -1;
            renderQueue();
        };
    }

    function removeFromQueue(index) {
        if (index === currentSongIndex) {
            alert("Cannot remove currently playing song.");
            return;
        }
        
        playbackQueue.splice(index, 1);
        if (index < currentSongIndex) {
            currentSongIndex--;
        }
        renderQueue();
    }

    async function fetchLikedSongs() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/playlists/liked`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const ids = await res.json();
                likedSongIds = new Set(ids);
            }
        } catch (err) { console.error(err); }
    }

    async function fetchTrendingSongs() {
        try {
            const res = await fetch(`${BACKEND_URL}/api/songs/trending`);
            if (res.ok) {
                const songs = await res.json();
                const container = document.getElementById('trending-grid');
                if (container) {
                    container.innerHTML = '';
                    songs.forEach(song => container.appendChild(createSongCard(song)));
                }
            }
        } catch (err) { console.error(err); }
    }

    async function fetchRecentlyPlayed(isHistoryView = false) {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/playlists/recently-played`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const songs = await res.json();
                renderRecentlyPlayed(songs, isHistoryView);
            }
        } catch (err) { console.error(err); }
    }

    async function fetchDailyMix() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/playlists/daily-mix`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const playlist = await res.json();
                const container = document.getElementById('daily-mix-grid');
                if (container && playlist.songs.length > 0) {
                    container.innerHTML = '';
                    // Create a special card for the mix itself
                    const card = document.createElement('div');
                    card.className = 'music-card';
                    card.style.background = 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)';
                    card.innerHTML = `
                        <div class="art-box" style="background: rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center;"><i class="ph-fill ph-sparkle" style="font-size:48px; color:white;"></i></div>
                        <h4 style="color:black;">Daily Mix</h4>
                        <p style="color:rgba(0,0,0,0.7);">Fresh every 24h</p>
                        <button class="play-fab" style="position:absolute; bottom:20px; right:20px; width:40px; height:40px; font-size:18px;"><i class="ph-fill ph-play"></i></button>
                    `;
                    card.onclick = () => {
                        playbackQueue = playlist.songs;
                        currentSongIndex = 0;
                        playSong(playbackQueue[0]);
                        switchView('library'); // Show queue
                        renderQueue();
                    };
                    container.appendChild(card);
                }
            }
        } catch (err) { console.error(err); }
    }

    async function fetchLibraryRecentlyAdded() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/songs/recently-added`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const songs = await res.json();
                const container = document.getElementById('library-recently-added-grid');
                if (container) {
                    container.innerHTML = '';
                    songs.forEach(song => container.appendChild(createSongCard(song)));
                }
            }
        } catch (err) { console.error(err); }
    }

    async function fetchSmartPlaylists() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/playlists/smart`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const genres = await res.json();
                const container = document.getElementById('smart-playlists-grid');
                if (container) {
                    container.innerHTML = '';
                    genres.forEach(g => {
                        if (g._id === 'Unknown') return;
                        const card = document.createElement('div');
                        card.className = 'music-card';
                        card.innerHTML = `
                            <div class="art-box" style="background: linear-gradient(45deg, var(--purple-glow), var(--teal-glow)); display:flex; align-items:center; justify-content:center;">
                                <span style="font-weight:800; font-size:20px; color:white;">${g._id[0]}</span>
                            </div>
                            <h4>${g._id} Mix</h4>
                            <p>${g.count} Songs</p>
                        `;
                        card.onclick = async () => {
                            // Fetch songs for this genre
                            const songRes = await fetch(`${BACKEND_URL}/api/songs/genre/${g._id}`, {
                                headers: { 'x-auth-token': token }
                            });
                            if (songRes.ok) {
                                const songs = await songRes.json();
                                playbackQueue = songs;
                                currentSongIndex = 0;
                                playSong(playbackQueue[0]);
                                switchView('library');
                                renderQueue();
                            }
                        };
                        container.appendChild(card);
                    });
                }
            }
        } catch (err) { console.error(err); }
    }

    async function fetchAndDisplaySongs() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/songs`);
            if (response.ok) {
                allSongs = await response.json();
                playbackQueue = [...allSongs]; // Initialize queue with all songs
                renderSongs(allSongs);
                renderQueue();
                
                // Handle deep link for song after songs are loaded
                const urlParams = new URLSearchParams(window.location.search);
                const sharedSongId = urlParams.get('song');
                if (sharedSongId) {
                    const songToPlay = allSongs.find(s => s._id === sharedSongId);
                    if (songToPlay) {
                        playSong(songToPlay);
                        alert(`Playing shared song: "${songToPlay.title}"`);
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    async function loadSharedPlaylist(id) {
        try {
            const res = await fetch(`${BACKEND_URL}/api/playlists/${id}`);
            if (res.ok) {
                const playlist = await res.json();
                if (playlist.songs && playlist.songs.length > 0) {
                    playbackQueue = playlist.songs;
                    currentSongIndex = 0;
                    switchView('library');
                    renderQueue();
                    alert(`Loaded shared playlist: "${playlist.name}"`);
                } else {
                    alert('Shared playlist is empty or invalid.');
                }
            }
        } catch (e) { console.error('Error loading shared playlist:', e); }
    }

    // --- VOICE SEARCH LOGIC ---
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    if (voiceSearchBtn) {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            voiceSearchBtn.onclick = () => {
                if (voiceSearchBtn.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            };

            recognition.onstart = () => voiceSearchBtn.classList.add('listening');
            recognition.onend = () => voiceSearchBtn.classList.remove('listening');
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (searchInput) {
                    searchInput.value = transcript;
                    searchInput.dispatchEvent(new Event('input')); // Trigger search
                }
            };
        } else {
            voiceSearchBtn.style.display = 'none'; // Hide if not supported
        }
    }

    // --- SEARCH HISTORY LOGIC ---
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    function renderSearchHistory() {
        const container = document.getElementById('search-history-tags');
        if (!container) return;
        container.innerHTML = '';
        
        searchHistory.forEach(term => {
            const tag = document.createElement('div');
            tag.className = 'search-tag';
            tag.innerHTML = `<i class="ph ph-clock-counter-clockwise"></i> ${term}`;
            tag.onclick = () => {
                if (searchInput) {
                    searchInput.value = term;
                    searchInput.dispatchEvent(new Event('input'));
                }
            };
            container.appendChild(tag);
        });
    }

    function addToSearchHistory(term) {
        if (!term) return;
        // Remove if exists to move to top
        searchHistory = searchHistory.filter(t => t !== term);
        searchHistory.unshift(term);
        if (searchHistory.length > 10) searchHistory.pop(); // Limit to 10
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }

    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            searchHistory = [];
            localStorage.removeItem('searchHistory');
            renderSearchHistory();
        };
    }

    // Search Filter Logic
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            // Switch to search view if typing
            if (term.length > 0 && searchView.style.display === 'none') {
                switchView('search');
            }
            
            // Toggle History vs Results
            const historyContainer = document.getElementById('search-history-container');
            const resultsTitle = document.getElementById('search-results-title');
            if (term.length === 0) {
                if (historyContainer) historyContainer.style.display = 'block';
                if (resultsTitle) resultsTitle.style.display = 'none';
                renderSearchHistory();
            } else {
                if (historyContainer) historyContainer.style.display = 'none';
                if (resultsTitle) resultsTitle.style.display = 'block';
            }

            const filteredSongs = allSongs.filter(song => 
                song.title.toLowerCase().includes(term) || 
                song.artist.toLowerCase().includes(term)
            );
            
            const searchGrid = document.getElementById('search-results-grid');
            if(searchGrid) {
                searchGrid.innerHTML = '';
                filteredSongs.forEach(song => {
                    searchGrid.appendChild(createSongCard(song));
                });
            }
        });

        // Save history on Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addToSearchHistory(searchInput.value);
            }
        });
    }

    function playSong(song) {
        // Find song in current queue
        let index = playbackQueue.findIndex(s => s._id === song._id);
        
        // If song is not in queue (e.g. playing from Home after clearing queue), reset queue or add it
        if (index === -1) {
            // Option: Reset queue to all songs (Spotify style context reset)
            playbackQueue = [...allSongs];
            index = playbackQueue.findIndex(s => s._id === song._id);
            renderQueue();
        }

        if (index === -1) return; // Should not happen if song exists
        
        currentSongIndex = index;

        const player = document.getElementById('audio-player');
        const title = document.getElementById('current-song-title');
        const artist = document.getElementById('current-song-artist');
        const img = document.getElementById('current-song-img');
        const playBtn = document.getElementById('play-btn');
        const likeBtn = document.getElementById('like-btn');
        const volumeSlider = document.getElementById('volume-slider');

        if(title) title.textContent = song.title;
        if(artist) artist.textContent = song.artist || 'Unknown Artist';
        if(img && song.coverImage) {
            img.src = song.coverImage.startsWith('http') ? song.coverImage : `${BACKEND_URL}/${song.coverImage}`;
        }

        // Update Lyrics Modal Content
        const lyricsTitle = document.getElementById('lyrics-song-title');
        const lyricsContent = document.getElementById('lyrics-content');
        if (lyricsTitle) lyricsTitle.textContent = song.title;
        if (lyricsContent) lyricsContent.textContent = song.lyrics || "No lyrics available for this song.";

        // Data Saver: Modify Cloudinary URL for lower quality
        if (isDataSaver && songUrl.includes('/upload/')) {
            songUrl = songUrl.replace('/upload/', '/upload/q_auto:low,br_64k/');
        }

        if (!isPrivateSession) {
            // Increment Play Count
            fetch(`${BACKEND_URL}/api/songs/play/${song._id}`, { method: 'POST' })
                .then(() => {
                    // Optionally refresh trending list occasionally
                }).catch(e => console.error('Error incrementing play count', e));

            // Add to Recently Played
            const token = localStorage.getItem('token');
            if (token && song._id) {
                fetch(`${BACKEND_URL}/api/playlists/recently-played`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                    body: JSON.stringify({ songId: song._id })
                }).then(() => fetchRecentlyPlayed()); // Refresh list
            }
        }

        // --- UPDATE MEDIA SESSION (Background Play) ---
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                artwork: [
                    { src: img.src, sizes: '96x96', type: 'image/png' },
                    { src: img.src, sizes: '128x128', type: 'image/png' },
                    { src: img.src, sizes: '512x512', type: 'image/png' }
                ]
            });
        }

        // --- CROSSFADE LOGIC ---
        const startNewSong = () => {
            const songUrl = song.url || song.songUrl;
            if(player && songUrl) {
                player.src = songUrl.startsWith('http') ? songUrl : `${BACKEND_URL}/${songUrl}`;
                player.volume = 0; // Start silent
                player.play();
                updateNowPlayingIndicator(true);
                if(playBtn) playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';

                // Initialize Visualizer on first play (requires user gesture)
                setupVisualizer();

                // Fade In
                if (fadeInInterval) clearInterval(fadeInInterval);
                const targetVolume = volumeSlider ? parseFloat(volumeSlider.value) : 1;
                const steps = 20;
                const step = targetVolume / steps;
                fadeInInterval = setInterval(() => {
                    if (player.volume < targetVolume - step) {
                        player.volume += step;
                    } else {
                        player.volume = targetVolume;
                        clearInterval(fadeInInterval);
                    }
                }, (crossfadeDuration * 1000) / steps); 
            }
        };

        // If playing, Fade Out first
        if (player && !player.paused && player.currentTime > 0) {
            if (fadeOutInterval) clearInterval(fadeOutInterval);
            if (fadeInInterval) clearInterval(fadeInInterval);

            const startVol = player.volume;
            const steps = 20;
            const step = startVol / steps;

            fadeOutInterval = setInterval(() => {
                if (player.volume > step) {
                    player.volume -= step;
                } else {
                    player.volume = 0;
                    clearInterval(fadeOutInterval);
                    startNewSong();
                }
            }, (crossfadeDuration * 1000) / steps);
        } else {
            startNewSong();
        }
    }

    function updateNowPlayingIndicator(isPlaying) {
        const indicator = document.getElementById('library-now-playing-indicator');
        if (indicator) {
            indicator.style.display = isPlaying ? 'block' : 'none';
            // Optional: You could also add a class to animate bars here
        }
    }

    async function fetchAndDisplayPlaylists() {
        const token = localStorage.getItem('token');
        let url = `${BACKEND_URL}/api/playlists/public`;
        let headers = {};
        if (token) {
            url = `${BACKEND_URL}/api/playlists/my`;
            headers = { 'x-auth-token': token };
        }
        try {
            const response = await fetch(url, { headers });
            if (response.ok) {
                const playlists = await response.json();
                const playlistsArea = document.querySelector('.playlists-area');
                const playlistItems = playlistsArea.querySelectorAll('.playlist-item');
                // Remove existing playlist items
                playlistItems.forEach(item => item.remove());
                
                playlists.forEach(playlist => {
                    const playlistItem = document.createElement('div');
                    playlistItem.className = 'playlist-item';
                    
                    // Playlist Name
                    const span = document.createElement('span');
                    span.textContent = playlist.name;

                    // Share Button
                    const shareBtn = document.createElement('button');
                    shareBtn.className = 'share-playlist-btn';
                    shareBtn.innerHTML = '<i class="ph ph-share-network"></i>';
                    shareBtn.style.marginRight = '5px';
                    shareBtn.onclick = (e) => {
                        e.stopPropagation();
                        copyToClipboard(`${window.location.origin}?playlist=${playlist._id}`);
                    };
                    
                    // Rename Button
                    const renameBtn = document.createElement('button');
                    renameBtn.className = 'rename-playlist-btn';
                    renameBtn.innerHTML = '✎';
                    renameBtn.style.marginRight = '5px';
                    renameBtn.onclick = (e) => {
                        e.stopPropagation();
                        openRenameModal(playlist._id, playlist.name);
                    };

                    // Delete Button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-playlist-btn';
                    deleteBtn.innerHTML = '✕'; // or use icon
                    deleteBtn.onclick = async (e) => {
                        e.stopPropagation();
                        if(confirm(`Delete playlist "${playlist.name}"?`)) {
                            try {
                                await fetch(`${BACKEND_URL}/api/playlists/${playlist._id}`, {
                                    method: 'DELETE',
                                    headers: { 'x-auth-token': token }
                                });
                                fetchAndDisplayPlaylists(); // Refresh list
                            } catch (err) {
                                console.error('Error deleting playlist:', err);
                            }
                        }
                    };

                    playlistItem.appendChild(span);
                    playlistItem.appendChild(shareBtn);
                    playlistItem.appendChild(renameBtn);
                    playlistItem.appendChild(deleteBtn);
                    playlistsArea.appendChild(playlistItem);
                });
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    }

    function openRenameModal(id, currentName) {
        const modal = document.getElementById('rename-playlist-modal');
        const idInput = document.getElementById('rename-playlist-id');
        const nameInput = document.getElementById('rename-playlist-name');
        if(modal && idInput && nameInput) {
            idInput.value = id;
            nameInput.value = currentName;
            modal.style.display = 'block';
        }
    }

    // Player Controls (Play/Pause Toggle)
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const audioPlayer = document.getElementById('audio-player');
    const seekBar = document.getElementById('seek-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const totalDurationSpan = document.getElementById('total-duration');
    const likeBtn = document.getElementById('like-btn');
    const sleepTimerBtn = document.getElementById('sleep-timer-btn');
    const lyricsBtn = document.getElementById('lyrics-btn');
    const pipBtn = document.getElementById('pip-btn');
    const eqBtn = document.getElementById('eq-btn');
    const partyBtn = document.getElementById('party-btn');
    const karaokeBtn = document.getElementById('karaoke-btn');
    const pitchBtn = document.getElementById('pitch-btn');
    const slowedReverbBtn = document.getElementById('slowed-reverb-btn');
    const moreOptionsBtn = document.getElementById('more-options-btn');
    const moreOptionsMenu = document.getElementById('more-options-menu');
    const focusModeBtn = document.getElementById('focus-mode-btn');
    const privateSessionBtn = document.getElementById('private-session-btn');
    const dataSaverBtn = document.getElementById('data-saver-btn');
    const crossfadeSlider = document.getElementById('crossfade-slider');
    const sleepTimerDisplay = document.getElementById('sleep-timer-display');

    if(playBtn && audioPlayer) {
        playBtn.onclick = () => {
            if(audioPlayer.paused) {
                audioPlayer.play();
                updateNowPlayingIndicator(true);
                playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
            } else {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
            }
            // Ensure AudioContext is running (browser policy)
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            updateNowPlayingIndicator(!audioPlayer.paused);
        };

        // More Options Menu Toggle
        if (moreOptionsBtn && moreOptionsMenu) {
            moreOptionsBtn.onclick = (e) => {
                e.stopPropagation();
                moreOptionsMenu.classList.toggle('show');
            };

            document.addEventListener('click', (e) => {
                if (!moreOptionsMenu.contains(e.target) && e.target !== moreOptionsBtn) {
                    moreOptionsMenu.classList.remove('show');
                }
            });
        }

        if (crossfadeSlider) {
            crossfadeSlider.oninput = () => {
                crossfadeDuration = parseInt(crossfadeSlider.value);
            };
        }

        // Shuffle Toggle
        if (shuffleBtn) {
            shuffleBtn.onclick = () => {
                isShuffle = !isShuffle;
                shuffleBtn.classList.toggle('active', isShuffle);
            };
        }

        // Repeat Toggle
        if (repeatBtn) {
            repeatBtn.onclick = () => {
                if (repeatMode === 'off') {
                    repeatMode = 'all';
                    repeatBtn.classList.add('active');
                    repeatBtn.innerHTML = '<i class="ph-fill ph-repeat"></i>'; // Active color
                } else if (repeatMode === 'all') {
                    repeatMode = 'one';
                    repeatBtn.classList.add('active');
                    repeatBtn.innerHTML = '<i class="ph-fill ph-repeat-once"></i>'; // Icon change
                } else {
                    repeatMode = 'off';
                    repeatBtn.classList.remove('active');
                    repeatBtn.innerHTML = '<i class="ph-fill ph-repeat"></i>'; // Reset
                }
            };
        }

        // Auto-play next song (Handling Repeat Logic)
        audioPlayer.onended = () => {
            if (repeatMode === 'one') {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
                updateNowPlayingIndicator(true);
            } else if (isShuffle) {
                playSong(playbackQueue[Math.floor(Math.random() * playbackQueue.length)]);
            } else {
                // If repeat all is on, loop. If off, stop at end.
                if (repeatMode === 'all' || currentSongIndex + 1 < playbackQueue.length) {
                    playSong(playbackQueue[(currentSongIndex + 1) % playbackQueue.length]);
                }
            }
        };

        // Update Seek Bar
        audioPlayer.ontimeupdate = () => {
            if (audioPlayer.duration) {
                const progress = audioPlayer.currentTime;
                seekBar.value = progress;
                currentTimeSpan.textContent = formatDuration(progress);
            }
        };

        audioPlayer.onloadedmetadata = () => {
            seekBar.max = audioPlayer.duration;
            totalDurationSpan.textContent = formatDuration(audioPlayer.duration);
        };

        // Seek functionality
        if (seekBar) {
            seekBar.oninput = () => {
                audioPlayer.currentTime = seekBar.value;
            };
        }

        // Volume Control
        if (volumeSlider) {
            volumeSlider.oninput = () => {
                audioPlayer.volume = volumeSlider.value;
            };
        }

        // Next / Prev Buttons
        if (nextBtn) nextBtn.onclick = () => {
            if (isShuffle) {
                playSong(playbackQueue[Math.floor(Math.random() * playbackQueue.length)]);
            } else {
                playSong(playbackQueue[(currentSongIndex + 1) % playbackQueue.length]);
            }
        };
        if (prevBtn) prevBtn.onclick = () => playSong(playbackQueue[(currentSongIndex - 1 + playbackQueue.length) % playbackQueue.length]);

        // Like Button Logic
        if (likeBtn) {
            likeBtn.onclick = async () => {
                const song = playbackQueue[currentSongIndex];
                if (!song) return;
                const token = localStorage.getItem('token');
                if (!token) return alert('Please login to like songs');

                try {
                    const res = await fetch(`${BACKEND_URL}/api/playlists/like/${song._id}`, {
                        method: 'POST',
                        headers: { 'x-auth-token': token }
                    });
                    const data = await res.json();
                    if (data.isLiked) {
                        likedSongIds.add(song._id);
                        showLikeAnimation(likeBtn);
                    } else {
                        likedSongIds.delete(song._id);
                    }
                    
                    likeBtn.querySelector('i').style.color = data.isLiked ? 'var(--purple-glow)' : '#9496A1';
                } catch (err) { console.error(err); }
            };
        }

        // Sleep Timer Logic
        if (sleepTimerBtn && sleepTimerModal) {
            sleepTimerBtn.onclick = () => {
                sleepTimerModal.style.display = 'block';
            };

            const timerOptions = sleepTimerModal.querySelectorAll('.timer-option');
            timerOptions.forEach(btn => {
                btn.onclick = () => {
                    const minutes = parseInt(btn.getAttribute('data-time'));
                    if (sleepTimerId) clearTimeout(sleepTimerId);
                    if (sleepTimerInterval) clearInterval(sleepTimerInterval);
                    
                    if (minutes === 0) {
                        alert("Sleep timer turned off.");
                        sleepTimerBtn.classList.remove('active');
                        if(sleepTimerDisplay) sleepTimerDisplay.style.display = 'none';
                    } else {
                        alert(`Sleep timer set for ${minutes} minutes.`);
                        sleepTimerBtn.classList.add('active');
                        sleepTimerId = setTimeout(() => {
                            audioPlayer.pause();
                            playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
                            sleepTimerBtn.classList.remove('active');
                            if(sleepTimerDisplay) sleepTimerDisplay.style.display = 'none';
                            if(sleepTimerInterval) clearInterval(sleepTimerInterval);
                        }, minutes * 60 * 1000);

                        // Countdown Display
                        if(sleepTimerDisplay) {
                            sleepTimerDisplay.style.display = 'inline';
                            let timeLeft = minutes * 60;
                            sleepTimerInterval = setInterval(() => {
                                timeLeft--;
                                const m = Math.floor(timeLeft / 60);
                                const s = timeLeft % 60;
                                sleepTimerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                                if (timeLeft <= 0) clearInterval(sleepTimerInterval);
                            }, 1000);
                        }
                    }
                    sleepTimerModal.style.display = 'none';
                };
            });
        }

        // Lyrics Button Logic
        if (lyricsBtn && lyricsModal) {
            lyricsBtn.onclick = () => {
                lyricsModal.style.display = 'block';
            };
        }

        // Equalizer Button Logic
        if (eqBtn && eqModal) {
            eqBtn.onclick = () => {
                eqModal.style.display = 'block';
            };

            const bassSlider = document.getElementById('bass-slider');
            const trebleSlider = document.getElementById('treble-slider');

            if (bassSlider) bassSlider.oninput = () => {
                if (bassFilter) bassFilter.gain.value = bassSlider.value;
            };
            if (trebleSlider) trebleSlider.oninput = () => {
                if (trebleFilter) trebleFilter.gain.value = trebleSlider.value;
            };
        }

        // Karaoke Mode Logic
        if (karaokeBtn) {
            karaokeBtn.onclick = () => {
                isKaraokeMode = !isKaraokeMode;
                karaokeBtn.classList.toggle('active', isKaraokeMode);
                
                // Update Audio Graph Gains
                if (karaokeDryGain && karaokeWetGain) {
                    // Crossfade between normal (dry) and karaoke (wet)
                    karaokeDryGain.gain.value = isKaraokeMode ? 0 : 1;
                    karaokeWetGain.gain.value = isKaraokeMode ? 1 : 0;
                }
            };
        }

        // Pitch Shift Button Logic
        if (pitchBtn && pitchModal) {
            pitchBtn.onclick = () => {
                pitchModal.style.display = 'block';
            };

            const pitchSlider = document.getElementById('pitch-slider');
            const pitchValue = document.getElementById('pitch-value');

            if (pitchSlider) {
                pitchSlider.oninput = () => {
                    const val = parseFloat(pitchSlider.value);
                    pitchValue.textContent = val.toFixed(2) + 'x';
                    audioPlayer.playbackRate = val;
                    // preservesPitch = false allows "chipmunk" or "deep" voice effect (Key Change)
                    if(audioPlayer.preservesPitch !== undefined) audioPlayer.preservesPitch = false;
                    else if(audioPlayer.mozPreservesPitch !== undefined) audioPlayer.mozPreservesPitch = false;
                    else if(audioPlayer.webkitPreservesPitch !== undefined) audioPlayer.webkitPreservesPitch = false;
                };
            }
        }

        // Slowed + Reverb Logic
        if (slowedReverbBtn) {
            slowedReverbBtn.onclick = () => {
                isSlowedReverb = !isSlowedReverb;
                slowedReverbBtn.classList.toggle('active', isSlowedReverb);

                if (isSlowedReverb) {
                    audioPlayer.playbackRate = 0.85;
                    if(audioPlayer.preservesPitch !== undefined) audioPlayer.preservesPitch = false;
                    if (reverbWetGain) reverbWetGain.gain.value = 0.4; // Enable Reverb
                } else {
                    audioPlayer.playbackRate = 1.0;
                    if(audioPlayer.preservesPitch !== undefined) audioPlayer.preservesPitch = true;
                    if (reverbWetGain) reverbWetGain.gain.value = 0; // Disable Reverb
                }
            };
        }

        // Focus Mode Logic
        if (focusModeBtn) {
            focusModeBtn.onclick = () => {
                isFocusMode = !isFocusMode;
                document.body.classList.toggle('focus-mode', isFocusMode);
                focusModeBtn.classList.toggle('active', isFocusMode);
                focusModeBtn.innerHTML = isFocusMode ? '<i class="ph-fill ph-corners-in"></i> Exit Focus' : '<i class="ph-fill ph-corners-out"></i> Focus Mode';
            };
        }

        // Private Session Logic
        if (privateSessionBtn) {
            privateSessionBtn.onclick = () => {
                isPrivateSession = !isPrivateSession;
                privateSessionBtn.classList.toggle('active', isPrivateSession);
                // Optional: Add visual indicator on UI that private session is active
            };
        }

        // Data Saver Logic
        if (dataSaverBtn) {
            dataSaverBtn.onclick = () => {
                isDataSaver = !isDataSaver;
                dataSaverBtn.classList.toggle('active', isDataSaver);
                alert(isDataSaver ? "Data Saver Enabled (Lower Quality)" : "Data Saver Disabled (High Quality)");
            };
        }

        // Party Mode Logic
        if (partyBtn) {
            partyBtn.onclick = () => {
                isPartyMode = !isPartyMode;
                partyBtn.classList.toggle('active', isPartyMode);
                if (!isPartyMode) document.body.style.filter = 'none';
            };
        }

        // Mini Player (PiP) Logic
        if (pipBtn) {
            pipBtn.onclick = async () => {
                const pipVideo = document.getElementById('pip-video');
                const canvas = document.getElementById('visualizer');
                
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                } else if (pipVideo && canvas) {
                    try {
                        if (pipVideo.readyState === 0) {
                            const stream = canvas.captureStream(30); // 30 FPS
                            pipVideo.srcObject = stream;
                            await pipVideo.play();
                        }
                        await pipVideo.requestPictureInPicture();
                    } catch (error) {
                        console.error('PiP failed:', error);
                        alert('Mini Player not supported or failed to start.');
                    }
                }
            };
        }

        // --- MEDIA SESSION HANDLERS ---
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                audioPlayer.play();
                playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (prevBtn) prevBtn.click();
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                if (nextBtn) nextBtn.click();
            });
        }
    }

    // --- VISUALIZER SETUP ---
    function setupVisualizer() {
        const canvas = document.getElementById('visualizer');
        const audioPlayer = document.getElementById('audio-player');
        
        if (!canvas || !audioPlayer) return;

        // Only initialize once
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                source = audioContext.createMediaElementSource(audioPlayer);
                
                // Create Filters
                bassFilter = audioContext.createBiquadFilter();
                bassFilter.type = "lowshelf";
                bassFilter.frequency.value = 200; // Bass freq

                trebleFilter = audioContext.createBiquadFilter();
                trebleFilter.type = "highshelf";
                trebleFilter.frequency.value = 2000; // Treble freq

                // Reverb Nodes
                reverbNode = audioContext.createConvolver();
                reverbNode.buffer = createReverbBuffer(audioContext);
                reverbDryGain = audioContext.createGain();
                reverbWetGain = audioContext.createGain();
                reverbDryGain.gain.value = 1;
                reverbWetGain.gain.value = 0; // Off by default

                // Karaoke Nodes (Center Cancellation: L - R)
                const splitter = audioContext.createChannelSplitter(2);
                const merger = audioContext.createChannelMerger(2);
                const invertGain = audioContext.createGain();
                invertGain.gain.value = -1;

                karaokeDryGain = audioContext.createGain();
                karaokeWetGain = audioContext.createGain();
                
                // Default state: Normal audio
                karaokeDryGain.gain.value = 1;
                karaokeWetGain.gain.value = 0;

                // Mix Node to collect Karaoke output before Reverb
                const mixNode = audioContext.createGain();

                // Connect Graph: Source -> Bass -> Treble
                source.connect(bassFilter);
                bassFilter.connect(trebleFilter);

                // Path 1: Normal (Dry)
                trebleFilter.connect(karaokeDryGain);
                karaokeDryGain.connect(mixNode);

                // Path 2: Karaoke (Wet) - (L + (-R)) on both channels
                trebleFilter.connect(splitter);
                splitter.connect(merger, 0, 0); // L -> L
                splitter.connect(merger, 0, 1); // L -> R
                splitter.connect(invertGain, 1); // R -> Invert
                invertGain.connect(merger, 0, 0); // -R -> L
                invertGain.connect(merger, 0, 1); // -R -> R
                merger.connect(karaokeWetGain);
                karaokeWetGain.connect(mixNode);

                // Mix -> Reverb -> Analyser
                mixNode.connect(reverbDryGain);
                reverbDryGain.connect(analyser);

                mixNode.connect(reverbNode);
                reverbNode.connect(reverbWetGain);
                reverbWetGain.connect(analyser);

                analyser.connect(audioContext.destination);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                
                drawVisualizer();
            } catch (e) {
                console.error("Web Audio API error (likely CORS or user gesture):", e);
            }
        }
    }

    function showLikeAnimation(btn) {
        const rect = btn.getBoundingClientRect();
        const heart = document.createElement('i');
        heart.className = 'ph-fill ph-heart flying-heart';
        // Center the heart relative to the button
        heart.style.left = `${rect.left + rect.width / 2 - 12}px`; 
        heart.style.top = `${rect.top}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    function createReverbBuffer(audioContext) {
        // Generate a simple impulse response for reverb
        const sampleRate = audioContext.sampleRate;
        const length = sampleRate * 2.0; // 2 seconds
        const impulse = audioContext.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.pow(1 - i / length, 2);
            left[i] = (Math.random() * 2 - 1) * decay;
            right[i] = (Math.random() * 2 - 1) * decay;
        }
        return impulse;
    }

    function drawVisualizer() {
        const canvas = document.getElementById('visualizer');
        if (!canvas || !analyser) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const bufferLength = analyser.frequencyBinCount;

        requestAnimationFrame(drawVisualizer);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        // Party Mode Beat Detection
        if (isPartyMode) {
            let bassEnergy = 0;
            // Check low frequency bins (approx first 10)
            for (let i = 0; i < 10; i++) {
                bassEnergy += dataArray[i];
            }
            bassEnergy /= 10;
            
            if (bassEnergy > 220) { // Threshold for beat
                const hue = Math.floor(Math.random() * 360);
                document.body.style.filter = `hue-rotate(${hue}deg)`;
            }
        }

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2; // Scale down

            // Gradient Color based on theme
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#00F0FF'); // Teal
            gradient.addColorStop(1, '#7B61FF'); // Purple

            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    // --- GLOBAL KEYBOARD SHORTCUTS ---
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const shortcuts = JSON.parse(localStorage.getItem(`shortcuts_${userId}`)) || defaultShortcuts;
        const key = e.key;

        if (key === shortcuts.playPause) {
            e.preventDefault();
            if (playBtn) playBtn.click();
        } else if (key === shortcuts.next) {
            e.preventDefault();
            if (nextBtn) nextBtn.click();
        } else if (key === shortcuts.prev) {
            e.preventDefault();
            if (prevBtn) prevBtn.click();
        } else if (key === shortcuts.volumeUp) {
            e.preventDefault();
            if (audioPlayer.volume < 1) audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
            if (volumeSlider) volumeSlider.value = audioPlayer.volume;
        } else if (key === shortcuts.volumeDown) {
            e.preventDefault();
            if (audioPlayer.volume > 0) audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
            if (volumeSlider) volumeSlider.value = audioPlayer.volume;
        } else if (key === shortcuts.mute) {
            e.preventDefault();
            audioPlayer.muted = !audioPlayer.muted;
        } else if (key === shortcuts.shuffle) {
            e.preventDefault();
            if (shuffleBtn) shuffleBtn.click();
        } else if (key === shortcuts.repeat) {
            e.preventDefault();
            if (repeatBtn) repeatBtn.click();
        }
    });

    // --- PERIODIC DATA REFRESH ---
    setInterval(() => {
        console.log('Refreshing data...');
        fetchAndDisplaySongs();
        fetchTrendingSongs();
        fetchRecentlyPlayed();
        fetchAndDisplayPlaylists();
        fetchDailyMix();
        fetchSmartPlaylists();
        fetchNotifications();
        fetchLibraryRecentlyAdded();
        fetchReviews();
    }, 600000); // 10 minutes

    fetchAndDisplayPlaylists();
    fetchAndDisplaySongs();
    fetchLikedSongs();
    fetchTrendingSongs();
    fetchRecentlyPlayed();
    fetchDailyMix();
    fetchSmartPlaylists();
    fetchNotifications();
    fetchLibraryRecentlyAdded();
    fetchReviews();
});