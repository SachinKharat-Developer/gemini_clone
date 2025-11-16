import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isDetailed, setIsDetailed] = useState(false);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setIsDetailed(false);
  };

  // ---------- Send Prompt (short answer first) ----------
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setIsDetailed(false);

    const userPrompt = prompt || input;

    setPrevPrompts((prev) => [...prev, userPrompt]);
    setRecentPrompt(userPrompt);

    // Force short answer first
    const shortResponse = await runChat(
      `Please give a **short, concise, one-paragraph answer** for this prompt:\n${userPrompt}`
    );

    // Format short response
    const formattedShort = shortResponse.split("\n").join("<br/>");
    const words = formattedShort.split(" ");

    // Animate short answer word by word
    for (let i = 0; i < words.length; i++) {
      delayPara(i, words[i] + " ");
    }

    setLoading(false);
    setInput("");
  };

  // ---------- Detailed Answer ----------
  const getDetailedAnswer = async () => {
    if (!recentPrompt) return;
    setLoading(true);
    setIsDetailed(true);

    const detailedResponse = await runChat(
      `Please expand this short answer into a **detailed, readable explanation**:\n${resultData}`
    );

    // Format for readability
    const formatted = detailedResponse.split("\n").join("<br/>");
    setResultData(formatted);
    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    getDetailedAnswer,
    isDetailed,
    setIsDetailed,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
