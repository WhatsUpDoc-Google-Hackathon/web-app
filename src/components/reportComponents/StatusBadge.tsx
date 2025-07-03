type StatusBadgeProps = {
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "bg-green-100 text-green-700 border-green-300";
    case "Follow-up":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "Critical":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
      status
    )}`}
  >
    {status}
  </span>
);

export default StatusBadge;
