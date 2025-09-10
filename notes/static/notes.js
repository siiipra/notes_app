document.addEventListener('DOMContentLoaded', () => {
            const noteList = document.getElementById('note-list');
            const addNoteForm = document.getElementById('add-note-form');
            const noteContentInput = document.getElementById('note-content');

            // Get the access token from localStorage.
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            // If no tokens exist, redirect to the login page.
            if (!accessToken || !refreshToken) {
                window.location.href = 'login';
                return;
            }

            // Function to fetch and display notes.
            async function fetchNotes() {
                try {
                    const response = await fetch('/api/notes/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    // If the token is invalid or expired, redirect to login.
                    if (response.status === 401) {
                        window.location.href = 'login';
                        return;
                    }

                    const notes = await response.json();
                    renderNotes(notes);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            }

            // Function to render notes on the page.
            function renderNotes(notes) {
                noteList.innerHTML = '';
                notes.forEach(note => {
                    const li = document.createElement('li');
                    li.className = 'bg-gray-700 p-4 rounded-lg shadow-inner';
                    li.innerHTML = `
                        <p class="text-gray-200">${note.body}</p>
                        <div class="mt-2 text-right text-sm text-gray-400">
                            ${new Date(note.created_at).toLocaleDateString()}
                        </div>
                    `;
                    noteList.appendChild(li);
                });
            }

            // Event listener for the "Add Note" form submission.
            addNoteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const noteContent = noteContentInput.value;
                if (!noteContent) return;

                try {
                    const response = await fetch('/api/notes/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ body: noteContent })
                    });

                    if (response.status === 401) {
                        window.location.href = 'login';
                        return;
                    }

                    if (response.ok) {
                        noteContentInput.value = '';
                        fetchNotes(); // Re-fetch notes to show the new one.
                    } else {
                        console.error('Failed to add note:', await response.json());
                    }
                } catch (error) {
                    console.error('Error adding note:', error);
                }
            });

            // Initial fetch of notes when the page loads.
            fetchNotes();
        });