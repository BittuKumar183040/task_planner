import { X } from "lucide-react";
import { useState } from "react";

type TagsProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const Tags = ({ tags, onChange }: TagsProps) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]!);
    }
  };

  return (
    <div>
      <label className="mb-1 block font-medium">Tags</label>
      <div
        className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded border px-2 py-1.5 focus-within:border-gray-500 cursor-text"
        onClick={() => document.getElementById("tag-input")?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-600"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => tagInput && addTag(tagInput)}
          placeholder={tags.length === 0 ? "Add tags…" : ""}
          className="min-w-[80px] flex-1 border-none bg-transparent outline-none"
        />
      </div>
      <p className="mt-1 text-gray-400">Press Enter or comma to add a tag</p>
    </div>
  );
};

export default Tags;