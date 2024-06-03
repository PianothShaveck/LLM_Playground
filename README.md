# LLM Playground

This repository contains the source code for [LLM Playground](https://llmplayground.net), a web-based interface for testing various Large Language Models (LLMs).

## Project Structure

- **index.html**: Main HTML file structuring the webpage.
- **s.js**: JavaScript file handling chat interface functionality.
- **s.css**: CSS file styling the webpage.
- **Images**: `discord.png`, `light.png`, `favicon.png`.

## Description

LLM Playground offers users an intuitive interface to interact with a variety of LLMs. Supports streaming.
It's designed with a focus on a pure JavaScript and CSS implementation, minimizing reliance on external libraries for a lightweight and efficient experience. 

**Key features include:**

- **Model Selection:** Choose from popular LLMs and custom endpoints.
- **Streaming Support:** Interact with models that stream responses in real-time.
- **File Processing:** Attach and process various file types, including spreadsheets, documents, PDFs, PowerPoints, EPUBs, RTFs, and plain text files.
- **Chat Management:** Maintain, export, and import chat histories. Search through past conversations.
- **Message Control:** Edit, delete, copy, and change the role of individual messages.
- **Theming:** Toggle between light and dark themes.
- **System Prompts:** Save, load, and customize system prompts.
- **Web Search:** Enable, disable, or automate web searches to enhance LLM responses.
- **Parameter Control:** Adjust max tokens, temperature, and top_p.

## Pure JavaScript Implementation

This project is built with pure JavaScript, with minimal external libraries used only for parsing specific file types. This approach ensures a lightweight, fast-loading application with no unnecessary dependencies.

## Project Roadmap and Known Issues

For a detailed project roadmap and a list of known issues, please refer to the [TODO.md](TODO.md) file.

## Usage

1. Clone the repository.
2. Open `index.html` in a web browser.

No additional installation is required.

## License

This project is licensed under the MIT License.