document.addEventListener('DOMContentLoaded', function() {
    /**
     * Loads a script from the specified source and executes the callback function when the script is loaded.
     *
     * @param {string} src - The URL of the script to load.
     * @param {function} callback - The function to execute when the script is loaded.
     */
    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }
    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js', () => {
        marked.setOptions({
            sanitizer: true,
            sanitize: true,
        });
        loadChatFromUrl();
        loadSettings();
        updateMessageCounters();
        console.log('marked loaded');
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js', () => {console.log('xlsx loaded');});
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js', () => {console.log('mammoth loaded');});
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js', () => {
        var script = document.createElement('script');
        script.innerHTML = 'pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";';
        document.head.appendChild(script);
        console.log('pdfjs loaded');
    });
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js', () => {console.log('jszip loaded');});
    loadScript('https://cdn.jsdelivr.net/npm/epubjs@0.3.88/dist/epub.min.js', () => {console.log('epubjs loaded');});

    function checkApiStatus() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        fetch('https://api.discord.rocks/models', {
            method: 'GET',
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error("API models returned error status:", response.status);
                document.getElementById('apiStatusMessage').style.display = 'block';
                return;
            } 
            return response.json();
        })
        .then(jsonData => {
            if (jsonData) {
                const modelIds = jsonData.data.map(item => item.id);
                populateDropdown(modelIds, 'Other models');
            }})
        .catch(e => {
            document.getElementById('apiStatusMessage').style.display = 'block';
            if (e.name === 'AbortError') {
                console.error('Fetch request timed out.');
                document.getElementById('apiStatusMessage').textContent = 'Request to api.discord.rocks timed out.'
            } else {
                console.error('Error fetching GPT API data:', e);
            }
        });
    }
    /**
     * Populates a dropdown element with a list of model IDs and a separator option.
     *
     * @param {Array<string>} modelIds - An array of model IDs to populate the dropdown with.
     * @param {string} separator - The text content of the separator option.
     */
    function populateDropdown(modelIds, separator) {
        const dropdown = document.getElementById('modelDropdown');
        const defaultOption = document.createElement('option');
        defaultOption.textContent = separator;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dropdown.appendChild(defaultOption);
        modelIds.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = id;
            dropdown.appendChild(option);
        });
        dropdown.selectedIndex = 1
    }
    checkApiStatus();
    let abortController = new AbortController();
    const messageBox = document.getElementById('messageBox');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    messageBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (isMobile || event.shiftKey) {
                return;
            } else {
                event.preventDefault();
                sendAndReceiveMessage();
            }
        }
    });
    const fileContainer = document.getElementById('fileContainer');
    let attachedFiles = [];
    /**
     * Prevents the default behavior of an event and stops its propagation.
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        messageBox.addEventListener(eventName, preventDefaults, false);
    });
    /**
     * Sets the border style of the messageBox element to a dashed line with a color of #8f564c.
     */
    function highlight(e) {
        messageBox.style.border = '2px dashed #8f564c';
    }
    /**
     * Removes the highlight border from the messageBox element.
     */
    function unhighlight(e) {
        messageBox.style.border = '';
    }
    ['dragenter', 'dragover'].forEach(eventName => {
        messageBox.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        messageBox.addEventListener(eventName, unhighlight, false);
    });
    messageBox.addEventListener('drop', handleDrop, false);
    /**
     * Handles the drop event and processes the dropped files.
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
        adjustTextareaHeight(messageBox);
    }
    /**
     * Handles the files dropped or selected in the file input.
     *
     * @param {FileList} files - The list of files to handle.
     */
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!attachedFiles.some(attachedFile => attachedFile.name === file.name)) {
                const extension = file.name.split('.').pop().toLowerCase();
                if (['xls', 'xlsx', 'csv', 'docx', 'pdf', 'pptx', 'epub', 'rtf'].includes(extension)) {
                    attachedFiles.push(file);
                    createFileBubble(file.name, fileContainer);
                } else {
                    const reader = new FileReader();
                    /**
                     * Handles the load event of the FileReader.
                     */
                    reader.onload = function(e) {
                        const arr = new Uint8Array(e.target.result);
                        const decoder = new TextDecoder('utf-8', { fatal: true });
                        try {
                            decoder.decode(arr);
                            attachedFiles.push(file);
                            createFileBubble(file.name, fileContainer);
                        } catch (e) {
                            alert(`File "${file.name}" is not a supported text, rtf, spreadsheet, docx, pptx, pdf or epub file.`);
                        }
                    };
                    /**
                     * Handles the error event of the FileReader. Displays an alert with an error message indicating the failure to read the file.
                     */
                    reader.onerror = function(e) {
                        alert(`Failed to read file: ${file.name}.\n${e.message}`);
                    };
                    reader.readAsArrayBuffer(file.slice(0, 100));
                }
            } else {
                alert(`File "${file.name}" is already attached.`);
            }
        }
        fileContainer.style.display = 'flex';
        fileContainer.style.marginBottom = '10px';
    }
    /**
     * Parses a spreadsheet file and returns a promise that resolves with the markdown table representation of the first sheet of the parsed workbook.
     *
     * @param {File} file - The spreadsheet file to parse.
     * @return {Promise<string>} A promise that resolves with the markdown table representation of the first sheet of the parsed workbook.
     */
    function parseSpreadsheet(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Handles the onload event of the FileReader. Reads the file data, parses it as an XLSX workbook,
             * extracts the first sheet, converts it to a markdown table, and resolves the promise with the
             * resulting markdown table.
             *
             * @return {Promise<string>} A promise that resolves with the markdown table representation of the
             *                          first sheet of the parsed workbook.
             */
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = convertToMarkdownTable(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }));
                resolve(worksheet);
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Converts a 2D array of data into a markdown table.
     *
     * @param {Array<Array<any>>} data - The 2D array of data to be converted into a markdown table.
     * @return {string} The markdown table representation of the input data.
     */
    function convertToMarkdownTable(data) {
        if (data.length === 0) return '';
        const header = data[0];
        const headerRow = `| ${header.join(' | ')} |\n`;
        const separatorRow = `| ${header.map(() => '---').join(' | ')} |\n`;
        const contentRows = data.slice(1).map(row => `| ${row.join(' | ')} |\n`).join('');
        return headerRow + separatorRow + contentRows;
    }
    /**
     * Parses a DOCX file and returns the extracted text as a promise.
     *
     * @param {File} file - The DOCX file to be parsed.
     * @return {Promise<string>} A promise that resolves with the extracted text from the DOCX file. If the parsing fails, the promise is rejected with an error message.
     */
    function parseDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                mammoth.extractRawText({ arrayBuffer: event.target.result })
                    .then(result => {
                        resolve(result.value);
                    })
                    .catch(e => {
                        reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                    });
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses a PowerPoint file (.pptx) and extracts the text content from each slide.
     *
     * @param {File} file - The PowerPoint file to parse.
     * @return {Promise<string>} A promise that resolves with the concatenated text content of all slides in the file.
     */
    function parsePptx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Sets an event handler for the `load` event of the `reader` object.
             * When the event is triggered, it loads the contents of the ZIP file
             * asynchronously using JSZip library. It then extracts the text content
             * from each slide in the ZIP file and resolves the promise with the
             * concatenated text content. If there is an error parsing the slides or
             * loading the ZIP file, it rejects the promise with an appropriate error
             * message.
             *
             * @param {Event} event - The event object containing the loaded data.
             * @return {Promise<string>} A promise that resolves with the concatenated
             * text content of all slides in the ZIP file.
             */
            reader.onload = function(event) {
                const zip = new JSZip();
                zip.loadAsync(event.target.result)
                    .then(function(zip) {
                        const slidePromises = [];
                        zip.folder('ppt/slides').forEach((relativePath, file) => {
                            slidePromises.push(file.async('string'));
                        });
                        Promise.all(slidePromises).then(slides => {
                            let textContent = '';
                            slides.forEach(slide => {
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(slide, 'application/xml');
                                const texts = xmlDoc.getElementsByTagName('a:t');
                                for (let i = 0; i < texts.length; i++) {
                                    textContent += texts[i].textContent + '\n';
                                }
                            });
                            resolve(textContent.trim());
                        }).catch(e => {
                            reject(new Error(`Failed to parse slides: ${e.message}`));
                        });
                    }).catch(e => {
                        reject(new Error(`Failed to load ZIP: ${e.message}`));
                    });
            };
            /**
             * Sets an error handler for the FileReader.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses a PDF file and returns its trimmed text content.
     *
     * @param {File} file - The PDF file to be parsed.
     * @return {Promise<string>} A promise that resolves with the trimmed text content of the PDF file.
     * @throws {Error} If there is an error parsing the PDF file.
     */
    function parsePdf(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Asynchronously handles the load event of the FileReader by parsing a PDF file.
             *
             * @param {Event} event - The load event object.
             * @return {Promise<string>} A promise that resolves with the trimmed text content of the PDF file.
             * @throws {Error} If there is an error parsing the PDF file.
             */
            reader.onload = async function (event) {
                try {
                    const arrayBuffer = event.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const pdfDoc = await pdfjsLib.getDocument({data: uint8Array}).promise;
                    let textContent = '';
                    const numPages = pdfDoc.numPages;
                    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                        const page = await pdfDoc.getPage(pageNumber);
                        const textContentItems = (await page.getTextContent()).items;
                        const pageText = textContentItems.map(item => item.str).join('\n');
                        textContent += pageText + '\n\n';
                    }
                    resolve(textContent.trim());
                } catch (e) {
                    reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                }
            };
            /**
             * Sets an error handler for the FileReader.
             */
            reader.onerror = function (e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses the given EPUB file and extracts the text content of each chapter.
     *
     * @param {File} file - The EPUB file to be parsed.
     * @return {Promise<string>} A promise that resolves with the concatenated text content of all chapters.
     * @throws {Error} If there is an error parsing the chapters or loading the EPUB file.
     */
    function parseEpub(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            /**
             * Handles the load event of the FileReader. Parses the loaded EPUB file and extracts the text content of each chapter.
             *
             * @param {Event} event - The load event object.
             * @return {Promise<string>} A promise that resolves with the concatenated text content of all chapters.
             * @throws {Error} If there is an error parsing the chapters or loading the EPUB file.
             */
            reader.onload = function(event) {
                const epub = ePub(event.target.result);
                epub.ready.then(() => {
                    const spineItems = epub.spine.spineItems;
                    const chaptersPromises = spineItems.map(item => {
                        return item.load(epub.load.bind(epub)).then(() => {
                            return item.render();
                        }).then(rendered => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(rendered, "text/html");
                            return doc.body.textContent.trim();
                        });
                    });
                    Promise.all(chaptersPromises).then(chapters => {
                        const textContent = chapters.join('\n\n');
                        resolve(textContent);
                    }).catch(e => {
                        reject(new Error(`Failed to parse chapters: ${e.message}`));
                    });
                }).catch(e => {
                    reject(new Error(`Failed to load EPUB: ${e.message}`));
                });
            };
            /**
             * Handles the error event of the FileReader. Rejects the promise with an error message
             * indicating the failure to read the file.
             */
            reader.onerror = function(e) {
                reject(new Error(`Failed to read file "${file.name}": ${e.message}`));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    /**
     * Parses an RTF string and returns a parsed version with special characters replaced and unnecessary formatting removed.
     *
     * @param {string} rtf - The RTF string to parse.
     * @return {string} The parsed RTF string.
     */
    function parseRtf(rtf) {
        return rtf.replace(/\\par[d]?/g, '\n')
                  .replace(/\\'[0-9a-f]{2}/gi, (match) => String.fromCharCode(parseInt(match.slice(2), 16)))
                  .replace(/\\[a-z]+\d* ?/gi, '')
                  .replace(/[{\\}]/g, '')
                  .replace(/\n{2,}/g, '\n');
    }
    /**
     * Truncates the given file name to a specified maximum length and appends an ellipsis if necessary.
     *
     * @param {string} fileName - The name of the file to truncate.
     * @param {number} [maxLength=8] - The maximum length of the truncated file name. Defaults to 8.
     * @return {string} The truncated file name.
     */
    function truncateFileName(fileName, maxLength = 8) {
        const [name, ext] = fileName.split('.');
        if (name.length <= maxLength) {
            return fileName;
        }
        return `${name.substring(0, maxLength)}...${ext}`;
    }
    /**
     * Creates a file bubble element and appends it to the given container.
     *
     * @param {string} filename - The name of the file.
     * @param {HTMLElement} container - The container element to which the file bubble will be appended.
     * @param {string} [content=null] - The content of the file. If not provided, the content will be fetched from the attachedFiles array.
     */
    function createFileBubble(filename, container, content = null) {
        const fileBubble = document.createElement('div');
        fileBubble.classList.add('file-bubble');
        const fileNameSpan = document.createElement('span');
        fileNameSpan.textContent = truncateFileName(filename);
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.classList.add('close-btn');
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(filename, fileBubble);
        });
        fileBubble.appendChild(closeButton);
        fileBubble.appendChild(fileNameSpan);
        fileBubble.addEventListener('click', () => {
            if (content) {
                openModal(filename, content);
            } else {
                const file = attachedFiles.find(file => file.name === filename);
                if (file) {
                    getFileContent(file).then(fileContent => {
                        openModal(file.name, fileContent);
                    }).catch(e => {
                        console.error(`Failed to open file "${filename}": ${e.message}`);
                    })
                }
            }
        });
        container.appendChild(fileBubble);
    }
    /**
     * Retrieves the content of a file based on its extension.
     *
     * @param {File} file - The file object to retrieve the content from.
     * @return {Promise<any>} A promise that resolves with the content of the file.
     */
    function getFileContent(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        if (['xls', 'xlsx', 'csv'].includes(extension)) {
            return parseSpreadsheet(file);
        } else if (extension === 'docx') {
            return parseDocx(file);
        } else if (extension === 'pdf') {
            return parsePdf(file);
        } else if (extension === 'pptx') {
            return parsePptx(file);
        } else if (extension === 'epub') {
            return parseEpub(file);
        } else if (extension === 'rtf') {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                /**
                 * Sets a success handler for the FileReader.
                 *
                 * @return {Promise<any>} A promise that resolves with the parsed RTF content.
                 */
                reader.onload = function(e) {
                    resolve(parseRtf(e.target.result));
                };
                /**
                 * Sets an error handler for the FileReader.
                 */
                reader.onerror = function(e) {
                    reject(e.message);
                };
                reader.readAsText(file);
            });
        } else {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                /**
                 * Sets a success handler for the reader.
                 *
                 * @return {Promise<any>} A promise that resolves with the result of the reader.
                 */
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                /**
                 * Sets an error handler for the reader.
                 */
                reader.onerror = function(e) {
                    reject(e.message);
                };
                reader.readAsText(file);
            });
        }
    }
    /**
     * Creates a modal dialog with the given title and content and appends it to the document body.
     *
     * @param {string} title - The title of the modal dialog.
     * @param {string} content - The content of the modal dialog.
     */
    function openModal(title, content) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalTitle = document.createElement('span');
        modalTitle.textContent = title;
        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.textContent = content;
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    /**
     * Removes a file from the file container and updates the attached files list.
     *
     * @param {string} fileName - The name of the file to be removed.
     * @param {HTMLElement} fileBubble - The HTML element representing the file bubble to be removed.
     */
    function removeFile(fileName, fileBubble) {
        fileContainer.removeChild(fileBubble);
        attachedFiles = attachedFiles.filter(file => file.name !== fileName);
        adjustTextareaHeight(messageBox);
        if (attachedFiles.length === 0) {
            fileContainer.style.display = 'none';
            fileContainer.style.marginBottom = '0';
        }
    }
    let pasteCount = 0;
    messageBox.addEventListener('paste', handlePasteEvent);
    /**
     * Handles the paste event by extracting text from the clipboard and creating a file from it.
     *
     * @param {Event} event - The paste event.
     */
    function handlePasteEvent(event) {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');
        if (pastedText && pastedText.length > 1000 && copyToFileEnabled) {
            event.preventDefault();
            const blob = new Blob([pastedText], { type: 'text/plain' });
            const file = new File([blob], `paste-${pasteCount}.txt`, { type: 'text/plain' });
            pasteCount++;
            handleFiles([file]);
            adjustTextareaHeight(messageBox);
        }
    }
    const attachButton = document.getElementById('attachButton');
    const fileInput = document.getElementById('fileInput');
    attachButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        handleFiles(files);
        adjustTextareaHeight(messageBox);
    });
    const sendButton = document.getElementById('sendButton');
    const backButton = document.getElementById('backButton');
    const addButton = document.getElementById('addButton');
    const runButton = document.getElementById('runButton');
    const infoLink = document.getElementById('info-link');
    const modelDropdown = document.getElementById('modelDropdown');
    const previousChats = document.querySelector('.previous-chats ul');
    let conversationHistory = [];
    let currentChatIndex = -1;
    let isNewChat = true;
    loadChatHistory();
    adjustTextareaHeight(messageBox);
    addButton.addEventListener('click', () => addMessageToHistory(messageBox.value.trim()));
    runButton.addEventListener('click', run);
    sendButton.addEventListener('click', handleSendClick);
    backButton.addEventListener('click', endChatSession);
    infoLink.addEventListener('click', showInfo);
    /**
     * Displays information about the application and prompts the user to visit the Discord Rocks API website if confirmed.
     */
    function showInfo() {
        var message = 'Created by @pianoth, LLMs and domain provided by @meow_18838.\nPowered by the Discord Rocks API (https://api.discord.rocks/) and (https://gpt4.discord.rocks).\n\nDo you want to visit the Discord Rocks API website?';
        var result = confirm(message);
        if (result) {
            window.location.href = 'https://api.discord.rocks/';
        }
    }
    /**
     * Handles the click event of the send button by sending and receiving a message.
     */
    function handleSendClick() {
        sendAndReceiveMessage();
    }
    /**
     * Handles the click event of the abort button by aborting the message sending process.
     */
    function handleAbortClick() {
        abortMessageSending();
    }
    /**
     * Runs the function to hide the previous chats, add an export button, handle sending a message,
     * change the text content of the send button to 'Abort', remove the event listener for handleSendClick,
     * add an event listener for handleAbortClick, display the back button, and change the class name of the send button to 'abort-button'.
     */
    function run() {
        document.querySelector('.previous-chats').style.display = 'none';
        addExportButton();
        handleSendMessage();
        sendButton.textContent = 'Abort';
        sendButton.removeEventListener('click', handleSendClick);
        sendButton.addEventListener('click', handleAbortClick);
        backButton.style.display = 'block';
        sendButton.className = 'abort-button';
    }
    //Settings
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeModalButton = settingsModal.querySelector('.close');
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const systemPromptInput = document.getElementById('systemPromptInput');
    const maxTokensInput = document.getElementById('maxTokensInput');
    let maxTokens = 4096;
    systemPromptInput.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    document.getElementById('maxTokensInput').addEventListener('input', function() {
        if (this.value > 4096) {
            alert('Max tokens cannot exceed 4096.');
            this.value = 4096;
        }
    });
    settingsButton.addEventListener('click', function() {
        systemPromptInput.value = document.getElementById('systemPromptInput').value;
        maxTokensInput.value = maxTokens;
        settingsModal.style.display = '';
    });
    closeModalButton.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    let copyToFileEnabled = true;
    function loadSettings() {
        const savedCopyToFileEnabled = localStorage.getItem('copyToFileEnabled');
        if (savedCopyToFileEnabled !== null) {
            copyToFileEnabled = JSON.parse(savedCopyToFileEnabled);
            document.getElementById('copyToFileToggle').checked = copyToFileEnabled;
        }
    }
    function saveSettings() {
        localStorage.setItem('copyToFileEnabled', JSON.stringify(copyToFileEnabled));
    }
    saveSettingsButton.addEventListener('click', function() {
        copyToFileEnabled = document.getElementById('copyToFileToggle').checked;
        saveSettings();
        document.getElementById('systemPromptInput').value = systemPromptInput.value;
        maxTokens = parseInt(maxTokensInput.value) || 4096;  // Fallback to default
        settingsModal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    /*
    document.getElementById('toggleSystemPromptBtn').addEventListener('click', function() {
        const systemPrompt = document.getElementById('systemPrompt');
        systemPrompt.style.display = systemPrompt.style.display === 'none' ? 'block' : 'none';
        const messageForm = document.querySelector('.message-form');
        const historyVisible = document.querySelector('.previous-chats').style.display !== 'none';
        messageForm.style.flex = historyVisible ? '1' : '1 0 100%';
    });
    */
    messageBox.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    let allowRetry = true;
    /**
     * Adds a message to the conversation history.
     *
     * @param {string} messageContent - The content of the message.
     * @param {string} [role='user'] - The role of the message sender. Defaults to 'user'.
     * @return {Promise<void>} A promise that resolves when the message is added to the history.
     */
    function addMessageToHistory(messageContent, role = 'user') {
        return new Promise((resolve, reject) => {
            backButton.style.display = 'block';
            if (attachedFiles.length > 0) {
                let filesText = '';
                const filePromises = attachedFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const extension = file.name.split('.').pop().toLowerCase();
                        if (['xls', 'xlsx', 'csv'].includes(extension)) {
                            parseSpreadsheet(file).then(fileContent => {
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'docx') {
                            parseDocx(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'pdf') {
                            parsePdf(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'pptx') {
                            parsePptx(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'epub') {
                            parseEpub(file).then(fileContent => {
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            }).catch(e => {
                                reject(new Error(`Failed to parse file "${file.name}": ${e.message}`));
                            });
                        } else if (extension === 'rtf') {
                            const reader = new FileReader();
                            /**
                             * Handles the load event of the FileReader.
                             *
                             * @return {Promise<void>} A promise that resolves when the file content is processed and added to the filesText variable.
                             */
                            reader.onload = function(e) {
                                const rtfContent = e.target.result;
                                const plainText = parseRtf(rtfContent);
                                filesText += `\n${file.name}\n\`\`\`\n${plainText}\n\`\`\`\n`;
                                resolve();
                            };
                            /**
                             * Handles the error event of the FileReader.
                             */
                            reader.onerror = function(e) {
                                reject(new Error(`Failed to read file: ${file.name}.\n${e.message}`));
                            };
                            reader.readAsText(file);
                        } else {
                            const reader = new FileReader();
                            /**
                             * Handles the load event of the FileReader.
                             */
                            reader.onload = function(e) {
                                let fileContent = e.target.result;
                                fileContent = fileContent.replace(/`/g, '\\`');
                                filesText += `\n${file.name}\n\`\`\`\n${fileContent}\n\`\`\`\n`;
                                resolve();
                            };
                            /**
                             * Handles the error event of the FileReader.
                             */
                            reader.onerror = function(e) {
                                reject(new Error(`Failed to read file: ${file.name}.\n${e.message}`));
                            };
                            reader.readAsText(file);
                        }
                    });
                });
                Promise.all(filePromises).then(() => {
                    pasteCount = 0;
                    messageContent += filesText;
                    attachedFiles = [];
                    fileContainer.style.display = 'none';
                    fileContainer.innerHTML = '';
                    conversationHistory.push({ role: role, content: messageContent });
                    messageBox.value = '';
                    adjustTextareaHeight(messageBox);
                    document.querySelector('.previous-chats').style.display = 'none';
                    addExportButton();
                    displayMessage(messageContent, role);
                    saveChatToHistory();
                    resolve();
                }).catch(e => {
                    console.error(e);
                    addMessageToHistory("Failed to read attached files.", "assistant");
                    reject(e);
                });
            } else {
                conversationHistory.push({ role: role, content: messageContent });
                messageBox.value = '';
                adjustTextareaHeight(messageBox);
                document.querySelector('.previous-chats').style.display = 'none';
                addExportButton();
                displayMessage(messageContent, role);
                saveChatToHistory();
                resolve();
            }
        });
    }
    /**
     * Fetches a chat title based on the provided message content using the GPT-4o model.
     *
     * @param {string} messageContent - The content of the message to generate the chat title from.
     * @param {number} chatIndex - The index of the chat.
     * @return {Promise<void>} A promise that resolves when the chat title is fetched and updated.
     *                         Rejects if there is an error fetching the chat title.
     */
    function fetchChatTitle(messageContent, chatIndex) {
        const listItem = previousChats.children[previousChats.children.length - 1 - chatIndex];
        const generateButton = listItem.querySelector('button[title="Generate a new title for the chat."]');
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        generateButton.appendChild(spinner);
        const requestBody = {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You generate title to conversations. You do NOT respond to the message. You do NOT continue the conversation. You use plain text, no markdown.'
                },
                {
                    role: 'user',
                    content: 'IMPORTANT: Only create a title for the chat based on the message or conversation. Do NOT respond to the message. Do NOT continue the conversation. Only generate a title. Use plain text, no markdown.\n\n---\n\nCONTEXT:\n\n' + messageContent + '\n\n---\n\nIMPORTANT: Only create a title for the chat based on the message or conversation. Do NOT respond to the message. Do NOT continue the conversation. Only generate a title. Use plain text, no markdown.'
                }
            ],
            max_tokens: 20
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        fetch('https://api.discord.rocks/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error('API returned error status:', response.status);
                return;
            }
            return response.json();
        })
        .then(jsonData => {
            if (jsonData.response && jsonData.response.length > 0) {
                let title = jsonData.response.trim();
                if (title.startsWith('"')) {
                    title = title.endsWith('"') ? title.slice(1, -1) : title.slice(1);
                }
                updateChatTitle(title, chatIndex);
            }
        })
        .catch(e => {
            generateButton.removeChild(spinner);
            if (e.name === 'AbortError') {
                console.error('Fetch request for the chat title timed out.');
            } else {
                console.error('Error fetching chat title:', e);
            }
        });
    }
    /**
     * Updates the title of the chat at the specified index in the chat history stored in the local storage.
     *
     * @param {string} newTitle - The new title for the chat.
     * @param {number} chatIndex - The index of the chat in the chat history.
     */
    function updateChatTitle(newTitle, chatIndex) {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        if (chatIndex < chats.length) {
            chats[chatIndex].title = newTitle;
            localStorage.setItem('chats', JSON.stringify(chats));
            updateChatListUI();
        } else {
            console.error('Invalid chat index:', chatIndex);
        }
    }
    /**
     * Sends a message and receives a response from the server.
     *
     * @return {Promise<void>} A promise that resolves when the message is sent and a response is received.
     *                         Rejects if there is an error processing the files.
     */
    function sendAndReceiveMessage() {
        let messageContent = messageBox.value.trim();
        if (messageContent || attachedFiles.length > 0) {
            const role = 'user';
            addMessageToHistory(messageContent, role)
                .then(() => {
                    if (isNewChat) {
                        let chats = JSON.parse(localStorage.getItem('chats')) || [];
                        fetchChatTitle(messageContent, chats.length - 1);
                        isNewChat = false;
                    }
                    handleSendMessage();
                    sendButton.textContent = 'Abort';
                    sendButton.removeEventListener('click', handleSendClick);
                    sendButton.addEventListener('click', handleAbortClick);
                    sendButton.className = 'abort-button';
                })
                .catch(e => {
                    console.error('Error processing files:', e);
                    addMessageToHistory("Failed to read attached files.", "assistant");
                });
        }
    }
    /**
     * Handles sending a message by fetching data from the server and updating the UI.
     */
    function handleSendMessage() {
        const selectedModel = modelDropdown.value;
        const systemMessage = document.getElementById('systemPromptInput').value.trim();
        const requestBody = {
            messages: systemMessage ? [...conversationHistory.slice(0, -1), { role: 'system', content: systemMessage }, ...conversationHistory.slice(-1)] : conversationHistory,
            model: selectedModel,
            max_tokens: maxTokens,
            stream: true
        };
        fetchWithRetry(requestBody);
    }
    /**
     * Fetches data from the specified URL using the provided request body.
     * If successful, processes the received data in chunks and updates the UI.
     * If an error occurs, retries up to a maximum number of times.
     *
     * @param {Object} requestBody - The data to be sent in the request body.
     * @param {string} [URL='https://api.discord.rocks/chat/completions'] - The URL to send the request to.
     */
    function fetchWithRetry(requestBody, URL = 'https://api.discord.rocks/chat/completions') {
        const loadingMessage = displayMessage('Loading...', 'loading');
        let retries = 0;
        const maxRetries = 2;
        let allContent = '';
        let buffer = '';
        /**
         * Fetches data from the specified URL using the provided request body.
         * If successful, processes the received data in chunks and updates the UI.
         * If an error occurs, retries up to a maximum number of times.
         *
         * @param {Object} requestBody - The data to be sent in the request body.
         * @param {string} [URL='https://api.discord.rocks/chat/completions'] - The URL to send the request to.
         */
        function tryFetch() {
            backButton.disabled = true;
            abortController = new AbortController();
            fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: abortController.signal
            })
            .then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                loadingMessage.innerHTML = ''
                const textSpan = document.createElement('span');
                textSpan.classList.add('message-content');
                loadingMessage.appendChild(textSpan);
                /**
                 * Processes the text received from the reader.
                 *
                 * @param {Object} options - The options object.
                 * @param {boolean} options.done - Indicates if the reading is done.
                 * @param {ArrayBuffer} options.value - The value received from the reader.
                 */
                function processText({ done, value }) {
                    if (done) {
                        document.getElementById('messageContainer').removeChild(loadingMessage);
                        displayMessage(allContent.trim(), 'assistant');
                        conversationHistory.push({ role: 'assistant', content: allContent.trim() });
                        saveChatToHistory();
                        updateMessageCounters();
                        revertSendButton();
                        backButton.disabled = false;
                        return;
                    }
                    const text = decoder.decode(value, { stream: true });
                    buffer += text;
                    let events = buffer.split('\n\n');
                    buffer = events.pop();
                    events.forEach(event => {
                        try {
                            if (event.startsWith('data: ')) {
                                const jsonData = event.split('data: ')[1];
                                if (jsonData === '[DONE]') {
                                    return;
                                }
                                const eventData = JSON.parse(jsonData);
                                if (eventData.choices && eventData.choices[0].delta && eventData.choices[0].delta.content) {
                                    allContent += eventData.choices[0].delta.content;
                                    parseMarkdownToHTML(textSpan, allContent);
                                    loadingMessage.className = 'assistant-message';
                                }
                            }
                        } catch (e) {
                            console.error('Failed to parse event:', e, 'Event:', event);
                        }
                    });
                    reader.read().then(processText).catch(e => {
                        if (e.name === 'AbortError') {
                            document.getElementById('messageContainer').removeChild(loadingMessage);
                            conversationHistory.pop();
                            backButton.disabled = false;
                            if (allContent.trim()) {
                                addMessageToHistory(allContent.trim(), 'assistant');
                                saveChatToHistory();
                                updateMessageCounters();
                            }
                        } else {
                            console.error('Error:', e);
                        }
                    });
                }
                reader.read().then(processText);
            })
            .catch(e => {
                if (e.name === 'AbortError') {
                    allowRetry = false;
                } else {
                    console.error('Error:', e);
                }
                if (retries < maxRetries && allowRetry) {
                    retries++;
                    loadingMessage.textContent = `Retrying (${retries}/${maxRetries})...`;
                    setTimeout(tryFetch, 1000);
                } else {
                    backButton.disabled = false;
                    conversationHistory.pop();
                    revertSendButton();
                    if (allowRetry) {
                        loadingMessage.textContent = 'Failed to load response after multiple retries.';
                        loadingMessage.className = 'error-message';
                    } else {
                        loadingMessage.parentNode.removeChild(loadingMessage);
                        if (allContent.trim()) {
                            addMessageToHistory(allContent.trim(), 'assistant');
                            saveChatToHistory();
                        }
                    }
                }
            });
        }
        tryFetch();
    }
    /**
     * Reverts the send button to its original state by setting the text content to 'Send Message',
     * removing the event listener for 'click' that triggers handleAbortClick, adding an event listener
     * for 'click' that triggers handleSendClick, and resetting the className to an empty string.
     *
     * @return {void} This function does not return anything.
     */
    function revertSendButton() {
        sendButton.textContent = 'Send Message';
        sendButton.removeEventListener('click', handleAbortClick);
        sendButton.addEventListener('click', handleSendClick);
        sendButton.className = '';
    }    
    /**
     * Aborts the current message sending process, saves the chat to history, adds the last message to the conversation history,
     * aborts the current request, creates a new AbortController, and reverts the send button.
     */
    function abortMessageSending() {
        saveChatToHistory();
        conversationHistory.push(conversationHistory.slice(-1)[0]);
        abortController.abort();
        abortController = new AbortController();
        revertSendButton();
    }
    /**
     * Adjusts the height of a textarea element based on its content.
     *
     * @param {HTMLTextAreaElement} textarea - The textarea element to adjust.
     */
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        const maxTextBoxHeight = attachedFiles.length > 0 ? 'calc(30vh - 60px)' : '30vh';
        textarea.style.maxHeight = maxTextBoxHeight;
        if (document.getElementById('messageBoxContainer').contains(textarea)) {
            textarea.style.paddingLeft = `${attachButton.offsetWidth + 15}px`;
        }
    }
    /**
     * Parses the given Markdown message and replaces newline characters outside of HTML tags with <br> tags.
     * Also adds a copy button to each <pre> element in the parsed HTML.
     *
     * @param {HTMLElement} textSpan - The element to display the parsed message in.
     * @param {string} message - The Markdown message to parse and display.
     */
    function parseMarkdownToHTML(textSpan, message) {
        textSpan.innerHTML = marked.parse(message).replace(/(?<!<\/?\w+>)\n(?!\s*<\/?\w+>)/g, "<br>");
        const preElements = textSpan.querySelectorAll('pre');
        preElements.forEach(pre => {
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Code';
            copyButton.className = 'copy-code-button';
            /**
             * Copies the code text from the <pre> element to the clipboard when the copy button is clicked.
             *
             * @return {Promise<void>} A promise that resolves when the code is successfully copied to the clipboard.
             *                         If an error occurs during the copying process, it is logged to the console.
             */
            copyButton.onclick = function() {
                const codeText = pre.innerText.slice(0, -11);
                navigator.clipboard.writeText(codeText)
                    .then(() => alert('Code copied to clipboard!'))
                    .catch(e => console.error('Failed to copy code: ', e));
            };
            pre.appendChild(copyButton);
        });
    }
    /**
     * Parses the given message and displays it as files as bubbles if it contains files,
     * otherwise it parses the message as Markdown and displays it as HTML.
     *
     * @param {HTMLElement} textSpan - The element to display the parsed message in.
     * @param {string} message - The message to parse and display.
     */
    function parseMessage(textSpan, message, user = true) {
        if (containsFiles(message) && user) {
            displayFilesAsBubbles(textSpan, message);
        } else {
            parseMarkdownToHTML(textSpan, message);
        }
    }
    /**
     * Attaches event listeners to the given buttons and selects elements to handle user interactions.
     *
     * @param {HTMLElement} editButton - The button element for editing a message.
     * @param {HTMLElement} deleteButton - The button element for deleting a message.
     * @param {HTMLElement} copyButton - The button element for copying a message.
     * @param {HTMLElement} roleSelect - The select element for selecting a role.
     * @param {HTMLElement} textSpan - The element containing the message text.
     * @param {HTMLElement} messageDiv - The div element containing the message.
     * @param {string} message - The message text.
     * @param {HTMLElement} buttonsDiv - The div element containing the buttons.
     */
    function attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, message, buttonsDiv) {
        const MAX_LENGTH = 1000;
        const user = messageDiv.className === 'user-message';
        if (message.length > MAX_LENGTH) {
            const partialMessage = message.substring(0, MAX_LENGTH) + '...';
            parseMessage(textSpan, partialMessage, user);
            const showMoreButton = document.createElement('button');
            showMoreButton.textContent = 'Show More';
            showMoreButton.className = 'show-more-button';
            showMoreButton.title = 'Show the full content of this message.';
            showMoreButton.setAttribute('aria-describedby', 'showMoreButtonDesc');
            messageDiv.appendChild(showMoreButton);
            /**
             * Handles the click event of the showMoreButton element. Toggles between showing the full message and a partial message.
             */
            showMoreButton.onclick = function() {
                if (showMoreButton.textContent === 'Show More') {
                    parseMessage(textSpan, message, user);
                    showMoreButton.textContent = 'Show Less';
                    showMoreButton.title = 'Collapse the content of this message.';
                    showMoreButton.setAttribute('aria-describedby', 'showLessButtonDesc');
                } else {
                    parseMessage(textSpan, partialMessage, user);
                    showMoreButton.textContent = 'Show More';
                    showMoreButton.title = 'Show the full content of this message.';
                    showMoreButton.setAttribute('aria-describedby', 'showMoreButtonDesc');
                }
            };
        } else {
            parseMessage(textSpan, message, user);
        }
        /**
         * Handles the change event of the roleSelect element. Updates the role of the corresponding message in the
         * conversation history.
         */
        roleSelect.addEventListener('change', () => {
            const newRole = roleSelect.value;
            const currentIndex = parseInt(messageDiv.id.split('-')[1]);
            if (currentIndex === -1) return;
            abortController.abort();
            abortController = new AbortController();
            conversationHistory[currentIndex].role = newRole;
            saveChatToHistory();
            messageDiv.className = `${newRole}-message`;
        });
        /**
         * Handles the click event of the edit button. Aborts the current request, retrieves the current message index,
         * creates a textarea element with the value of the corresponding message in the conversation history, adjusts the
         * height of the textarea, and adds event listeners to adjust the height of the textarea on input. Creates confirm
         * and cancel buttons, replaces the text span with the textarea, clears the buttons div, and appends the confirm
         * and cancel buttons. If the confirm button is clicked, updates the content of the corresponding message in the
         * conversation history, parses the message, replaces the textarea with the text span, clears the buttons div,
         * appends the edit, delete, and copy buttons, saves the chat to history, and attaches listeners to the buttons.
         * If the cancel button is clicked, replaces the textarea with the text span, clears the buttons div, appends the
         * edit, delete, and copy buttons, and appends the show more button if it exists.
         */
        editButton.onclick = function() {
            allowRetry = false;
            abortController.abort();
            let currentIndex = parseInt(messageDiv.id.split('-')[1]);
            if (currentIndex === -1) return;
            const input = document.createElement('textarea');
            input.style.width = '100%';
            input.value = conversationHistory[currentIndex].content;
            setTimeout(() => {adjustTextareaHeight(input)}, 0);
            input.addEventListener('input', function() {
                adjustTextareaHeight(this);
            });
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
            confirmButton.className = 'confirm-button';
            confirmButton.title = 'Confirm the changes.';
            confirmButton.setAttribute('aria-describedby', 'confirmButtonDesc');
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.className = 'cancel-button';
            cancelButton.title = 'Cancel the changes.';
            cancelButton.setAttribute('aria-describedby', 'cancelButtonDesc');
            messageDiv.replaceChild(input, textSpan);
            buttonsDiv.innerHTML = '';
            const showMoreButton = messageDiv.querySelector('.show-more-button');
            let showMoreButtonExists = showMoreButton !== null;
            if (showMoreButtonExists) {
                messageDiv.removeChild(showMoreButton);
            }
            buttonsDiv.appendChild(confirmButton);
            buttonsDiv.appendChild(cancelButton);
            /**
             * Handles the click event of the confirm button. Updates the content of the corresponding message in the conversation history,
             * parses the message, replaces the text span with the textarea, clears the buttons div, and appends the edit, delete, and copy buttons.
             * If the message does not exist in the conversation history, it is added to the history. Saves the chat to the history and attaches the listeners.
             */
            confirmButton.onclick = function() {
                if (conversationHistory[currentIndex]) {
                    conversationHistory[currentIndex].content = input.value;
                } else {
                    conversationHistory.push({ role: 'user', content: input.value });
                }
                parseMessage(textSpan, input.value, user);
                messageDiv.replaceChild(textSpan, input);
                buttonsDiv.innerHTML = '';
                buttonsDiv.appendChild(editButton);
                buttonsDiv.appendChild(deleteButton);
                buttonsDiv.appendChild(copyButton);
                buttonsDiv.appendChild(roleSelect);
                saveChatToHistory();
                attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, input.value, buttonsDiv);
            };
            /**
             * Handles the click event of the cancel button. Replaces the textarea with the text span, clears the buttons div,
             * appends the edit, delete, and copy buttons, and appends the show more button if it exists.
             */
            cancelButton.onclick = function() {
                messageDiv.replaceChild(textSpan, input);
                buttonsDiv.innerHTML = '';
                buttonsDiv.appendChild(editButton);
                buttonsDiv.appendChild(deleteButton);
                buttonsDiv.appendChild(copyButton);
                buttonsDiv.appendChild(roleSelect);
                if (showMoreButtonExists) {
                    messageDiv.appendChild(showMoreButton);
                }
            };
        };
        /**
         * Handles the click event of the delete button. Prompts the user for confirmation and deletes the message if confirmed.
         */
        deleteButton.onclick = function() {
            if (confirm('Are you sure you want to delete this message?')) {
                abortController.abort();
                document.getElementById('messageContainer').removeChild(messageDiv);
                conversationHistory = conversationHistory.filter(m => m.content !== message);
                saveChatToHistory();
                updateMessageCounters();
            }
        };
        /**
         * Copies the given message to the clipboard and displays an alert indicating success or failure.
         * @return {Promise} A promise that resolves when the text is successfully copied to the clipboard, or rejects with an error if the copy fails.
         */
        copyButton.onclick = function() {
            navigator.clipboard.writeText(message)
                .then(() => alert('Message copied to clipboard!'))
                .catch(e => console.error('Failed to copy text: ', e));
        };
    }
    /**
     * Creates a new message div element and appends it to the message container.
     *
     * @param {string} message - The content of the message.
     * @param {string} role - The role of the message sender ('user', 'assistant', or 'loading').
     * @return {HTMLElement} The created message div element.
     */
    function displayMessage(message, role) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('messageDiv')
        messageDiv.setAttribute('id', 'message-' + document.getElementById('messageContainer').children.length);
        messageDiv.style.flexDirection = 'column';
        messageDiv.style.alignItems = 'center';
        const textSpan = document.createElement('span');
        textSpan.classList.add('message-content');
        messageDiv.appendChild(textSpan);
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'message-buttons';
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.title = 'Edit this message.';
        editButton.setAttribute('aria-describedby', 'editButtonDesc');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.title = 'Delete this message.';
        deleteButton.setAttribute('aria-describedby', 'deleteButtonDesc');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        copyButton.title = 'Copy this message to the clipboard.';
        copyButton.setAttribute('aria-describedby', 'copyButtonDesc');
        const roleSelect = document.createElement('select');
        roleSelect.className = 'role-selector';
        roleSelect.title = 'Change the role of this message.';
        roleSelect.setAttribute('aria-describedby', 'roleSelectDesc');
        const roles = ['user', 'assistant', 'system'];
        roles.forEach(r => {
            const option = document.createElement('option');
            option.value = r;
            option.textContent = r.charAt(0).toUpperCase() + r.slice(1);
            if (r === role) {
                option.selected = true;
            }
            roleSelect.appendChild(option);
        });
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(copyButton);
        buttonsDiv.appendChild(roleSelect);
        messageDiv.className = role === 'user' ? 'user-message' : (role === 'assistant' ? 'assistant-message' : (role === 'system' ? 'system-message' : 'loading-message'));
        document.getElementById('messageContainer').appendChild(messageDiv);
        setTimeout(() => {messageDiv.getBoundingClientRect();messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })}, 0);
        if (role !== 'loading') {
            parseMessage(textSpan, message, role === 'user');
            messageDiv.appendChild(buttonsDiv);
            attachListeners(editButton, deleteButton, copyButton, roleSelect, textSpan, messageDiv, message, buttonsDiv);
        } else {
            textSpan.textContent = message;
        }
        return messageDiv;
    }
    /**
     * Checks if the given message contains any files.
     *
     * @param {string} message - The message to check for files.
     * @return {boolean} Returns true if the message contains files, false otherwise.
     */
    function containsFiles(message) {
        const filePattern = /\n[^\n]+\.\w+\n```\n([\s\S]*?)\n```/g;
        return filePattern.test(message);
    }
    /**
     * Displays files as bubbles in the given container.
     *
     * @param {HTMLElement} container - The container element to display the files in.
     * @param {string} message - The message containing the file details.
     */
    function displayFilesAsBubbles(container, message) {
        const filePattern = /\n[^\n]+\.\w+\n```\n([\s\S]*?)\n```/g;
        let match;
        container.innerHTML = '';
        const contentBeforeFiles = message.replace(filePattern, "");
        if (contentBeforeFiles.trim()) {
            const contentSpan = document.createElement('span');
            parseMarkdownToHTML(contentSpan, contentBeforeFiles.trim());
            container.appendChild(contentSpan);
        }
        while ((match = filePattern.exec(message)) !== null) {
            const fileDetails = match[0];
            const fileName = fileDetails.match(/\n[^\n]+\.\w+/)[0].trim();
            const fileContent = match[1].trim();
            createFileBubble(fileName, container, fileContent);
        }
    }
    
    /**
     * Saves the current chat to the chat history in the local storage. If there is no current chat,
     * a new chat is created with the current timestamp and conversation history. If there is a current
     * chat, its conversation history is updated. The chat history is then updated in the local storage
     * and the chat list UI is updated.
     */
    function saveChatToHistory() {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        if (currentChatIndex === -1 || currentChatIndex >= chats.length) {
            const chatData = {
                timestamp: new Date().toISOString(),
                title: `Chat on ${new Date().toLocaleString()}`,
                conversation: conversationHistory
            };
            chats.push(chatData);
            currentChatIndex = chats.length - 1;
        } else {
            chats[currentChatIndex].conversation = conversationHistory;
        }
        localStorage.setItem('chats', JSON.stringify(chats));
        updateChatListUI();
    }
    /**
     * Loads the chat history from local storage and displays it in the UI.
     */
    function loadChatHistory() {
        let chats = JSON.parse(localStorage.getItem('chats')) || [];
        previousChats.innerHTML = '';
        for (let i = chats.length - 1; i >= 0; i--) {
            addChatToUI(chats[i], i);
        }
    }
    /**
     * Updates the chat list UI by clearing the previous chats container and loading the chat history.
     */
    function updateChatListUI() {
        previousChats.innerHTML = '';
        loadChatHistory();
    }
    /**
     * Adds a chat to the UI by creating a list item element and appending it to the previousChats element.
     * The list item contains the chat title and three buttons for generating title, editing, and deleting the chat.
     *
     * @param {Object} chat - The chat object containing the title of the chat.
     * @param {number} index - The index of the chat in the chats array.
     */
    function addChatToUI(chat, index) {
        const li = document.createElement('li');
        li.textContent = `${chat.title || 'Untitled'}`;
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Title';
        editButton.title = 'Edit the title of the chat.';
        editButton.setAttribute('aria-describedby', 'editTitleButtonDesc');
        /**
         * Handles the click event of the edit button. Stops the event propagation and calls the editTitle function with the index parameter.
         */
        editButton.onclick = function(event) {
            event.stopPropagation();
            editTitle(index);
        };
        const generateTitleButton = document.createElement('button');
        generateTitleButton.textContent = 'Generate Title';
        generateTitleButton.title = 'Generate a new title for the chat.';
        generateTitleButton.setAttribute('aria-describedby', 'generateTitleButtonDesc');
        /**
         * Handles the click event of the generateTitleButton. Stops the event propagation and calls the fetchChatTitle function with the concatenated content of the chat messages and the index parameter.
         */
        generateTitleButton.onclick = function(event) {
            event.stopPropagation();
            fetchChatTitle(chat.conversation.map(msg => msg.content).join('\n'), index);
        };
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.title = 'Delete the chat.';
        deleteButton.setAttribute('aria-describedby', 'deleteChatButtonDesc');
        /**
         * Handles the click event of the delete button. Stops the event propagation and calls the confirmDelete function with the index parameter.
         */
        deleteButton.onclick = function(event) {
            event.stopPropagation();
            confirmDelete(index);
        };
        li.appendChild(editButton);
        li.appendChild(generateTitleButton);
        li.appendChild(deleteButton);
        li.onclick = () => loadChat(index);
        previousChats.appendChild(li);
    }
    /**
     * Edits the title of a chat at the given index in the local storage.
     *
     * @param {number} index - The index of the chat in the chats array.
     */
    function editTitle(index) {
        const newTitle = prompt("Enter new title for the chat:");
        if (newTitle) {
            let chats = JSON.parse(localStorage.getItem('chats'));
            if (chats && chats.length > index) {
                chats[index].title = newTitle;
                localStorage.setItem('chats', JSON.stringify(chats));
                updateChatListUI();
            }
        }
    }
    /**
     * Deletes a chat from the local storage if the user confirms the deletion.
     *
     * @param {number} index - The index of the chat to delete.
     */
    function confirmDelete(index) {
        if (confirm("Are you sure you want to delete this chat?")) {
            let chats = JSON.parse(localStorage.getItem('chats'));
            if (chats && chats.length > index) {
                chats.splice(index, 1);
                localStorage.setItem('chats', JSON.stringify(chats));
                setTimeout(updateMessageCounters(), 0);
                updateChatListUI();
            }
        }
    }
    /**
     * Ends the current chat session by saving the chat history, clearing the message container,
     * resetting the conversation history, updating the UI, and clearing the message box.
     */
    function endChatSession() {
        saveChatToHistory();
        document.getElementById('messageContainer').innerHTML = '';
        document.querySelector('.export-button-container').innerHTML = '';
        conversationHistory = [];
        currentChatIndex = -1;
        backButton.style.display = 'none';
        document.querySelector('.message-form').style.flex = '1'
        document.querySelector('.previous-chats').style.display = 'block';
        sendButton.textContent = 'Start Chat';
        messageBox.value = '';
        adjustTextareaHeight(messageBox);
        isNewChat = true;
        updateMessageCounters();
    }
    /**
     * Loads a chat from local storage based on the given index and displays it in the UI.
     *
     * @param {number} index - The index of the chat to load from local storage.
     */
    function loadChat(index) {
        isNewChat = false;
        let chats = JSON.parse(localStorage.getItem('chats'));
        if (chats && chats.length > index) {
            let chatData = chats[index];
            conversationHistory = chatData.conversation;
            currentChatIndex = index;
            document.getElementById('messageContainer').innerHTML = '';
            conversationHistory.forEach(msg => {
                displayMessage(msg.content, msg.role);
            });
            const messageDivs = document.getElementById('messageContainer').children;
            for (let i = 0; i < messageDivs.length; i++) {
                messageDivs[i].setAttribute('id', 'message-' + i);
            }
            backButton.style.display = 'block';
            document.querySelector('.previous-chats').style.display = 'none';
            addExportButton();
            sendButton.textContent = 'Send Message';
            messageBox.value = '';
            adjustTextareaHeight(messageBox);
        }
    }
    /**
     * Adds an export button to the export button container.
     */
    function addExportButton() {
        const exportButtonContainer = document.querySelector('.export-button-container');
        exportButtonContainer.innerHTML = `
            <button id="exportChatButton" class="export-button" title="Export the current chat as a text file." aria-describedby='exportChatDesc'>Export chat</button>
            <button id="shareChatButton" class="export-button" title="Create a shareable link to the current chat." aria-describedby='shareChatDesc'>Share chat</button>
        `;
        exportButtonContainer.appendChild(messageCounter);
        messageCounter.style.display = '';
        updateMessageCounters();
        const exportButton = document.getElementById('exportChatButton');
        /**
         * Handles the click event of the export button. Exports the current chat as a text file.
         */
        exportButton.onclick = function() {
            const chats = JSON.parse(localStorage.getItem('chats'));
            const exportText = exportChat(currentChatIndex);
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${chats[currentChatIndex].title || 'Untitled'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        };
        const shareChatButton = document.getElementById('shareChatButton');
        /**
         * Handles the click event of the share chat button. Prompts the user with a confirmation message and saves the chat data to a GitHub Gist if confirmed.
         */
        shareChatButton.onclick = function() {
            const confirmation = confirm('Warning: Do not share sensitive data. The only way to un-share the chat is to contact @pianoth and sending the chat link to be removed.\n\nDo you want to create a public link for this chat?');
            if (confirmation) {
                saveChatToGist(conversationHistory);
            }
        };
    }
    /**
     * Exports a chat at the specified index from the local storage.
     *
     * @param {number} index - The index of the chat to export.
     * @return {string} The exported chat text, with each message formatted as "*role* : content\n\n---\n\n".
     */
    function exportChat(index) {
        let chats = JSON.parse(localStorage.getItem('chats'));
        if (chats && chats.length > index) {
            let chatData = chats[index];
            let exportText = '';
            chatData.conversation.forEach(msg => {
                exportText += `*${msg.role}* : ${msg.content}\n\n---\n\n`;
            });
            return exportText.substring(0, exportText.length - 7);
        }
    }
    /**
     * Decodes a Base64 encoded string.
     *
     * @param {string} encodedStr - The Base64 encoded string.
     * @return {string} The decoded string.
     */
    function decodeBase64(encodedStr) {
        try {
            return atob(encodedStr);
        } catch (e) {
            console.error('Failed to decode Base64 string:', e);
            return '';
        }
    }
    /**
     * Reverses a string.
     *
     * @param {string} str - The string to reverse.
     * @return {string} The reversed string.
     */
    function reverseString(str) {
        return str.split('').reverse().join('');
    }
    // Base64 encoded reversed token
    const encodedReversedToken = 'azFaTWlKNDBMeXhtMFQzMmZxcW4yYXlkOGxpWnJPT0VZbEhWNEtfcGhneDk=';
    const token = reverseString(decodeBase64(encodedReversedToken)).slice(2,-2); //Public token used only for LLM Playground
    /**
     * Saves the chat data to a GitHub Gist.
     *
     * @param {Object} chatData - The chat data to be saved.
     * @return {Promise} A promise that resolves when the chat data is successfully saved, or rejects with an error if there was a problem.
     */
    function saveChatToGist(chatData) {
        const apiUrl = 'https://api.github.com/gists';
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${token}`
            },
            body: JSON.stringify({
                description: 'LLM Playground Chat',
                public: true,
                files: {
                    'chat.json': {
                        content: JSON.stringify(chatData)
                    }
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                const shareableLink = `${window.location.origin}${window.location.pathname}?gist=${data.id}`;
                if (confirm('Shareable link created: ' + shareableLink + '\n\nDo you want to copy the URL to the clipboard?')) {
                    navigator.clipboard.writeText(shareableLink)
                        .then(() => alert('Link copied to clipboard.'))
                        .catch(error => console.error('Failed to copy link: ', error));
                }
            } else {
                console.error('Failed to save chat data:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    /**
     * Loads chat data from a GitHub Gist based on the URL path.
     *
     * @return {Promise} A promise that resolves when the chat data is successfully loaded and displayed,
     * or rejects with an error if there was a problem.
     */
    function loadChatFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const gistId = urlParams.get('gist');
        if (gistId) {
            fetch(`https://api.github.com/gists/${gistId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.files && data.files['chat.json']) {
                        conversationHistory = JSON.parse(data.files['chat.json'].content);
                        displayLoadedChat();
                    } else {
                        console.error('No chat data found for this ID.');
                    }
                })
                .catch(error => {
                    console.error('Error loading chat:', error);
                });
        }
    }
    //Message counters
    const messageCounter = document.createElement('div');
    messageCounter.classList.add('message-counter');
    messageCounter.textContent = 'Messages: 0';
    messageCounter.style.display = 'none';
    document.querySelector('.export-button-container').appendChild(messageCounter);
    const globalMessageCounter = document.createElement('div');
    globalMessageCounter.classList.add('global-message-counter');
    globalMessageCounter.textContent = 'Total Messages: 0';
    document.querySelector('.previous-chats').appendChild(globalMessageCounter);
    /**
     * Updates the message counters by calculating the number of messages in the conversation history and the total number of messages across all chats.
     */
    function updateMessageCounters() {
        const messageCount = conversationHistory.length;
        messageCounter.textContent = `Messages: ${messageCount}`;
        let totalMessageCount = 0;
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        chats.forEach(chat => {
            totalMessageCount += chat.conversation.length;
        });
        globalMessageCounter.textContent = `Total Messages: ${totalMessageCount}`;
    }
    /**
     * Displays the loaded chat by clearing the message container, iterating over the conversation history,
     * and displaying each message using the displayMessage function. It also updates the display of the
     * back button, hides the previous chats container, and sets the text content of the send button to 'Send Message'.
     */
    function displayLoadedChat() {
        document.getElementById('messageContainer').innerHTML = '';
        conversationHistory.forEach(msg => {
            displayMessage(msg.content, msg.role);
        });
        backButton.style.display = 'block';
        document.querySelector('.previous-chats').style.display = 'none';
        sendButton.textContent = 'Send Message';
    }
    const searchTextarea = document.createElement('textarea');
    searchTextarea.id = 'searchTextarea';
    searchTextarea.placeholder = 'Search chats...';
    document.querySelector('.previous-chats-controls').appendChild(searchTextarea);
    const searchButton = document.getElementById('searchButton');
    const exportButton = document.getElementById('exportDataButton');
    const importButton = document.getElementById('importDataButton');
    const deleteButton = document.getElementById('deleteDataButton');
    searchButton.addEventListener('click', function() {
        const isSearching = searchTextarea.style.display === 'block';
        if (isSearching) {
            searchTextarea.style.display = 'none';
            searchTextarea.value = '';
            searchButton.textContent = 'Search';
            exportButton.style.display = 'inline';
            importButton.style.display = 'inline';
            deleteButton.style.display = 'inline';
            document.querySelectorAll('.previous-chats li').forEach(li => li.style.display = 'list-item');
        } else {
            searchTextarea.style.display = 'block';
            searchButton.textContent = 'Close Search';
            exportButton.style.display = 'none';
            importButton.style.display = 'none';
            deleteButton.style.display = 'none';
        }
    });
    searchTextarea.addEventListener('input', function() {
        const filter = searchTextarea.value.toLowerCase();
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        document.querySelectorAll('.previous-chats li').forEach((li, index) => {
            const reversedIndex = chats.length - 1 - index;
            const chat = chats[reversedIndex];
            const chatTitle = chat.title.toLowerCase();
            const chatContent = chat.conversation.map(message => message.content.toLowerCase()).join(' ');
            if (chatTitle.includes(filter) || chatContent.includes(filter)) {
                li.style.display = 'list-item';
            } else {
                li.style.display = 'none';
            }
        });
    });
    exportButton.addEventListener('click', function() {
        if (confirm('Do you want to export the chats to the clipboard?')) {
            const chats = localStorage.getItem('chats');
            if (chats) {
                navigator.clipboard.writeText(chats)
                    .then(() => alert('Chats exported to clipboard.'))
                    .catch(err => console.error('Failed to copy chats: ', err));
            } else {
                alert('No chats available to export.');
            }
        }
    });
    importButton.addEventListener('click', function() {
        if (confirm('Do you want to import chats from the clipboard? You need to click the paste button after this confirming. This will overwrite existing chats.')) {
            navigator.clipboard.readText()
                .then(text => {
                    try {
                        const importedChats = JSON.parse(text);
                        if (Array.isArray(importedChats)) {
                            localStorage.setItem('chats', JSON.stringify(importedChats));
                            updateChatListUI();
                            updateMessageCounters();
                            alert('Chats imported successfully.');
                        } else {
                            alert('Invalid chat data.');
                        }
                    } catch (err) {
                        console.error('Failed to parse imported chats: ', err);
                        alert('Failed to import chats.');
                    }
                })
                .catch(err => console.error('Failed to read from clipboard: ', err));
        }
    });
    deleteButton.addEventListener('click', function() {
        if (confirm('Do you want to delete all chats?')) {
            localStorage.removeItem('chats');
            updateChatListUI();
            updateMessageCounters();
            alert('All chats deleted.');
        }
    });
    // Light theme toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            document.body.style.backgroundColor = '#f1f1f1';
            document.documentElement.style.backgroundColor = '#f1f1f1';
        } else {
            localStorage.removeItem('theme');
            document.body.style.backgroundColor = '#333';
            document.documentElement.style.backgroundColor = '#333'
        }
    });
    if (localStorage.getItem('theme')) {
        document.body.classList.add('light-mode');
        document.body.style.backgroundColor = '#f1f1f1';
        document.documentElement.style.backgroundColor = '#f1f1f1';
    }
});