"use strict";

// Nama key local storage
const NOTES_KEY = 'simple_note_items';
const GROUPS_KEY = 'simple_note_groups';
const TAGS_KEY = 'simple_note_tags';

const MEMORY_NOTES = [];
const MEMORY_GROUPS = [];
const MEMORY_TAGS = [];

const EX_GROUPS = [
  {
    slug: 'welcome',
    title: 'Welcome',
    subtitle: 'Create your first note simply',
  }
];

const EX_TAGS = ['Hello'];

const EX_NOTES = [
  {
    slug: 'ayo-buat-catatan-kamu-secara-mudah',
    updatedAt: Date.now(),
    group: 'welcome',
    tag: 'Hello',
    title: 'Ayo buat catatan kamu secara mudah',
    description: `Gunakan tombol "Tulis" untuk membuat catatan baru, pada menu navigasi: tombol "Group" untuk membuat group baru, dan "Tag" untuk membuat tag baru.`,
  }
];

// Siapkan DOM 
const mainContainer = document.querySelector('#main-container');
const contentContainer = mainContainer.querySelector('#content');
const contentHeader = contentContainer.firstElementChild;
const newNoteForm = contentHeader.querySelector('#new-note-form');
const updateNoteBtn = document.querySelector('label[for=update-note]');
const updateNoteForm = document.querySelector('#update-note-form');


function getSlug(text) {
  let result = "";
  result = text.trim().replace(/[ ]/g, "-").toLowerCase();
  return result;
}

function timeSince(date) {
  // From stackoverflow
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " tahun";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " bulan";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " hari";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " jam";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " menit";
  }
  return Math.floor(seconds) + " detik";
}

function getGroupTemplate(group, notes = []) {
  const notesStrTemplate = notes.map(note => `<section>${getNoteTemplate(note)}</section>`).join('');
  return `
  <article id="${group.slug}" class="note-group">
    <header>
      <h2><strong>${group.title}</strong> - ${group.subtitle}</h2>
      <span class="delete-group" data-slug="${group.slug}">
        &#10005;
      </span>
    </header>
    ${notesStrTemplate}
  </article>
  `;
}

function getNoteTemplate({
  slug,
  updatedAt,
  tag,
  title,
  description,
}) {
  const updatedSince = timeSince(new Date(parseInt(updatedAt, 10)));
  return `
    <p class="article-tag">
      ${tag}<span class="updatedat"> - ${updatedSince} lalu</span>
    </p>
    <h3 class="article-title">${title}</h3>
    <p class="article-desc">
      ${description}
    </p>
    <span class="delete-note" data-slug="${slug}">&#10005;</span>
  `;
}

function getLocalNotes() {
  // Cek apakah MEMORY_NOTES sudah berisi
  if (MEMORY_NOTES.length > 0) return MEMORY_NOTES;

  // Jika MEMORY_NOTES kosong
  const localNotes = localStorage.getItem(NOTES_KEY);
  if (localNotes === null) return [];

  // Simpan data dari local storage ke memory
  MEMORY_NOTES.push(...JSON.parse(localNotes));

  return MEMORY_NOTES;
}

function getLocalGroups() {
  // Cek apakah MEMORY_GROUPS sudah berisi
  if (MEMORY_GROUPS.length > 0) return MEMORY_GROUPS;

  // Jika MEMORY_GROUPS kosong
  const localGroups = localStorage.getItem(GROUPS_KEY);
  if (localGroups === null) {
    MEMORY_NOTES.push(...EX_NOTES);
  } else {
    MEMORY_NOTES.push(...JSON.parse(localNotes));
  }

  return MEMORY_GROUPS;
}

