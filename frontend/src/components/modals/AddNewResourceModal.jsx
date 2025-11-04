import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AddNewResourceModal({ isOpen, onClose }) {

    const [formData, setFormData] = useState({
        idNumber: "",
        category: "",
        title: "",
        author: "",
        academicYear: "",
        course: "",
        type: "",
        status: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            idNumber: "",
            title: "",
            author: "",
            academicYear: "",
            course: "",
            type: "",
            status: "",
        }))
    }, [formData.category]);

    const handleClose = () => {
        setFormData({
            idNumber: "",
            category: "",
            title: "",
            author: "",
            academicYear: "",
            course: "",
            type: "",
            status: "",
        })
        onClose();
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/resources/addResources", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error)
                return;
            }
            toast.success("Item added successfully.");

        } catch (error) {
            toast.error(error);
            console.log("Error: ", error);
        }
    }

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md bg-opacity-50">
            <div className="bg-white p-6 rounded-lg relative w-xl">
                <h2 className="text-xl text-center font-semibold mb-4">Add New Resource</h2>
                <form className="space-y-4" onSubmit={handleSave}>
                    {/* CATEGORY SELECT */}
                    <div>
                        <label className="text-sm  font-medium text-gray-700 mb-1 block">
                            Category:
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>Select a category</option>
                            <option value={"Academic Paper"}>Academic Paper</option>
                            <option value={"Book"}>Book</option>
                        </select>
                    </div>

                    {formData.category === "Academic Paper" && (
                        <>
                            <div className="flex flex-row gap-4">
                                <div className="flex flex-1 flex-col gap-2">
                                    {/* ID NUMBER INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Item Number:
                                        </label>
                                        <input
                                            type="text"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleInputChange}
                                            placeholder="Please enter Item Number"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* TITLE INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Title:
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter title"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* AUTHOR INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Author:
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Please enter author"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col gap-2">
                                    {/* ACADEMIC YEAR INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Academic Year:
                                        </label>
                                        <input
                                            type="text"
                                            name="academicYear"
                                            value={formData.academicYear}
                                            onChange={handleInputChange}
                                            placeholder="Please enter academic year"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* COURSE INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Course:
                                        </label>
                                        <input
                                            type="text"
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            placeholder="Please enter the student's course"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* TYPE INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Type:
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            placeholder="Please enter the type"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* ACADEMIC PAPER STATUS SELECT */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Status:
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value={""} disabled>Select status</option>
                                    <option value={"Available"}>Available</option>
                                    <option value={"Checked Out"}>Checked Out</option>
                                    <option value={"Archived"}>Archived</option>
                                </select>
                            </div>
                        </>
                    )}

                    {formData.category === "Book" && (
                        <>
                            <div className="flex flex-row gap-4">
                                {/* ID NUMBER INPUT */}
                                <div className="flex flex-1 flex-col">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Item Number:
                                        </label>
                                        <input
                                            type="text"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleInputChange}
                                            placeholder="Please enter Item Number"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* BOOK TITLE INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Title:
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter title"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col">
                                    {/* BOOK AUTHOR INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Author:
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            placeholder="Please enter author"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* TYPE INPUT */}
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Type:
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            placeholder="Please enter the type"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Select */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    Status:
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value={""} disabled>Select status</option>
                                    <option value={"Available"}>Available</option>
                                    <option value={"Checked Out"}>Checked Out</option>
                                    <option value={"Archived"}>Archived</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="buttons flex justify-end gap-x-4">
                        {formData.category && (
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                            >
                                Save
                            </button>
                        )}
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default AddNewResourceModal;