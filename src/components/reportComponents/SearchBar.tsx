import { MdSearch } from "react-icons/md";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="flex items-center mb-4 bg-white w-full max-w-none rounded-2xl shadow-none border-b border-gray-100 px-8 py-4">
    <MdSearch className="text-accent text-xl mr-2" />
    <input
      type="text"
      className="flex-1 bg-transparent outline-none text-[var(--color-text)] placeholder-gray-400 px-2 py-1"
      placeholder="Search by patient name or ID..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
