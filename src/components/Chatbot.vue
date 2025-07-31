<template>
  <div class="chatbot-container">
    <div class="chat-widget" v-if="isOpen">
      <div class="chat-header">
        <div class="title-section">
          <svg class="chat-icon" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
          </svg>
          <span>AI Asistent</span>
        </div>
        <button class="close-btn" @click="toggleChat">✕</button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['bubble', msg.sender]">
          {{ msg.text }}
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Spýtaj sa čokolvek..."
        />
        <button @click="sendMessage" class="send-button">
          <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>

    <button v-else class="floating-button" @click="toggleChat">
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
        <path d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Component } from 'vue-property-decorator';
import { Watch } from 'vue-property-decorator';
import axios from "axios";

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

@Component
export default class ChatbotWidget extends Vue {
  isOpen = false;
  userInput = '';
  messages: Message[] = [
    { sender: 'bot', text: "Ahoj! Som tvoj AI asistent. Ako ti môžem pomôcť?" }
  ];

  @Watch('isOpen')
  onIsOpenChanged(newVal: boolean) {
    if (newVal) {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const messageText = this.userInput;
    this.messages.push({ sender: 'user', text: messageText });
    this.userInput = '';

    this.$nextTick(() => {
      this.scrollToBottom();
    });

    try {
      const response = await axios.post(
        "https://mychalkosss.app.n8n.cloud/webhook/f9f61e67-0252-4b31-8294-d21cbfc61455",
        {
          message: messageText
        }
      );

      const botReply = response.data.output || "Error.";

      this.messages.push({ sender: 'bot', text: botReply });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    } catch (error) {
      console.error('Webhook error:', error);
      this.messages.push({ sender: 'bot', text: 'Oops, nastala chyba!' });

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom() {
    const container = this.$refs.messagesContainer as HTMLElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Arial', sans-serif;
}

.chat-widget {
  width: 380px;
  height: 420px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  background-color: #AA251A;
  color: white;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 15px;
}

.chat-icon {
  width: 20px;
  height: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

/* Messages */
.messages {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f8f8f8;
}

.bubble {
  padding: 10px 14px;
  border-radius: 16px;
  max-width: 75%;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(26, 3, 3, 0.06);
}

.bubble.bot {
  background-color: rgba(196, 197, 199, 0.75);
  color: #333;
  align-self: flex-start;
  border-top-left-radius: 4px;
  text-align: left;
}

.bubble.user {
  background-color: #AA251A;
  color: white;
  align-self: flex-end;
  border-top-right-radius: 4px;
}

/* Input */
.input-area {
  display: flex;
  padding: 14px;
  border-top: 1px solid #eee;
  gap: 10px;
  background-color: white;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
}

/* Send Button */
.send-button {
  background-color: #AA251A;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover {
  background-color: #AA251A;
}

/* Floating Button */
.floating-button {
  background-color: #AA251A;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.floating-button svg {
  width: 24px;
  height: 24px;
}
</style>
