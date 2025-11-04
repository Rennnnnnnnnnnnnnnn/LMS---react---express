import React, { useState, useRef } from "react";
import UserPNG from "../../assets/UserPNG.png";
import { toast } from "react-toastify";

const AddAccountModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        Name: "",
        Course: "",
        Year_And_Section: "",
        Email: "",
        Student_Number: "",
        Account_Type: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            form.append("Name", formData.Name);
            form.append("Student_Number", formData.Student_Number);
            form.append("Course", formData.Course);
            form.append("Year_And_Section", formData.Year_And_Section);
            form.append("Account_Type", formData.Account_Type);
            form.append("Email", formData.Email);

            if (selectedFile) {
                form.append("profileImage", selectedFile); // must match the Multer field name
            }

            const res = await fetch("/api/accounts/addAccount", {
                method: "POST",
                body: form, // note: no "Content-Type" header needed for FormData
            });

            const data = await res.json();
            console.log("DATA ", data);
            if (res.ok) {
                setFormData({
                    Name: "",
                    Course: "",
                    Year_And_Section: "",
                    Email: "",
                    Student_Number: "",
                    Account_Type: ""
                });
                setSelectedFile(null);
                toast.success("Account added successfully!");
                onSuccess();
                onClose();
            } else {
                toast.error(data.error || "Failed to add account.");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Something went wrong.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8"
            >
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Create New Account</h2>
                <div className="flex gap-6 items-start">
                    {/* Avatar */}
                    <div className="flex flex-col flex-shrink-0 justify-center">
                        <div className="w-[100px] h-[100px] rounded-full border-2 border-blue-600 p-1 shadow-md">
                            <img
                                src={selectedFile ? URL.createObjectURL(selectedFile) : UserPNG}
                                alt="User avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            className="mt-3 text-sm text-blue-600 hover:underline"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Add Photo
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                    </div>
                    {/* Form Fields */}
                    <div className="flex-1">
                        <div className="flex flex-col gap-4">
                            {/* Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-row gap-4">
                                <div className="flex flex-1 flex-col gap-4">
                                    {/* Student Number */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            ID Number
                                        </label>
                                        <input
                                            type="number"
                                            name="Student_Number"
                                            value={formData.Student_Number}
                                            onChange={handleChange}
                                            placeholder="ID Number"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* Account Type */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Account Type
                                        </label>
                                        <select
                                            name="Account_Type"
                                            value={formData.Account_Type}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        >
                                            <option value="" disabled className="text-gray-400">
                                                Select Account Type
                                            </option>
                                            <option value={"Student"}>
                                                Student
                                            </option>
                                            <option value={"Teacher"}>
                                                Teacher
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col gap-4">
                                    {/* Course */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Course
                                        </label>
                                        <input
                                            type="text"
                                            name="Course"
                                            value={formData.Course}
                                            onChange={handleChange}
                                            placeholder="BSIT / BSCS"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    {/* Year & Section */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Year & Section
                                        </label>
                                        <input
                                            type="text"
                                            name="Year_And_Section"
                                            value={formData.Year_And_Section}
                                            onChange={handleChange}
                                            placeholder="e.g. 3A"
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Email */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAccountModal;
