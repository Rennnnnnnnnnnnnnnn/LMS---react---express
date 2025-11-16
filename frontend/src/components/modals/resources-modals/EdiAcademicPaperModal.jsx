import { useState, useEffect } from "react";


function EditAcademicPaperModal({ isOpen, onClose, academicPaperDetails, onSaveConfirmation }) {

    const [formData, setFormData] = useState({
        itemID: "",
        Title_Name: "",
        Author_Name: "",
        Academic_Year: "",
        Course: "",
        Type: "",
        Status: ""
    })

    useEffect(() => {
        setFormData({
            itemID: academicPaperDetails.ID || "",
            Title_Name: academicPaperDetails.Title_Name || "",
            Author_Name: academicPaperDetails.Author_Name || "",
            Academic_Year: academicPaperDetails.Academic_Year || "",
            Course: academicPaperDetails.Course || "",
            Type: academicPaperDetails.Type || "",
            Status: academicPaperDetails.Status || ""
        });
    }, [academicPaperDetails]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    if (!isOpen) return null
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white h-115 w-150 rounded-md">
                    <div className="flex flex-col p-8 gap-2">
                        <p className="font-semibold text-xl mb-2">Edit academic paper details:</p>
                        <div className="flex flex-row gap-4">
                            {/*     1st Column   */}
                            <div className="flex flex-col flex-1 gap-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        ID:
                                    </label>
                                    <input
                                        name="itemID"
                                        disabled
                                        value={formData.itemID}
                                        className="w-full border rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Title:
                                    </label>
                                    <input
                                        name="Title_Name"
                                        type="text"
                                        onChange={handleInputChange}
                                        value={formData.Title_Name}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Author:
                                    </label>
                                    <input
                                        name="Author_Name"
                                        type="text"
                                        onChange={handleInputChange}
                                        value={formData.Author_Name}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            {/*     2nd Column   */}
                            <div className="flex flex-col flex-1 gap-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Academic Year:
                                    </label>
                                    <input
                                        name="Academic_Year"
                                        type="text"
                                        onChange={handleInputChange}
                                        value={formData.Academic_Year}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Course:
                                    </label>
                                    <input
                                        name="Course"
                                        type="text"
                                        onChange={handleInputChange}
                                        value={formData.Course}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Type:
                                    </label>
                                    <input
                                        name="Type"
                                        type="text"
                                        onChange={handleInputChange}
                                        value={formData.Type}
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Status:
                            </label>
                            <select
                                name="Status"
                                value={formData.Status}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            >
                                <option value={"Available"}>Available</option>
                                <option value={"Checked Out"}>Checked Out</option>
                                <option value={"Archived"}>Archived</option>
                            </select>
                        </div>

                        <div className="flex flex-row justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 w-20 rounded-lg bg-blue-600 text-white hover:bg-blue-900 transition"
                                onClick={() => {
                                    onSaveConfirmation(formData);
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 w-20 rounded-lg border border-gray-600 text-gray-700 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditAcademicPaperModal;