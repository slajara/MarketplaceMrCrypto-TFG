import { useState } from 'react';

const CardEvent: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="relative">
      <img
        src="/eivissa.avif"
        alt="MrCrypto"
        className="cursor-pointer w-8/12"
        onClick={handleImageClick}
      />

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closePopup}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <img
              src="/images/MrCrypto-8141.png"
              alt="MrCrypto"
              className="w-full h-auto"
            />
            <h2 className="text-2xl font-bold mt-4">Título del evento</h2>
            <p className="mt-2">Descripción del evento</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardEvent;
