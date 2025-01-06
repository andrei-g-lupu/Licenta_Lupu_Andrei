// c:\Tutorial_Rag\app\page.tsx

"use client"
import { useState } from 'react';
import Image from "next/image";
import GPTlogo from "C:/Tutorial_Rag/app/public/Unchiul Steli.png"

// Import internal modules
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "C:/Tutorial_Rag/app/components/Bubble"
import LoadingBubble from "C:/Tutorial_Rag/app//components/LoadingBubble"
import PromptSuggestionRow from "C:/Tutorial_Rag/app//components/PromptSuggestionRow"
import ScrollContainer from "C:/Tutorial_Rag/app/components/ScrollContainer" // **Added Import**

const Home = () => {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()

  const noMessages = !messages || messages.length === 0

  const handlePrompt = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }

    append(msg)
  }

  return (
    <main>
      <Image src={GPTlogo} width="200" alt="GPTLogo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Asistentul tau virtual pentru intrebari din domeniul X.
            </p>
            <br />
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <ScrollContainer> {/* **Wrapped Messages with ScrollContainer** */}
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </ScrollContainer>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Intreaba-ma ceva..."
        />
        <input type="submit" value="Genereaza" />
      </form>
    </main>
  )
}

export default Home;