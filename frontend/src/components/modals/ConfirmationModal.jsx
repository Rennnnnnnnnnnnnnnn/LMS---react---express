import { useEffect } from "react";

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {

/*     useEffect(() => {
        console.log("qweasdzxc")
    }, []); */

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-gray-300 rounded-lg shadow-lg w-110 p-5">
                <div className="bg-gray-200 rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-5">⚠️{title}</h2>
                    <p className="m-4">
                        {message.map((line, index) => (
                            <span key={index}>
                                {line}
                                {index < message.length - 1 && <br />}

                            </span>
                        ))}
                        ❗
                    </p>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded bg-red-300 text-gray-800 hover:bg-red-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
