type Props = {
  title: string;
  value: number;
};

const StatsCard = ({ title, value }: Props) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default StatsCard;