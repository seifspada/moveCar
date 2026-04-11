type Props = {
  creneau: string;
  isSelected: boolean;
  isReserved: boolean;
  onClick: () => void;
};

export default function CreneauButton({ creneau, isSelected, isReserved, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isReserved}
      className={`p-2.5 border-2 rounded-lg text-xs font-medium transition-all ${
        isSelected
          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
          : isReserved
          ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed'
          : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
      }`}
    >
      <span className={isReserved ? 'line-through' : ''}>{creneau}</span>
      {isReserved && (
        <div className="text-[10px] text-red-500 mt-0.5">Réservé</div>
      )}
    </button>
  );
}