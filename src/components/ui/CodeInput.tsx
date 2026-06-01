import { useRef } from "react";

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean
  classname?: string
  inputClassname?: string
};

const CodeInput = ({ value, onChange, length = 6, disabled = true, classname, inputClassname }: PinInputProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    const cleaned = char.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!cleaned) return;

    const chars = value.split("");
    chars[index] = cleaned[0]!;
    const next = chars.join("").slice(0, length);
    onChange(next.padEnd(length, " ").slice(0, length));

    if (cleaned && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const chars = value.split("");
      chars[index] = " ";
      onChange(chars.join(""));
      if (index > 0) inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, length);
    onChange(pasted.padEnd(length, " ").slice(0, length));
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className={`flex gap-2 ${classname}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="text"
          disabled={disabled}
          maxLength={1}
          value={value[i]?.trim() ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={` size-11 rounded-lg border border-gray-200 bg-gray-50 text-center text-sm font-mono font-semibold uppercase tracking-widest outline-none transition-all focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200 ${inputClassname}`}
        />
      ))}
    </div>
  );
};

export default CodeInput;