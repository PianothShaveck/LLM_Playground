# LLM Playground

This repository contains the source code for [LLM Playground](https://llmplayground.net), a web-based interface for testing various Large Language Models (LLMs).

## Project Structure

- **index.html**: Main HTML file structuring the webpage.
- **s.js**: JavaScript file handling chat interface functionality.
- **s.css**: CSS file styling the webpage.
- **Images**: `discord.png`, `light.png`, `favicon.png`.

## Description

LLM Playground offers users an intuitive interface to:

- Select and test different streaming LLMs.
- Attach and process various file types (e.g., spreadsheets, documents, PDFs, PowerPoints, EPUBs, RTFs).
- Maintain, export, and import chat histories.
- Edit, delete, and copy individual messages.
- Toggle between light and dark themes.
- Create shareable links for chats using GitHub Gists.
- Change the role of messages between user, assistant, and system.
- Enable, disable, or automate web searches to enrich responses.
- Save and load system prompts.

## Pure JavaScript Implementation

This project is implemented using pure JavaScript, with minimal reliance on external libraries. The only external libraries used are for parsing various file types. The intention is to keep the project lightweight and free from unnecessary dependencies.

## Key Features

### File Attachments

Supports attachment and processing of:
- Spreadsheets (`.xls`, `.xlsx`, `.csv`)
- Word documents (`.docx`)
- PDF files (`.pdf`)
- PowerPoint presentations (`.pptx`)
- EPUB files (`.epub`)
- Rich Text Format files (`.rtf`)
- Plain text files (`.txt` and all other plain text extensions)

### Theme Toggle

Toggle between light and dark themes, with preferences saved in local storage.

### Chat Management

- **Chat History**: View and manage previous chats.
- **Export/Import**: Export chat histories to clipboard and import from clipboard.
- **Search**: Search through chat data.

### Message Management

- **Edit/Delete/Copy**: Edit, delete, or copy individual messages.
- **Show More/Less**: Toggle between showing full and truncated content for long messages.
- **Role Change**: Change the role of messages between user, assistant, and system.

### Settings

Configure system prompts and set the maximum number of tokens for model responses.

## Usage

1. Clone the repository.
2. Open `index.html` in a web browser.

No additional installation is required.

## License

This project is licensed under the MIT License.
