# LLM Playground

This repository contains the source code for the website [LLM Playground](https://llmplayground.net). LLM Playground is a web-based interface for testing various Large Language Models (LLMs).

## Project Structure

The project consists of the following main files:

- `index.html`: The main HTML file that structures the webpage.
- `s.js`: The JavaScript file that handles the functionality of the chat interface.
- `s.css`: The CSS file that styles the webpage.
- `discord.png`: An image file used for the Discord logo.
- `light.png`: An image file used for the light theme toggle.
- `favicon.png`: The favicon image for the website.

## Description

The LLM Playground allows users to:

- Select different LLMs for generating responses.
- Attach and process various file types (e.g., spreadsheets, documents, PDFs, PowerPoints, EPUBs, RTFs) as inputs for the models.
- Maintain a history of previous chats.
- Export and import chat histories.
- Edit, delete, and copy individual messages in the chat.
- Toggle between light and dark themes.
- Users can create shareable links for their chats using GitHub Gists, allowing others to view the chat history across different browsers and devices.

The interface also includes features for handling file drops, managing conversation history, and adjusting the layout dynamically based on user interactions.

## Pure JavaScript Implementation

This project is implemented using pure JavaScript, with minimal reliance on external libraries. The only external libraries used are for parsing various file types. The intention is to keep the project lightweight and free from unnecessary dependencies.

## Usage

To view and interact with the LLM Playground:

1. Clone this repository to your local machine.
2. Open `index.html` in a web browser.

No installation is required beyond cloning the repository and opening the HTML file in a browser.

## License

This project is licensed under the MIT License.

## Features

### Supported File Types

The LLM Playground supports the following file types for attachment and processing:

- `.xls`, `.xlsx`, `.csv`: Spreadsheets
- `.docx`: Microsoft Word documents
- `.pdf`: PDF files
- `.pptx`: PowerPoint presentations
- `.epub`: EPUB files
- `.rtf`: Rich Text Format files
- `.txt`: Plain text files

### Theme Toggle

Users can toggle between light and dark themes using the light theme toggle button. The selected theme preference is saved to the local storage.

### Chat Management

- **Chat History:** Users can view and manage their previous chats.
- **Export/Import:** Users can export their chat histories to the clipboard and import them from the clipboard.
- **Search:** Users can search through their chat data.

### Message Management

- **Edit/Delete/Copy:** Users can edit, delete, or copy individual messages.
- **Show More/Less:** For long messages, users can toggle between showing the full content and a truncated version.

### Settings

Users can configure the following settings:

- **System Prompt:** Customize the system prompt.
- **Max Tokens:** Set the maximum number of tokens for the model responses.

The settings are accessible through the settings button in the chat interface.