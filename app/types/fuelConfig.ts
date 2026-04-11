import { FaGasPump, FaLeaf, FaBolt } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";

const fuelConfig = {
  Essence: {
    icon: FaGasPump,
    color: "text-red-500",
  },
  Diesel: {
    icon: MdLocalGasStation,
    color: "text-blue-500",
  },
  Hybride: {
    icon: FaLeaf,
    color: "text-green-500",
  },
  Électrique: {
    icon: FaBolt,
    color: "text-orange-500",
  },
};
export type FuelType = keyof typeof fuelConfig;