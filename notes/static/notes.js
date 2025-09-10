document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-container');
    const authLinks = document.getElementById('auth-links');
    const userInfoDiv = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const emptyState = document.getElementById('empty-state');
    const addNoteBtn = document.getElementById('add-note-btn');
    const addNoteModal = document.getElementById('add-note-modal');
    const addNoteForm = document.getElementById('add-note-form');
    const cancelNoteBtn = document.getElementById('cancel-note-btn');
    const editNoteModal = document.getElementById('edit-note-modal');
    const editNoteForm = document.getElementById('edit-note-form');
    const editNoteTitle = document.getElementById('edit-note-title');
    const editNoteContent = document.getElementById('edit-note-content');
    const cancelEditNoteBtn = document.getElementById('cancel-edit-note-btn');
    let editingNoteId = null;

    const notesApiUrl = 'http://127.0.0.1:8000/api/notes/';
    let accessToken = localStorage.getItem('accessToken');
    console.log("accessToken:"+ accessToken);

    // --- Utility Functions ---
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const showModal = (modal) => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    const hideModal = (modal) => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };

    // --- Authentication and UI Updates ---
    const checkAuthAndFetchNotes = async () => {
        if (!accessToken) {
            authLinks.classList.remove('hidden');
            userInfoDiv.classList.add('hidden');
            // Hide Add Note button if not logged in
            addNoteBtn.classList.add('hidden');
            emptyState.innerHTML = `
                <p class="text-lg font-medium">Please log in to view and add notes.</p>
                <p>Click "Sign Up" or "Log In" above to get started.</p>
            `;
            emptyState.classList.remove('hidden');
            return;
        }

        await fetchNotes();
    };

    // --- API Calls ---
    const fetchNotes = async () => {
        try {
            const response = await fetch(notesApiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = 'login';
                return;
            }
            
            console.log("Fetch Notes Response Status:", response.status);
            
            authLinks.classList.add('hidden');
            userInfoDiv.classList.remove('hidden');

            // Set username display
            const decoded = parseJwt(accessToken);
            const username = decoded && decoded.username ? decoded.username : "User";
            usernameDisplay.textContent = `Hello, ${username}`;

            const notes = await response.json();
            renderNotes(notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const renderNotes = (notes) => {
        notesContainer.innerHTML = '';
        if (notes.length === 0) {
            emptyState.innerHTML = `
                <p class="text-lg font-medium">You don't have any notes yet.</p>
                <p>Click the "Add New Note" button to get started!</p>
            `;
            emptyState.classList.remove('hidden');
        } else {
            console.log("Rendering notes:", notes);
            emptyState.classList.add('hidden');
            notes.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card bg-white rounded-xl shadow-md p-6 mb-4';
                noteCard.innerHTML = `
                    <h3 class="text-lg font-bold text-gray-800 mb-2">${note.note_title}</h3>
                    <p class="text-gray-600">${note.note_content}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-sm text-gray-500">${new Date(note.created_on).toLocaleDateString()}</span>
                        <div>
                            <button class="edit-note-btn text-blue-600 hover:underline mr-2" data-id="${note.note_id}">Edit</button>
                            <button class="delete-note-btn text-red-600 hover:underline" data-id="${note.note_id}">Delete</button>
                        </div>
                    </div>
                `;
                notesContainer.appendChild(noteCard);
            });

            // Attach event listeners for edit and delete buttons
            document.querySelectorAll('.edit-note-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = btn.getAttribute('data-id');
                const note = notes.find(n => n.note_id == noteId);
                editingNoteId = noteId;
                editNoteTitle.value = note.note_title;
                editNoteContent.value = note.note_content;
                showModal(editNoteModal);
            });
        });
        document.querySelectorAll('.delete-note-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const noteId = btn.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this note?')) {
                    deleteNote(noteId);
                }
            });
        });
    }
};

    const deleteNote = async (noteId) => {
        try {
            const response = await fetch(`${notesApiUrl}${noteId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = 'login';
                return;
            }
            if (response.ok) {
                fetchNotes();
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const updateNote = async (noteId, note_title, note_content) => {
        try {
            const response = await fetch(`${notesApiUrl}${noteId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note_title, note_content })
            });
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = 'login';
                return;
            }
            if (response.ok) {
                hideModal(editNoteModal);
                fetchNotes();
            } else {
                console.error('Failed to update note:', await response.json());
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };


    // --- Event Listeners ---
    addNoteBtn.addEventListener('click', () => {
        showModal(addNoteModal);
    });

    cancelNoteBtn.addEventListener('click', () => {
        hideModal(addNoteModal);
        addNoteForm.reset();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = 'login';
    });

    addNoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const note_title = document.getElementById('note-title').value;
        const note_content = document.getElementById('note-content').value;

        try {
            const response = await fetch(notesApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note_title, note_content })
            });

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = 'login';
                return;
            }

            if (response.ok) {
                addNoteForm.reset();
                hideModal(addNoteModal);
                fetchNotes();
            } else {
                console.error('Failed to add note:', await response.json());
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    });

    // document.querySelectorAll('.edit-note-btn').forEach(btn => {
    //             btn.addEventListener('click', (e) => {
    //                 const noteId = btn.getAttribute('data-id');
    //                 console.log("Editing note ID:", noteId);
    //                 const note = notes.find(n => n.note_id == noteId);
    //                 console.log("Note data:", note);
    //                 editingNoteId = noteId;
    //                 editNoteTitle.value = note.note_title;
    //                 editNoteContent.value = note.note_content;
    //                 showModal(editNoteModal);
    //             });
    //         });
    //         document.querySelectorAll('.delete-note-btn').forEach(btn => {
    //             btn.addEventListener('click', (e) => {
    //                 const noteId = btn.getAttribute('data-id');
    //                 if (confirm('Are you sure you want to delete this note?')) {
    //                     deleteNote(noteId);
    //                 }
    //             });
    //         });
    //     }
    // };

    // --- Edit Note Modal Events ---
    cancelEditNoteBtn.addEventListener('click', () => {
        hideModal(editNoteModal);
        editNoteForm.reset();
    });

    editNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const note_title = editNoteTitle.value;
        const note_content = editNoteContent.value;
        if (editingNoteId) {
            updateNote(editingNoteId, note_title, note_content);
        }
    });


    // Initial check on page load
    checkAuthAndFetchNotes();
});