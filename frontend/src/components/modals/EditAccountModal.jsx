import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import UserPNG from "../../assets/UserPNG.png";
const API_URL = import.meta.env.VITE_API_URL;

function EditAccountModal({ isOpen, onClose, onSuccess, selectedAccount }) {

    const [formData, setFormData] = useState({
        Name: "",
        Course: "",
        Year_And_Section: "",
        Email: "",
        Student_Number: ""
    });
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (selectedAccount) {
            setFormData({
                Name: selectedAccount.Name,
                Course: selectedAccount.Course,
                Year_And_Section: selectedAccount.Year_And_Section,
                Email: selectedAccount.Email,
                Student_Number: selectedAccount.Student_Number
            });
        }
        setSelectedFile(null);
    }, [selectedAccount]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const form = new FormData();
            form.append("Name", formData.Name);
            form.append("Student_Number", formData.Student_Number);
            form.append("Course", formData.Course);
            form.append("Year_And_Section", formData.Year_And_Section);
            form.append("Email", formData.Email);
            form.append("Account_Type", formData.Account_Type);

            if (selectedFile) {
                form.append("profileImage", selectedFile);
            }

            const res = await fetch(`/api/accounts/${selectedAccount.Student_Number}`, {
                method: "PUT",
                body: form, // ✅ use FormData directly
                // Do NOT set "Content-Type", browser handles it
            });

            const data = await res.json();

            if (res.ok) {
                alert("Account updated successfully!");
                toast.success("Account updated successfully!");
                onSuccess();
                onClose();
            } else {
                alert(data.message || "Failed to update account.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                    Edit Account
                </h2>

                <div className="flex gap-6 items-start">
                    {/* Avatar */}
                    <div className="flex flex-col flex-shrink-0 justify-center">
                        <div className="w-[100px] h-[100px] rounded-full border-2 border-blue-600 p-1 shadow-md">
                            <img
                                src={
                                    selectedFile
                                        ? URL.createObjectURL(selectedFile)
                                        : selectedAccount?.Profile_Picture
                                            ? `${API_URL}/uploads/${selectedAccount.Profile_Picture}`
                                            : UserPNG
                                }
                                alt="User avatar"
                                className="w-full h-full rounded-full object-cover"
                            />

                        </div>
                        <button className="mt-3 text-sm text-blue-600 hover:underline"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Change Photo
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
                        <div className="flex flex-col space-y-6">
                            {/* Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 w-full">
                                {/* Student Number */}
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Student Number
                                    </label>
                                    <input
                                        type="text"
                                        name="Student_Number"
                                        value={formData.Student_Number}
                                        disabled
                                        className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
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
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    >
                                        <option value="" disabled className="text-gray-400">
                                            Select Account Type
                                        </option>
                                        <option value={"qwe"}>
                                            Student
                                        </option>
                                        <option value={"Teacher"}>
                                            Teacher
                                        </option>
                                    </select>
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
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditAccountModal;
