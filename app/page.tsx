import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div
  className="min-h-screen pt-12 sm:pt-14 md:pt-16"
      style={{ backgroundColor: "#283b5aff" }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.7s;
        }
        
        .animate-bounce-in {
          opacity: 0;
          animation: bounceIn 1s ease-out forwards;
          animation-delay: 1s;
        }
        
        .animate-rotate-in {
          opacity: 0;
          animation: rotateIn 0.8s ease-out forwards;
          animation-delay: 0.7s;
        }
      `}</style>
      
<div className="min-h-screen bg-black sm:mt-20  md:mt-20 lg:mt-20">
        <div className="flex items-center justify-center px-6 md:px-10 py-6">
          {/* Cadre contenant texte et carte */}
          <div className="bg-black backdrop-blur-md rounded-lg border-2 border-orange-500 p-4 md:p-6 max-w-5xl w-full md:mt-15 mt-10 lg:mt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Texte à gauche */}
              <div className="w-full md:w-1/2 animate-fade-in-up">
                <p className="text-base md:text-xl text-white drop-shadow-md leading-relaxed">
                  Votre partenaire de confiance pour vos déplacements un véhicule{" "}
                  <span className="font-bold text-orange-400"> 100% équitable et digitalisé.</span>
                </p>

                {/* Image R.jpeg */}
                <div className="w-full flex items-center justify-center animate-rotate-in md:mt-4 md:-ml-9 md:-ml-10 ">
                  <Image
                    src="/images/R-bg.png"
                    alt="Carte de la France"
                    width={400}
                    height={233}
                    className="
                      w-[180px] h-auto
                      sm:w-[220px] sm:h-auto
                      md:w-[350px] md:h-auto
                      rounded-lg object-contain
                    "
                    loading="lazy"
                  />
                </div>
                
                {/* Boutons */}
   <div className="flex justify-between items-center gap-2 mt-4 sm:justify-start">
  <Link href="/partenaire/fiche-partenaire" className="flex-1">
    <button className="w-full h-10 sm:h-12 px-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] sm:text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap">
      Devenir partenaire
    </button>
  </Link>

  <Link href="/adherant/inscription-formulaire" className="flex-1">
    <button className="w-full h-10 sm:h-12 px-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] sm:text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap">
      Adhérant
    </button>
  </Link>

  <Link href="/adherant/mission-page" className="flex-1">
    <button className="w-full h-10 sm:h-12 px-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] sm:text-sm font-bold rounded-lg transition-colors duration-200 whitespace-nowrap">
      Mission
    </button>
  </Link>
</div>

              </div>

              {/* Carte de France à droite */}
              <div className="w-full md:w-1/2 flex items-center justify-center animate-rotate-in">
                <Image
                  src="/images/franceMap.jpg"
                  alt="Carte de la France"
                  width={400}
                  height={233}
                  className="
                    w-[180px] h-auto
                    sm:w-[220px] sm:h-auto
                    md:w-[350px] md:h-auto
                    rounded-lg object-contain
                  "
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}