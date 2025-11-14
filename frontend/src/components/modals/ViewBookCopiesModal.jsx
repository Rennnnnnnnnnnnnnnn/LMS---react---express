
function ViewBookCopiesModal({ isOpen, onClose, bookDetails }) {
    if (!isOpen) return;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md bg-opacity-50">
                <div>
                    
                </div>
                qwe
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>


        </>
    )
}

export default ViewBookCopiesModal;