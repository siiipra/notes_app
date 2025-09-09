// A simple array to store notes, no backend persistence
let notes = [];

const notesContainer = document.getElementById('notes-container');
const emptyState = document.getElementById('empty-state');
const addNoteBtn = document.getElementById('add-note-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmActionBtn = document.getElementById('confirm-action-btn');
const cancelBtn = document.getElementById('cancel-btn');

const renderNotes = () => {
    notesContainer.innerHTML = '';
    if (notes.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.id = `note-${note.id}`;
            noteCard.classList.add('note-card', 'bg-gray-50', 'p-4', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200', 'flex', 'flex-col', 'space-y-2');

            noteCard.innerHTML = `
                <input type="text" value="${note.title}" placeholder="Note Title" class="w-full text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500">
                <textarea placeholder="Write your note here..." class="w-full h-32 resize-none text-sm text-gray-700 bg-transparent focus:outline-none">${note.content}</textarea>
                <div class="flex justify-end space-x-2 mt-4">
                    <button class="update-btn text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md">Update</button>
                    <button class="delete-btn text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md">Delete</button>
                </div>
            `;
            notesContainer.appendChild(noteCard);

            // Event listeners added to the new note card
            noteCard.querySelector('.update-btn').addEventListener('click', () => updateNote(note.id, noteCard));
            noteCard.querySelector('.delete-btn').addEventListener('click', () => showConfirmModal('Are you sure you want to delete this note?', () => deleteNote(note.id)));
        });
    }
};

const addNote = () => {
    const newNote = {
        id: Date.now().toString(),
        title: "New Note",
        content: "Start writing here...",
        timestamp: new Date().toISOString()
    };
    notes.unshift(newNote); // Added to the beginning to show it at the top
    renderNotes();
};

const updateNote = (id, cardElement) => {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].title = cardElement.querySelector('input').value;
        notes[noteIndex].content = cardElement.querySelector('textarea').value;
        // No need to re-render the whole list for a simple update
        console.log(`Note with ID ${id} updated.`);
    }
};

const deleteNote = (id) => {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
};

const showConfirmModal = (message, onConfirm) => {
    confirmMessage.textContent = message;
    confirmModal.classList.remove('hidden');
    confirmModal.classList.add('flex');

    const onConfirmClick = () => {
        onConfirm();
        hideConfirmModal();
        confirmActionBtn.removeEventListener('click', onConfirmClick);
    };

    confirmActionBtn.addEventListener('click', onConfirmClick);
};

const hideConfirmModal = () => {
    confirmModal.classList.add('hidden');
    confirmModal.classList.remove('flex');
};

// Initial render
document.addEventListener('DOMContentLoaded', renderNotes);

// Event listeners
addNoteBtn.addEventListener('click', addNote);
cancelBtn.addEventListener('click', hideConfirmModal);