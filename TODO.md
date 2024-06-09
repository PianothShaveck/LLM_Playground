# Known issues to fix

- [ ] Using the run button on a Gemini 1.5 pro model by Shadow for whatever reason appears to not work
- [ ] Images appear to load slowly. Could it be because they load twice? Attempt to find a solution to this issue
- [ ] Dall-e-3 probably needs longer timeout(?)
- [ ] Selecting or copying text while a response is being generated doesn't work well

# Features to be implemented (more or less, in order of priority)

- [ ] Top_k parameter
- [ ] Export chat as JSON and import chat as JSON
- [ ] Toggle to disable the auto compressing of messages ("Show More")
- [ ] Support for SDXL on api.discord.rocks
- [ ] Comparison mode, with a button only visible on wide screens
- [ ] More icons, mainly for the settings menu which currently still has basically none (mostly because of lack of time).
- [ ] Implement some kind of solution to solve the issue with local storage limit without saving all conversation. Maybe let users put their GitHub Gists key in the settings, in order to save the chats with no limits? Find some solution that gives the user the possibility of deleting the data easily, while remaining free to host and with absolute zero invasion of privacy: the main idea to realize is that the user hosts the conversations, either with local storage only (which has 5 MB limitation so the space is quite limited), or with some other way.
- [ ] Add the possibility of moving messages up and down the history. Maybe one or two buttons on the upper part of the message? Or maybe make messages draggable?
- [ ] "Confirm edit and run" button on messages. Like editing messages on ChatGPT, but it should be a separate button since the user doesn't necessarily always want to overwrite the next messages.
- [ ] Image upload support (mainly for other endpoints, for now).
- [ ] Add support for native gemini Api, since it has a significantly different syntax for messages
- [ ] Advanced mode for web search: right now, what's happening is just a very fast backend request to fetch the first 7 more relevant result with snippets for each result. This works well, but ideally there should be some toggle to make the backend do a more in-depth search, maybe with multiple different keywords, and maybe entering pages that appear to be relevant and summarizing the results before sending the request to the LLM.
- [ ] Prompt enhancement toggle: if the user selects this, before sending the message, there should be some kind of backend request that improves the prompt so the LLM potentially gives a better answer.
- [ ] System prompt enhancement button: automatically improves a given system prompt
- [ ] Buttons to suggest follow-up questions. Like some other chats, there could be a backend request using just the latest assistant message (after generating it), in order to give a few ideas of follow up questions.
- [ ] RAG system. After a few messages, instead of using the entire conversation, for better cost efficiency there should be a rag system, so not all messages are kept in the memory. Alternatively (or in addition), there could be a system that automatically summarizes the content of messages while the conversation gets longer and keeps the summary in the memory. Maybe this memory could then be deleted when closing the chat, like a short-term memory just when sending multiple messages in a row.
- [ ] Library of public system prompts. Not too different from the idea of "GPTs".
- [ ] Multiple language support. Once most of the icons replace the buttons that use text, there shouldn't be too much visible text to be translated. This is not really high priority for now though.
- [ ] Gradually redesign UI and make it more accessible. Add animations, improve the colors, but keep it lightweight. Lowest priority since some of the redesign already happens while new features get added anyway.