function loadMemory() {
  if (MEMORY_NOTES.length === 0) {
    // Simpan data dari local storage ke memory
    const localNotes = localStorage.getItem(NOTES_KEY);
    if (localNotes === null || localNotes === '[]') {
      MEMORY_NOTES.push(...EX_NOTES);
      localStorage.setItem(NOTES_KEY, JSON.stringify(EX_NOTES));
    } else {
      MEMORY_NOTES.push(...JSON.parse(localNotes));
    }
  }

  if (MEMORY_GROUPS.length === 0) {
    // Simpan data dari local storage ke memory
    const localGroups = localStorage.getItem(GROUPS_KEY);
    if (localGroups === null || localGroups === '[]') {
      MEMORY_GROUPS.push(...EX_GROUPS);
      localStorage.setItem(GROUPS_KEY, JSON.stringify(EX_GROUPS));
    } else {
      MEMORY_GROUPS.push(...JSON.parse(localGroups));
    }
  }

  if (MEMORY_TAGS.length === 0) {
    // Simpan data dari local storage ke memory
    const localTags = localStorage.getItem(TAGS_KEY);
    if (localTags === null || localTags === '[]') {
      MEMORY_TAGS.push(...EX_TAGS);
      localStorage.setItem(TAGS_KEY, JSON.stringify(EX_TAGS));
    } else {
      MEMORY_TAGS.push(...JSON.parse(localTags));
    }
  }
}

function renderOptionList() {
  const selectGroup = newNoteForm.querySelector('#group-input');
  const selectTag = newNoteForm.querySelector('#tag-input');
  const selectGroup2 = updateNoteForm.querySelector('#group-input2');
  const selectTag2 = updateNoteForm.querySelector('#tag-input2');

  selectGroup.innerHTML = "";
  MEMORY_GROUPS.map(group => {
    selectGroup.innerHTML += `<option value="${group.slug}">${group.title}</option>`
    selectGroup2.innerHTML += `<option value="${group.slug}">${group.title}</option>`
  });

  selectTag.innerHTML = "";
  MEMORY_TAGS.map(tag => {
    selectTag.innerHTML += `<option value="${tag}">${tag}</option>`
    selectTag2.innerHTML += `<option value="${tag}">${tag}</option>`
  });
}

function renderGroupList() {
  MEMORY_GROUPS.map(group => {
    renderNewGroup(group);
  })
}

function viewNote(event) {
  // Siapkan DOM element
  const slugInput = updateNoteForm.querySelector('[name=slug-input]');
  const groupInput = updateNoteForm.querySelector('[name=group-input]');
  const tagInput = updateNoteForm.querySelector('[name=tag-input]');
  const titleInput = updateNoteForm.querySelector('[name=title]');
  const descInput = updateNoteForm.querySelector('[name=description]');

  // Tampilkan form view dan update note
  const note = JSON.parse(event.htmlElement.dataset.json);

  slugInput.value = note.slug;
  groupInput.value = note.group;
  tagInput.value = note.tag;
  titleInput.value = note.title;
  descInput.value = note.description;
  updateNoteBtn.click();
}

function removeElement(element) {
  element.parentElement.removeChild(element);
}

function deleteGroup(event) {
  event.stopPropagation();
  if (!confirm('Apakah anda yakin akan menghapus Group beserta Catatannya?')) return;

  const slug = event.target.dataset.slug;

  // Hapus group dan catatan didalamnya dari DOM
  const noteEl = mainContainer.querySelector(`#${slug}`);
  removeElement(noteEl)

  // Hapus group dari memory dan local storage
  const memory_groups = MEMORY_GROUPS.filter(group => group.slug !== slug);
  MEMORY_GROUPS.length = 0;
  MEMORY_GROUPS.push(...memory_groups);
  localStorage.setItem(GROUPS_KEY, JSON.stringify(MEMORY_GROUPS));

  // Hapus catatan dari memory dan local storage
  const memory_notes = MEMORY_NOTES.filter(note => note.group !== slug);
  MEMORY_NOTES.length = 0;
  MEMORY_NOTES.push(...memory_notes);
  localStorage.setItem(NOTES_KEY, JSON.stringify(MEMORY_NOTES));
}

function deleteNote(event) {
  event.stopPropagation();
  const slug = event.target.dataset.slug;

  // Hapus catatan dari DOM
  const noteEl = mainContainer.querySelector(`section[data-slug="${slug}"]`);
  removeElement(noteEl,)

  // Hapus catatan dari memory dan local storage
  const memory_notes = MEMORY_NOTES.filter(note => note.slug !== slug);
  MEMORY_NOTES.length = 0;
  MEMORY_NOTES.push(...memory_notes);
  localStorage.setItem(NOTES_KEY, JSON.stringify(MEMORY_NOTES));
}

