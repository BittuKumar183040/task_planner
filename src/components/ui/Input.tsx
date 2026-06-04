type InputProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string
};

const Input = ({ label, value, onChange, onKeyDown, placeholder, type = "text", required, className }: InputProps) => {
  return (
    <div className=" w-full">
      <label className={`block text-xs font-medium text-gray-500 mb-1.5 ${className}`}>{label}{required && <span className=" text-red-400">{" *"}</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        required={required}
      />
    </div>
  );
};

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

export const SelectInput = ({ label, value, onChange, options }: SelectInputProps) => {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border p-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

type TextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export const Textarea = ({ label, value, onChange, placeholder, rows = 3 }: TextareaProps) => {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border p-2 outline-none focus:border-gray-500"
      />
    </div>
  );
};


type ButtonProps = {
  label: string;
  pendingLabel?: string;
  isPending?: boolean;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  className?: string;
};

export const DialogConfirmButton = ({ label, pendingLabel, isPending, onClick, type = "button", disabled, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled ?? isPending}
      className={`rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50 ${className}`}
    >
      {isPending && pendingLabel ? pendingLabel : label}
    </button>
  );
};

type Props = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const ChatInput = ({
  value,
  loading,
  onChange,
  onSubmit,
}: Props) => {
  return (
    <div className="mt-4 flex gap-2">
      <div className="flex-1">
        <Input
          label=""
          value={value}
          placeholder="Ask about tasks, projects, teams..."
          onChange={onChange}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !loading
            ) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
};

export default Input;