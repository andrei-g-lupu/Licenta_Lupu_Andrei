import PromptSuggestionButton from "./PromptSuggestionButton"

interface PromptSuggestionRowProps {
    onPromptClick: (prompt: string) => void;
}

export default function PromptSuggestionRow({ onPromptClick }: PromptSuggestionRowProps) {
    const suggestions = [
        "Care este articolul 1 din codul fiscal?",
        "Care este definitia unui contract?",
        "Ce este un contract de leasing?"
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
}