function renderNoteList() {
  MEMORY_NOTES.map(note => {
    renderNewNote(note);
  })
}

function renderNewGroup(group) {
  const groupContainer = new DOMParser()
    .parseFromString(getGroupTemplate(group), "text/html")
    .body
    .firstElementChild;

  contentHeader.after(groupContainer);

  groupContainer.querySelector('.delete-group').addEventListener('click', deleteGroup)

  return groupContainer;
}

function renderUpdatedNote(note) {
  const groupContainer = document.querySelector(`#${note.group}`);

  // Hapus catatan sebelumnya
  const prevEl = groupContainer.querySelector(`section[data-slug=${note.slug}]`);
  removeElement(prevEl);

  return renderNewNote(note);
}

function renderNewNote(note) {
  const groupContainer = document.querySelector(`#${note.group}`);
  const header = groupContainer.querySelector('header');
  const htmlNewNote = document.createElement('section');
  htmlNewNote.innerHTML = getNoteTemplate(note);
  htmlNewNote.dataset.slug = note.slug;
  htmlNewNote.dataset.json = JSON.stringify(note);

  // Tambahkan catatan setelah header tapi sebagi catatan teratas
  header.after(htmlNewNote);

  // Tambahkan event listener
  htmlNewNote.addEventListener('click', (event) => {
    event.stopPropagation();
    event.htmlElement = htmlNewNote;
    viewNote(event);
  });
  htmlNewNote.querySelector('.delete-note').addEventListener('click', deleteNote)

  return htmlNewNote;
}

function saveNewTag(tag) {
  MEMORY_TAGS.push(tag);

  // Save to local storage
  localStorage.setItem(TAGS_KEY, JSON.stringify(MEMORY_TAGS));

  // Render to DOM
  renderOptionList();
}

function saveNewGroup(group) {

  const memory_groups = getLocalGroups();
  memory_groups.push(group);

  // Save to local storage
  localStorage.setItem(GROUPS_KEY, JSON.stringify(memory_groups));

  // Render to DOM
  renderOptionList();
  renderNewGroup(group);
}

function saveUpdatedNote(updatedNote) {

  const memory_notes = MEMORY_NOTES.filter(note => note.slug !== updatedNote.slug);
  MEMORY_NOTES.length = 0;
  MEMORY_NOTES.push(...memory_notes, updatedNote);

  // Save to local storage
  localStorage.setItem(NOTES_KEY, JSON.stringify(MEMORY_NOTES));

  // Render to DOM
  renderUpdatedNote(updatedNote)
}

function saveNewNote(note) {

  const memory_notes = getLocalNotes();
  memory_notes.push(note);

  // Save to local storage
  localStorage.setItem(NOTES_KEY, JSON.stringify(memory_notes));

  // Render to DOM
  renderNewNote(note)
}

function submitNewTag(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const tag = formData.get('tag-value');

  saveNewTag(tag);
  form.reset();
}

function submitNewGroup(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const group = {
    slug: getSlug(formData.get('group-title')),
    title: formData.get('group-title'),
    subtitle: formData.get('group-subtitle'),
  }

  saveNewGroup(group);
  form.reset();
}

function submitUpdatedNote(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const note = {
    updatedAt: Date.now(),
    slug: formData.get('slug-input'),
    group: formData.get('group-input'),
    tag: formData.get('tag-input'),
    title: formData.get('title'),
    description: formData.get('description'),
  }

  saveUpdatedNote(note);
  form.reset();
}

function submitNewNote(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const note = {
    updatedAt: Date.now(),
    slug: getSlug(formData.get('title')),
    group: formData.get('group-input'),
    tag: formData.get('tag-input'),
    title: formData.get('title'),
    description: formData.get('description'),
  }

  saveNewNote(note);
  form.reset();
}

function resetForm(event) {
  const form = event.target;
  const query = form.dataset?.toggler;
  const toggler = document.querySelector(query);
  toggler.click();
}

function initApp() {
  // Get data from local storage & store to variables
  loadMemory();

  // Render neccesary template
  renderOptionList();

  // Render group list
  renderGroupList();

  // Render note list
  renderNoteList();
}

// Render All notes when browser finished all loading
window.addEventListener("load", () => {
  initApp();
});