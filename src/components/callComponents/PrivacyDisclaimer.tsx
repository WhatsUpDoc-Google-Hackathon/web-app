import { FaLock } from "react-icons/fa6";

const PrivacyDisclaimer = () => (
  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded shadow flex items-center gap-1">
    <FaLock className="text-gray-500 text-md" /> Your data is private and
    securely processed.
  </span>
);

export default PrivacyDisclaimer;
