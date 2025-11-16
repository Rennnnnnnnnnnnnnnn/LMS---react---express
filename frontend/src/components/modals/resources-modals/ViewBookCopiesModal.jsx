import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function ViewBookCopiesModal({ isOpen, onClose, bookDetails }) {

    const [copies, setCopies] = useState([]);

    const getCopyDetails = async () => {

        try {
            const res = await axios.get("/api/resources/getBookCopy", {
                params: {
                    bookTitle: bookDetails.Title_Name,
                    bookAuthor: bookDetails.Author_Name,
                    bookType: bookDetails.Type
                }
            });
            setCopies(res.data)
        } catch (error) {
            console.error("Error fetching copy details:", error);
            setError("Failed to fetch copy details. Please try again later.");
        }
    };

    useEffect(() => {
        getCopyDetails();
    }, [isOpen, bookDetails]);

    if (!isOpen) return;
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md bg-opacity-50 ">
                <div className="bg-white w-3/5 h-150 p-8 rounded-lg shadow-xl overflow-hidden">
                    <div className="flex justify-center gap-8">
                        <div className="bg-purple-200 w-2/5 rounded-xl p-4 border border-gray-500">
                            <p className="text-2xl font-semibold text-gray-800 m-2">
                                BOOK DETAILS
                            </p>
                            <div className="bg-green-100 border border-green-300 rounded-md p-4 mb-6 flex flex-col gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Title: <span className="font-normal">{bookDetails.Title_Name}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Author: <span className="font-normal">{bookDetails.Author_Name}</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Type: <span className="font-normal">{bookDetails.Type}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col bg-orange-200 h-135 w-3/5 overflow-auto rounded-xl p-3 border border-gray-500">
                            <p className="text-2xl font-semibold text-gray-800 m-2">
                                COPY DETAILS
                            </p>

                            <div className="flex-col h-screen bg-gray-200 p-5 overflow-auto scrollbar-hidden rounded-xl">
                                {
                                    copies.map((copy, index) => {
                                        return (
                                            <div className="card flex flex-row justify-between bg-gray-10 border border-gray-500 shadow-2xl gap-2 p-3 rounded-2xl mb-5">
                                                <div className="flex flex-col">
                                                    <p className="text-lg  font-semibold text-gray-800">
                                                        COPY: <span className="font-normal"> {index + 1}</span>
                                                    </p>
                                                    <div className="copy-details w-50 m-2 flex flex-col p-4 shadow-lg bg-gray-50 rounded-lg">
                                                        <p className="text-md font-semibold text-gray-800">
                                                            Item ID: {copy.ID}
                                                        </p>
                                                        <p className="text-md font-semibold text-gray-800">
                                                            Status: {copy.Status}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="buttons bg-green-200 border-b border-black gap-2 flex justify-end items-end pb-2 w-auto" >
                                                    <button>
                                                        VIEW
                                                    </button>
                                                    <button>
                                                        EDIT
                                                    </button>
                                                    <button>
                                                        DELETE
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="mt-auto p-2 text-lg font-semibold text-gray-800">
                                AVAILABLE COPIES:
                                {bookDetails.Available_Copies}/{bookDetails.Total_Copies}
                            </div>
                        </div>
                    </div>
                </div>
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