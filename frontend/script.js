let currentMode = 'chat';
let isDark = true;
const userId = 'user_' + Math.random().toString(36).substr(2, 9);

// THEME TOGGLE
function toggleTheme() {
  isDark = !isDark;
  document.body.className = isDark ? 'dark' : 'light';
  document.getElementById('themeIcon').className = isDark ? 'ti ti-moon' : 'ti ti-sun';
  document.getElementById('themeLabel').textContent = isDark ? 'Dark' : 'Light';
}

// SWITCH MODE
function switchMode(mode) {
  currentMode = mode;
  document.getElementById('pageTitle').textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.cap-card').forEach(c => c.classList.remove('active'));

  const placeholder = {
    chat: 'Ask Trust AI anything...',
    coding: 'Describe what you want to code...',
    research: 'What do you want to research?',
    design: 'Describe your design request...',
    math: 'Enter your math or science problem...',
    image: 'Describe the image you want...',
    voice: 'Type text for Trust AI to speak...',
    academic: 'Ask any academic question...',
    translate: 'Enter text to translate...',
    documents: 'Ask about your document...',
    projects: 'Ask about your projects...'
  };

  document.getElementById('inputField').placeholder = placeholder[mode] || 'Ask Trust AI anything...';
}

// HANDLE KEY
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// SET TAB
function setTab(el, tab) {
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (tab === 'coder') switchMode('coding');
  else if (tab === 'research') switchMode('research');
  else switchMode('chat');
}

// ADD MESSAGE TO UI
function addMessage(content, isUser = false, imageUrl = null) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = `msg ${isUser ? 'user' : ''}`;

  let bubbleContent = '';

  if (imageUrl) {
    bubbleContent = `${content}<br><img src="${imageUrl}" class="generated-image" alt="Generated image"/>`;
  } else {
    bubbleContent = formatMessage(content);
  }

  div.innerHTML = `
    <div class="msg-avatar ${isUser ? 'user-av' : 'ai-av'}">${isUser ? 'YOU' : 'TA'}</div>
    <div class="msg-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}">${bubbleContent}</div>
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// FORMAT MESSAGE (code blocks)
function formatMessage(text) {
  return text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    return `<div class="code-block">
      <div class="code-header">
        <span class="code-lang">${lang || 'code'}</span>
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      </div>
      <pre>${escapeHtml(code.trim())}</pre>
    </div>`;
  }).replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function copyCode(btn) {
  const code = btn.parentElement.nextElementSibling.textContent;
  navigator.clipboard.writeText(code);
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 2000);
}

// TYPING INDICATOR
function showTyping() {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg';
  div.id = 'typing';
  div.innerHTML = `
    <div class="msg-avatar ai-av">TA</div>
    <div class="msg-bubble ai-bubble">
      <div class="typing">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

// SEND MESSAGE
async function sendMessage() {
  const input = document.getElementById('inputField');
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, true);
  input.value = '';
  showTyping();

  try {
    // Everything goes through /api/chat — auto detection handles the rest!
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId })
    });

    const data = await res.json();
    hideTyping();

    if (data.success) {
      if (data.imageUrl) {
        addMessage(data.response, false, data.imageUrl);
      } else {
        addMessage(data.response);
      }
    } else {
      addMessage('Sorry, something went wrong. Please try again.');
    }

  } catch (error) {
    hideTyping();
    addMessage('Connection error. Make sure the server is running with: npm start');
  }
}

// VOICE
async function speakText(text) {
  try {
    const res = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
    addMessage(`Speaking: "${text}"`);
  } catch (error) {
    addMessage('Voice feature requires ElevenLabs API key.');
  }
}

// VOICE INPUT
function startVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    addMessage('Voice input not supported in this browser. Use Chrome.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.onresult = (e) => {
    document.getElementById('inputField').value = e.results[0][0].transcript;
    sendMessage();
  };
  recognition.start();
  addMessage('Listening... speak now!');
}

// FILE UPLOAD
async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  addMessage(`Uploading: ${file.name}`, true);
  showTyping();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('message', 'Analyze and summarize this document');

  try {
    const res = await fetch('/api/documents/analyze', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    hideTyping();
    addMessage(data.response || 'Could not analyze the document.');
  } catch (error) {
    hideTyping();
    addMessage('Document upload failed. Check your server.');
  }
}
// MOBILE NAV
function setMobileNav(el) {
  document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}