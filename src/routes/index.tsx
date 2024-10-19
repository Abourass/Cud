import { A } from "@solidjs/router";
import { createSignal, onMount } from 'solid-js';

export default function Home() {
  const getChat = () => document.querySelector<HTMLTextAreaElement>('#cud')!;
  const [chatModel, setChatModel] = createSignal<'Elora' | 'agentGreen' | 'Aureial' | 'Socrates' | 'wizzy'>('Socrates');
  const [responseText, setResponseText] = createSignal<string>('');
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [messagesHistory, setMessagesHistory] = createSignal<{ role: string, content: string }[]>([]); // To store the conversation history

  const sendChat = async (message: string) => {
    try {
      const newMessage = { role: 'user', content: message };
      const updatedHistory = [...messagesHistory(), newMessage];

      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: chatModel(),
          messages: updatedHistory,
          stream: true
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      let fullResponse = '';
      const messages = document.querySelector<HTMLUListElement>('#messages')!;
      const responseElement = document.createElement('li');
      responseElement.classList.add('text-left', selectBGColor(chatModel())!, 'text-white', 'rounded-md', 'p-1', 'my-2', 'w-fit', 'mr-auto');
      messages.appendChild(responseElement);

      while (true) {
        const { done, value } = await reader!.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.lastIndexOf('\n');
        if (boundary !== -1) {
          const chunk = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 1);

          try {
            const chunkObj = JSON.parse(chunk);
            console.log({ chunkObj }); // Log each chunk
            fullResponse += chunkObj.message.content;
            setResponseText(prev => prev + chunkObj.message.content);

            // Update the response element's text content
            responseElement.textContent = fullResponse;

            // Scroll to bottom
            scrollToBottom();
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        }
      }

      // Update the messages history with the new response
      const newResponse = { role: 'assistant', content: fullResponse };
      setMessagesHistory([...updatedHistory, newResponse]);

      console.log({ fullResponse }); // Log the final accumulated response
      return fullResponse;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  const selectBGColor = (model: string) => {
    switch (model) {
      case 'Elora':
        return 'bg-pink-600';
      case 'agentGreen':
        return 'bg-green-600';
      case 'Aureial':
        return 'bg-yellow-600';
      case 'Socrates':
        return 'bg-indigo-600';
      case 'wizzy':
        return 'bg-sky-600';
    }
  };

  const clearChat = () => { getChat().value = '' }

  const renderUserMessage = (msg: string) => {
    const messages = document.querySelector<HTMLUListElement>('#messages')!;
    const message = document.createElement('li');
    message.classList.add('text-right', 'bg-sky-600', 'text-white', 'rounded-md', 'p-1', 'my-2', 'w-fit', 'ml-auto');

    message.textContent = msg.trim();
    messages.appendChild(message);
  }

  const chat = async () => {
    const message = `${getChat().value}`;
    if (!message) {
      return;
    }
    clearChat();
    renderUserMessage(message);
    setIsLoading(true);
    try {
      await sendChat(message);
    } catch (error) {
      console.error("Chat request failed:", error);
      alert(`An error occurred: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector<HTMLUListElement>('#messages')!;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  onMount(() => {
    const textarea = getChat();
    textarea.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        chat();
      }
    });
  });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <section>
        <ul class="
        bg-slate-900
        text-white
        rounded-md
        p-4
        mb-2
        list-none
        flex
        flex-col
        " id="messages">
        </ul>
      </section>

      <section class="bg-slate-900 rounded-md p-4">
        <textarea name="cud" id="cud" rows="10" class="
        w-full
        bg-slate-800
        text-white
        rounded-md
        p-2
        focus:outline-none
        focus:ring-2
        focus:ring-sky-600
        "></textarea>

        <div class="flex flex-row justify-between w-full">
          <div class="flex flex-row m-2">
            <label for="model" class="text-white pr-2">Model:</label>
            <select
              name="model"
              id="model"
              class="bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
              onChange={(e) => setChatModel(e.currentTarget.value as any)}>
              <option value="Elora" selected={chatModel() === 'Elora'}>Elora</option>
              <option value="agentGreen" selected={chatModel() === 'agentGreen'}>agentGreen</option>
              <option value="Aureial" selected={chatModel() === 'Aureial'}>Aureial</option>
              <option value="Socrates" selected={chatModel() === 'Socrates'}>Socrates</option>
              <option value="wizzy" selected={chatModel() === 'wizzy'}>wizzy</option>
            </select>
          </div>

          <button class="
          bg-sky-600
          text-white
          rounded-md
          p-2
          focus:outline-none
          focus:ring-2
          focus:ring-sky-600
          "
            onClick={chat}>
            Compile
          </button>
        </div>
      </section>

      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>
    </main>
  );
}
