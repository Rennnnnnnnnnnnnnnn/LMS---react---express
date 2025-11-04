import React from "react";

const ConfirmationModal = ({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure?",
    onConfirm,
    onCancel
}) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>

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
    );
};

export default ConfirmationModal;
