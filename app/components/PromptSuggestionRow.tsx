import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionRow =  ( { onPromptClick } ) => {
    const prompts = [
        "Care este Articolul 1 din codul Penal?",
        "Care este pedeapsa maxima pentru furt calificat?",
        "Care este procentul de impozit pe venit pe PFA?",
        "Cum te cheama?"
    ]
    
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}                    
                    />)}    
        </div>
    )
}

export default PromptSuggestionRow