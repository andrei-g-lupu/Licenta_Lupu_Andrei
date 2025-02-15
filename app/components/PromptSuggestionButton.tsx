interface PromptSuggestionButtonProps {
    text: string;
    onClick: () => void;
}

const PromptSuggestionButton: React.FC<PromptSuggestionButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className="px-4 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl
                     hover:bg-blue-50 hover:border-blue-300 hover:shadow-md
                     transition-all duration-200 
                     shadow-sm text-sm font-medium
                     max-w-[280px] truncate"
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default PromptSuggestionButton