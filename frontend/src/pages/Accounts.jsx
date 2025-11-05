import { useEffect, useState } from "react";
import TablePagination from '@mui/material/TablePagination';
import SearchBar from "../components/SearchBar";
import AddAccountModal from "../components/modals/AddNewAccountModal";
import EditAccountModal from "../components/modals/EditAccountModal";
import axios from "axios";
import { toast } from "react-toastify";

import DeleteIcon from "../assets/Delete_Icon.png";
import EditIcon from "../assets/Edit_Icon.png";
import ConfirmationModal from "../components/modals/ConfirmationModal";

function Accounts() {
    // Selection-related state
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedCourses, setSelectedCourses] = useState({});

    // Pagination-related state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Search-related state
    const [searchTerm, setSearchTerm] = useState("");

    // Modal-related state
    const [isAddNewAccountModalOpen, setIsAddNewAccountModalOpen] = useState(false);
    const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        type: ""
    });

    // Data-related state
    const [accounts, setAccounts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [pendingEditData, setPendingEditData] = useState(null);

    const getAccounts = async () => {
        /*  try {
             const filters = Object.entries(selectedCourses).map(([course, sections]) => {
                 if (sections.length > 0) {
                     return `${course}:${sections.join(',')}`;
                 } else {
                     return course;
                 }
             })
                 .join(';');
 
             const searchQuery = encodeURIComponent(searchTerm);
             const res = await fetch(
                 `/api/accounts/getAccounts?page=${page + 1}&limit=${rowsPerPage}&filters=${encodeURIComponent(filters)}&search=${searchQuery}`
             );
             const data = await res.json();
             setAccounts(data.data);
             setTotal(data.total);
         } catch (error) {
             console.error(error);
         } */

        try {
            const filters = Object.entries(selectedCourses).map(([course, sections]) => {
                if (sections.length > 0) {
                    return `${course}:${sections.join(',')}`;
                } else {
                    return course;
                }
            }).join(';');

            console.log("KORS", selectedCourses)
            console.log("FILTERS to send:", filters);

            const res = await axios.get("/api/accounts/getAccounts", {
                params: {
                    filters: filters
                }
            })
            console.log('Response:', res.data);  // Handle the response here
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    };

    useEffect(() => {
        console.log("KORS ", selectedAccount)
    }, [])

    const handleDelete = (student_Number) => {
        setConfirmationModal({
            isOpen: true,
            title: "Delete Account",
            message: [
                "Are you sure you want to delete this account?",
                "This action cannot be undone."
            ],
            onConfirm: () => performDelete(student_Number),
            type: "delete"
        })
    }

    const performDelete = async (student_Number) => {
        try {
            const res = await fetch(`/api/accounts/${student_Number}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Account deleted successfull!")
                fetchCourses();
                getAccounts();
            } else {
                toast.error("Failed to delete account.")
                console.log(data.error);
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            toast.error("Something went wrong.")
        }
    };

    const handleEdit = (selectedAccount) => {
        setSelectedAccount(selectedAccount);
        setIsEditAccountModalOpen(true);
    }

    const handleSaveConfirmation = (formData, selectedFile) => {
        setPendingEditData({ formData, selectedFile });
        setConfirmationModal({
            isOpen: true,
            title: "Save Changes",
            message: ["Are you sure you want to save changes?"],
            onConfirm: () => {
                performEditSave(formData, selectedFile)
            }
        })
    }

    const performEditSave = async (formData, selectedFile) => {

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
                body: form,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account updated successfully!");
                getAccounts();
                fetchCourses();
                setIsEditAccountModalOpen(false);
            } else {
                alert(data.error || "Failed to update account.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong.");
        } finally {
            setPendingEditData(null);
        }
    };

    const fetchCourses = async () => {
        const res = await fetch("/api/accounts/courses-with-sections");
        const data = await res.json();
        setCourses(data);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        getAccounts();
    }, [page, rowsPerPage]);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setPage(0);
        getAccounts();
    }, [searchTerm, selectedCourses]);

    const toggleSection = (course, section) => {
        setSelectedCourses(prev => {
            const sections = prev[course] || [];
            return {
                ...prev,
                [course]: sections.includes(section)
                    ? sections.filter(s => s !== section)
                    : [...sections, section]
            };
        });
    };

    const toggleCourse = (course) => {
        setSelectedCourses(prev => {
            if (prev[course]) {
                const newState = { ...prev };
                delete newState[course];
                return newState;
            } else {
                return { ...prev, [course]: [] };
            }
        });
    };

    const closeConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
            type: ""
        });
    };

    return (
        <>
            <div className="flex mt-4 justify-between items-center bg-orange-200">
                <h1 className="text-2xl ml-10 ">Accounts Page</h1>
                <div className="">

                    <div className="flex gap-x-6 justify-end items-center">
                        <button
                            className="bg-gray-400 hover:bg-gray-700 text-black hover:text-white font-bold py-1 px-3 rounded"
                            onClick={() => setIsAddNewAccountModalOpen(true)}
                        >
                            +
                        </button>
                        <div className="h-8 w-80">
                            <SearchBar
                                placeholder="Search..."
                                onSearch={setSearchTerm}
                            />
                        </div>
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </div>
            <div className="main-body flex flex-row bg-yellow-400 h-[810px]">
                <div className="side-bar bg-red-400 p-8 w-70 h-[96%] overflow-auto scrollbar-hide m-4">
                    <div>
                        <fieldset className="space-y-2 ">
                            <legend className="text-lg font-semibold">Select Courses</legend>

                            {courses.map(c => (
                                <div key={c.course} className="space-y-2">
                                    {/* Course checkbox */}
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedCourses[c.course]}
                                            onChange={() => toggleCourse(c.course)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="font-medium">{c.course}</span>
                                    </label>

                                    {/* Sections for selected course */}
                                    {selectedCourses[c.course] && (
                                        <div className="ml-6 space-y-1">
                                            {c.sections.map(section => (
                                                <label key={section} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCourses[c.course].includes(section)}
                                                        onChange={() => toggleSection(c.course, section)}
                                                        className="form-checkbox h-4 w-4 text-blue-600"
                                                    />
                                                    <span>{section}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </fieldset>
                    </div>
                </div>

                <div className="main-body flex-1 bg-blue-200 p-4 overflow-auto scrollbar-hide">
                    <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-400">
                            <tr>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase"></th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Name</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Course - Year&Section</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Email</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account, index) => (
                                <tr key={account.Student_Number} className="border-b border-gray-200 hover:bg-gray-300 ">
                                    <td className="px-8 py-2">{index + 1 + page * rowsPerPage}</td>
                                    <td className="px-8 py-2">{account.Name}</td>
                                    <td className="px-8 py-2">{account.Course} - {account.Year_And_Section}</td>
                                    <td className="px-8 py-2">{account.Email}</td>

                                    <td className="flex gap-x-4 justify-center items-center px-1 py-1">
                                        <button
                                            className="bg-red-200 px-2 py-2 rounded-xl h-10 w-10"
                                            onClick={() => handleEdit(account)}
                                        >
                                            <img
                                                src={EditIcon}
                                                alt="Edit Icon"

                                            />

                                        </button>
                                        <button
                                            className="bg-red-200 px-2 py-2 rounded-xl h-10 w-10"
                                            onClick={() => handleDelete(account.Student_Number)}
                                        >
                                            <img
                                                src={DeleteIcon}
                                                alt="Delete Icon"

                                            />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            </div>

            <AddAccountModal
                isOpen={isAddNewAccountModalOpen}
                onClose={() => {
                    setIsAddNewAccountModalOpen(false);
                }}
                onSuccess={() => {
                    getAccounts();
                    fetchCourses();
                }}
            />

            <EditAccountModal
                isOpen={isEditAccountModalOpen}
                onClose={() => {
                    setIsEditAccountModalOpen(false);
                }}
                selectedAccount={selectedAccount}
                onSuccess={() => {
                    getAccounts();
                    fetchCourses();
                }}
                onSaveConfirmation={handleSaveConfirmation}
            />

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                title={confirmationModal.title}
                message={confirmationModal.message}
                onConfirm={() => {
                    confirmationModal.onConfirm?.(),
                        closeConfirmationModal();
                }}
                onCancel={closeConfirmationModal}
                type={confirmationModal.type}
            />

        </>
    )
}
export default Accounts;