// Zenia Chat JavaScript with Fixed Delete Functionality and Auto-Titling
document.addEventListener('DOMContentLoaded', function() {
    console.log('Zenia chat initialized');
    
    // DOM Elements - FIXED: Corrected IDs to match HTML
    const chatMessages = document.getElementById('zenia-chat-messages');
    const userInput = document.getElementById('zenia-user-input');
    const sendButton = document.getElementById('zenia-send-button');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatHistory = document.getElementById('chat-history');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const modalCloseBtn = document.querySelector('.modal-close');
    
    // Configuration
    const MAIN_WEBHOOK_URL = 'https://hook.eu2.make.com/09yhms39soctgeevidnxcqvyum769ouc';
    const API_KEY = window.ZENIA_API_KEY || 'Zenia'; // Fallback if not set
    
    // Chat state management
    let currentChatId = 'chat-' + Date.now();
    let chats = {};
    let chatToDelete = null;
    
    // Initialize with a default chat
    chats[currentChatId] = {
        messages: [
            {
                text: "Hello, I'm Zenia. I'm here to be your ears👂. Tell me what happened to the Colourful mind today✨?",
                isUser: false,
                sender: 'Zenia',
                time: new Date()
            }
        ],
        title: "New conversation"
    };
    
    // Initialize the chat interface
    function initChat() {
        // Load chats from localStorage if available
        loadChatsFromStorage();
        updateChatHistory();
        renderMessages();
        setupEventListeners();
        userInput.focus();
    }
    
    // Load chats from localStorage
    function loadChatsFromStorage() {
        const savedChats = localStorage.getItem('Zenia-chats'); // Fixed typo
        if (savedChats) {
            try {
                chats = JSON.parse(savedChats);
                // Set current chat to the most recent one
                const chatIds = Object.keys(chats);
                if (chatIds.length > 0) {
                    currentChatId = chatIds[chatIds.length - 1];
                }
            } catch (e) {
                console.error('Error loading chats from storage:', e);
                // If parsing fails, start fresh
                chats = {};
                chats[currentChatId] = {
                    messages: [
                        {
                            text: "Hello, I'm Zenia. I'm here to be your ears👂. Tell me what happened to the Colourful mind today✨?",
                            isUser: false,
                            sender: 'Zenia',
                            time: new Date()
                        }
                    ],
                    title: "New conversation"
                };
            }
        }
    }
    
    // Save chats to localStorage
    function saveChatsToStorage() {
        try {
            localStorage.setItem('Zenia-chats', JSON.stringify(chats)); // Fixed typo
        } catch (e) {
            console.error('Error saving chats to storage:', e);
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Send message events
        sendButton.addEventListener('click', handleSendMessage);
        userInput.addEventListener('keydown', handleKeyDown);
        
        // New chat event
        newChatBtn.addEventListener('click', createNewChat);
        
        // Modal events
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
        }
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        }
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', hideDeleteConfirmation);
        }
        if (deleteModal) {
            deleteModal.addEventListener('click', function(e) {
                if (e.target === deleteModal) {
                    hideDeleteConfirmation();
                }
            });
        }
        
        // Auto-resize textarea
        userInput.addEventListener('input', autoResizeTextarea);
    }
    
    // Handle keyboard events
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }
    
    // Auto-resize textarea
    function autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        if (this.scrollHeight > 150) {
            this.style.overflowY = 'auto';
        } else {
            this.style.overflowY = 'hidden';
        }
    }
    
    // Handle send message
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true, 'You');
            userInput.value = '';
            userInput.style.height = 'auto';
            
            // Generate title from user's first message in this conversation
            if (chats[currentChatId].title === "New conversation" || 
                chats[currentChatId].title === "Welcome") {
                generateConversationTitle(message);
            }
            
            sendMessageToZenia(message);
        }
    }
    
    // Generate a title for the conversation based on user's message
    function generateConversationTitle(userMessage) {
        // Extract key phrases to create a meaningful title
        let title = "Chat discussion";
        
        // Simple title generation logic (can be enhanced)
        if (userMessage.length > 5) {
            // Take first few meaningful words
            const words = userMessage.split(/\s+/).filter(word => word.length > 3);
            if (words.length > 0) {
                title = words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
            } else {
                // If all words are short, use first 15 characters
                title = userMessage.substring(0, 20) + (userMessage.length > 20 ? '...' : '');
            }
            
            // Capitalize first letter
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }
        
        // Update chat title
        chats[currentChatId].title = title;
        updateChatHistory();
        saveChatsToStorage();
        
        return title;
    }
    
    // Crisis detection function
    function detectCrisis(message) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'want to die', 'end it all',
            'depressed', 'hopeless', 'worthless', 'can\'t go on',
            'self harm', 'hurt myself', 'no reason to live',
        ];
        
        return crisisKeywords.some(keyword => 
            message.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    // Crisis response message
    function getCrisisResponse() {
        return "I am deeply concerned by what you're sharing with me. Please know that your life is precious and there are people who want to help you right now.\n\nIt is absolutely essential that you speak immediately with a trained crisis counselor who can provide the support you need. They are available 24/7, it is completely free and confidential.\n\n**Please, right now, contact the Vandrevala Foundation:**\n- **Call or WhatsApp:** +91 9999 666 555\n- **Website:** https://www.vandrevalafoundation.com\n\nYou do not have to go through this alone. Please reach out to them this very moment.";
    }
    
    // Fallback AI response simulation
    async function simulateAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        if (detectCrisis(message)) {
            return getCrisisResponse();
        }
        
        // Generic empathetic responses as fallback
        const fallbackResponses = [
            "I hear you. It sounds like you're going through a lot right now. Would you like to talk more about it?",
            "Thank you for sharing that with me. I'm here to listen and support you through whatever you're experiencing.",
            "I appreciate you opening up to me. It takes courage to share what's on your mind.",
            "I'm listening. Please continue sharing what's in your heart - I'm here for you without judgment.",
            "That sounds challenging. How has this been affecting you day to day?",
            "I can sense this is weighing heavily on you. Would it help to explore this further together?",
            "Thank you for trusting me with this. Remember, you don't have to face things alone.",
            "I'm here with you. Whatever you're feeling is valid and important."
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    // Update chat history sidebar
    function updateChatHistory() {
        if (!chatHistory) return;
        
        chatHistory.innerHTML = '<div class="history-title">Recent Conversations</div>';
        
        // Sort chats by most recent first (based on last message time)
        const sortedChatIds = Object.keys(chats).sort((a, b) => {
            const timeA = new Date(chats[a].messages[chats[a].messages.length - 1].time);
            const timeB = new Date(chats[b].messages[chats[b].messages.length - 1].time);
            return timeB - timeA;
        });
        
        sortedChatIds.forEach(chatId => {
            const chat = chats[chatId];
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.dataset.chatId = chatId;
            
            if (chatId === currentChatId) {
                historyItem.classList.add('active');
            }
            
            const historyContent = `
                <div class="history-content">
                    <div class="history-preview">${chat.title}</div>
                    <div class="history-time">${formatTime(chat.messages[chat.messages.length - 1].time)}</div>
                </div>
                <div class="history-menu">
                    <button class="history-menu-btn">⋯</button>
                    <div class="history-menu-dropdown">
                        <div class="history-menu-item delete" data-action="delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Delete
                        </div>
                    </div>
                </div>
            `;
            
            historyItem.innerHTML = historyContent;
            
            // Add click event to load chat
            const historyContentEl = historyItem.querySelector('.history-content');
            if (historyContentEl) {
                historyContentEl.addEventListener('click', () => {
                    loadChat(chatId);
                });
            }
            
            // Add menu toggle event
            const menuBtn = historyItem.querySelector('.history-menu-btn');
            const dropdown = historyItem.querySelector('.history-menu-dropdown');
            
            if (menuBtn && dropdown) {
                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                    
                    // Close other open dropdowns
                    document.querySelectorAll('.history-menu-dropdown.show').forEach(item => {
                        if (item !== dropdown) {
                            item.classList.remove('show');
                        }
                    });
                });
                
                // Add delete event
                const deleteBtn = historyItem.querySelector('.history-menu-item.delete');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showDeleteConfirmation(chatId);
                        dropdown.classList.remove('show');
                    });
                }
            }
            
            chatHistory.appendChild(historyItem);
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.history-menu')) {
                document.querySelectorAll('.history-menu-dropdown.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }
    
    // Show delete confirmation modal
    function showDeleteConfirmation(chatId) {
        chatToDelete = chatId;
        if (deleteModal) {
            deleteModal.classList.add('show');
        }
    }
    
    // Hide delete confirmation modal
    function hideDeleteConfirmation() {
        if (deleteModal) {
            deleteModal.classList.remove('show');
        }
        chatToDelete = null;
    }
    
    // Handle confirm delete
    function handleConfirmDelete() {
        if (chatToDelete) {
            deleteChat(chatToDelete);
            hideDeleteConfirmation();
        }
    }
    
    // Delete a chat - FIXED VERSION
    function deleteChat(chatId) {
        if (chats[chatId]) {
            // Delete the chat from our data structure
            delete chats[chatId];
            
            // Save the updated chats to storage
            saveChatsToStorage();
            
            // If we're deleting the current chat, create a new one
            if (currentChatId === chatId) {
                createNewChat();
            } else {
                // Just update the history view
                updateChatHistory();
            }
            
            console.log('Chat deleted:', chatId);
        }
    }
    
    // Load a specific chat
    function loadChat(chatId) {
        if (chats[chatId]) {
            currentChatId = chatId;
            renderMessages();
            updateChatHistory();
        }
    }
    
    // Create a new chat
    function createNewChat() {
        const newChatId = 'chat-' + Date.now();
        currentChatId = newChatId;
        
        chats[newChatId] = {
            messages: [
                {
                    text: "Hello, I'm Zenia. I'm here to be your ears👂. Tell me what happened to the Colourful mind today✨?",
                    isUser: false,
                    sender: 'Zenia',
                    time: new Date()
                }
            ],
            title: "New conversation"
        };
        
        // Save to storage
        saveChatsToStorage();
        
        renderMessages();
        updateChatHistory();
        userInput.focus();
    }
    
    // Format time for display
    function formatTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    
    // Render all messages for current chat
    function renderMessages() {
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        
        if (chats[currentChatId]) {
            chats[currentChatId].messages.forEach(msg => {
                addMessage(msg.text, msg.isUser, msg.sender, msg.time, false);
            });
        }
    }
    
    function addMessage(text, isUser = false, sender = null, time = new Date(), save = true) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const messageContent = `
            <div class="message-content">
                ${sender ? `<div class="message-sender">${sender}</div>` : ''}
                <div class="message-text">${text}</div>
                <div class="message-time">${new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Save to current chat if needed
        if (save && chats[currentChatId]) {
            chats[currentChatId].messages.push({
                text,
                isUser,
                sender: isUser ? 'You' : 'Zenia',
                time
            });
            
            // Save to storage
            saveChatsToStorage();
        }
    }
    
    async function sendMessageToZenia(message) {
        try {
            sendButton.disabled = true;
            sendButton.innerHTML = '<div class="loading-spinner"></div>';
            
            // Client-side crisis detection - IMMEDIATE RESPONSE
            if (detectCrisis(message)) {
                // Small delay to simulate processing
                await new Promise(resolve => setTimeout(resolve, 1000));
                const crisisResponse = getCrisisResponse();
                addMessage(crisisResponse, false, 'Zenia');
                return; // Stop here, don't call the webhook
            }
            
            const requestData = {
                userId: 'user-' + Date.now(),
                message: message
            };
            
            console.log('Sending request to webhook...');
            
            const response = await fetch(MAIN_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-make-apikey': API_KEY
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // First, try to get the response as text to see what we're dealing with
            const responseText = await response.text();
            console.log('Raw response:', responseText);
            
            let replyText = '';
            
            // Try to parse as JSON first
            try {
                const data = JSON.parse(responseText);
                console.log('Parsed JSON:', data);
                
                // Handle different JSON response formats
                if (data && data.reply) {
                    replyText = data.reply;
                } else if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    replyText = data.choices[0].message.content;
                } else if (data && data.message) {
                    replyText = data.message;
                } else if (data && typeof data === 'object') {
                    replyText = JSON.stringify(data);
                } else {
                    replyText = responseText;
                }
            } catch (jsonError) {
                // If not JSON, use the raw text
                console.log('Response is not JSON, using raw text');
                replyText = responseText;
            }
            
            // Check if webhook is echoing the user's message
            if (replyText.trim().toLowerCase() === message.trim().toLowerCase()) {
                throw new Error("Webhook is echoing user message instead of generating response");
            }
            
            // If we got a valid response, display it
            if (replyText && replyText.trim() !== '') {
                console.log('Displaying reply:', replyText);
                addMessage(replyText, false, 'Zenia');
            } else {
                throw new Error("Empty response from server");
            }
            
        } catch (error) {
            console.error('Error details:', error);
            
            // Use simulated response as fallback
            const simulatedResponse = await simulateAIResponse(message);
            addMessage(simulatedResponse, false, 'Zenia');
        } finally {
            sendButton.disabled = false;
            sendButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    }
    
    // Initialize the chat
    initChat();
    console.log('Zenia chat initialized successfully');
});