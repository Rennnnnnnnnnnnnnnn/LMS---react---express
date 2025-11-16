import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Third-party libraries
import axios from "axios";
import qs, { stringify } from "qs";
import TablePagination from '@mui/material/TablePagination';
// Utilities
import formatDate from "../utits/formatDate";
// Components
import SearchBar from "../components/SearchBar";
import AddNewResourceModal from "../components/modals/resources-modals/AddNewResourceModal";
// Assets
import DeleteIcon from "../assets/icons/Delete_Icon.png";
import EditIcon from "../assets/icons/Edit_Icon.png";
import EyeIcon from "../assets/Eye_Icon.png";
import ViewIcon from "../assets/icons/ViewActivityLog_Icon.png";
// Modals
import ViewBookCopiesModal from "../components/modals/resources-modals/ViewBookCopiesModal";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import EditAcademicPaperModal from "../components/modals/resources-modals/EdiAcademicPaperModal";


function Resources() {
    // Selection-related state
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    // Pagination-related state
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    // Search and filter-related state
    const [searchTerm, setSearchTerm] = useState("");
    const [types, setTypes] = useState([]);
    const [status, setStatus] = useState("");
    // Modal state
    const [isAddNewResourceModalOpen, setIsAddNewResourceModalOpen] = useState(false);
    const [isViewBookCopiesModalOpen, setIsViewBookCopiesModalOpen] = useState(false);
    const [isEditAcademicPaperModalOpen, setIsEditAcademicPaperModalOpen] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        type: ""
    });
    // Data-related state
    const [items, setItems] = useState([]);
    const [bookDetails, setBookDetails] = useState({});
    const [academicPaperDetails, setAcademicPaperDetails] = useState({});
    const [pendingEditData, setPendingEditData] = useState(null);
    //FETCH DATA
    const getResources = async () => {
        try {
            const res = await axios.get("/api/resources/getResources", {
                params: {
                    selectedCategory: selectedCategory,
                    selectedTypes: selectedTypes,
                    status: status,
                    page: page,
                    limit: limit,
                    searchTerm: searchTerm,
                },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
            });
            setItems(res.data.rows);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        }
    };

    //FETCH DISTINCT TYPES
    const fetchDistinctTypes = async () => {
        if (!selectedCategory) return
        try {
            const res = await axios.get("/api/resources/types", {
                params: { category: selectedCategory },
            });
            setTypes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveConfirmation = (formData) => {
        setPendingEditData({ formData });
        setConfirmationModal({
            isOpen: true,
            title: "Save Changes",
            message: ["Are you sure you want to save changes?"],
            onConfirm: () => {
                performEditSave(formData);
            }
        })
    }

    const performEditSave = async (formData) => {
        try {
            const editedAcademicPaperDetails = {
                itemID: formData.itemID,
                Category: formData.Category,
                Title_Name: formData.Title_Name,
                Author_Name: formData.Author_Name,
                Academic_Year: formData.Academic_Year,
                Course: formData.Course,
                Type: formData.Type,
                Status: formData.Status,
            };

            const res = await fetch(`/api/resources/edit-resources/${academicPaperDetails.ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedAcademicPaperDetails),
            })

            const data = await res.json();

            if (res.ok) {
                toast.success("Academic paper record updated successful!");
                setIsEditAcademicPaperModalOpen(false);
                getResources();
            } else {
                console.log(data.error);
                toast.error(data.error || "Failed to update account.");

            }

        } catch (err) {
            console.error("Error during account update:", err);
            const errorMessage = err?.message || "Something went wrong.";
            toast.error(errorMessage);
            setPendingEditData(null);
        }
    }

    const closeConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
            type: ""
        });
    };



    const handleCheckboxChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type) // remove if already selected
                : [...prev, type] // add if not selected
        );
    };

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handlechangelimit = (e) => {
        setLimit(parseInt(e.target.value, 10));
        setPage(0);
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    }

    const handleViewBookCopiesButtonClick = (item) => {
        setBookDetails(item);
        setIsViewBookCopiesModalOpen(true)
    }

    const handleEditAcademicPaperButtonClick = (item) => {
        setAcademicPaperDetails(item);
        setIsEditAcademicPaperModalOpen(true);

    }

    useEffect(() => {
        getResources();
    }, [searchTerm, selectedCategory, page, limit, selectedTypes, status]);

    useEffect(() => {
        fetchDistinctTypes();
        setPage(0);
    }, [selectedCategory]);

    return (
        <>
            <div className="flex flex-row justify-end mt-4 items-center bg-orange-200">
                <div className="flex flex-row items-center gap-4 justify-end">
                    <button
                        className="bg-gray-400 hover:bg-gray-700 text-black hover:text-white hover:cursor-pointer font-bold py-1 px-3 rounded"
                        onClick={() => setIsAddNewResourceModalOpen(true)}
                    >
                        +
                    </button>
                    <div className="h-8 w-60">
                        <SearchBar
                            placeholder="Search..."
                            onSearch={setSearchTerm}
                        />
                    </div>
                    <select
                        className="p-1 h-10 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        id="status" value={status} onChange={handleStatusChange}>
                        <option value="">All</option>
                        <option value="Available">Available</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="Archived">Archived</option>
                    </select>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={limit}
                        onRowsPerPageChange={handlechangelimit}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-x-4 p-4">
                <aside className="side-bar bg-green-300 border-4 border-green-500 flex flex-col w-48 p-4">
                    {/* Books */}
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-2 font-semibold">
                            <input
                                type="radio"
                                id="books"
                                name="category"
                                value="books"
                                checked={selectedCategory === "books"}
                                onChange={() => {
                                    setSelectedCategory("books");
                                    setSelectedTypes([]);
                                }}
                            />
                            <label htmlFor="books">Books</label>
                        </div>

                        {selectedCategory === "books" && (
                            <div className="pl-6 space-y-1">
                                {types.map((type, index) => (
                                    <label key={index} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer"
                                            onChange={() => handleCheckboxChange(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Academic Papers */}
                    <div className="flex flex-col gap-y-2 mt-4">
                        <div className="flex items-center gap-x-2 font-semibold">
                            <input
                                type="radio"
                                id="academic-papers"
                                name="category"
                                value="academic-papers"
                                checked={selectedCategory === "academic-papers"}
                                onChange={() => {
                                    setSelectedCategory("academic-papers");
                                    setSelectedTypes([]);
                                }}
                            />
                            <label htmlFor="academic-papers">Academic Papers</label>
                        </div>

                        {selectedCategory === "academic-papers" && (
                            <div className="pl-6 space-y-1">
                                {types.map((type, index) => (
                                    <label key={index} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer"
                                            onChange={() => handleCheckboxChange(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                <main className="flex-1 p-4 bg-blue-100 bg-green-300 h-[810px] border-4 border-green-500 overflow-auto scrollbar-hidden">
                    {items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 bg-white shadow-md">
                                <thead className="bg-gray-400">
                                    <tr>
                                        {selectedCategory === "books" ? (
                                            <>
                                                <th></th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Title</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Author</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Type</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Available Copies</th>
                                            </>
                                        ) : (
                                            <>
                                                <th></th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Item ID</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Title</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Author</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Type</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Academic Year</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Course</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Status</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase"></th>

                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={index} className="hover:bg-green-200">
                                            {selectedCategory === "books" ? (
                                                <>
                                                    <td className="px-8 py-2">{(page * limit) + index + 1}</td>
                                                    <td className="px-4 py-2">{item.Title_Name}</td>
                                                    <td className="px-4 py-2">{item.Author_Name}</td>
                                                    <td className="px-4 py-2">{item.Type}</td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex flex-row items-center gap-2">
                                                            {item.Available_Copies}/{item.Total_Copies}{" "}
                                                            {
                                                                item.Available_Copies === "0"
                                                                    ? "No Copy Available"
                                                                    : item.Available_Copies === "1"
                                                                        ? "Copy Available"
                                                                        : "Copies Available"
                                                            }
                                                            <button
                                                                className="ml-auto hover:cursor-pointer bg-red-200 p-2 rounded-xl h-10 w-10 flex items-center justify-center"
                                                                onClick={() => handleViewBookCopiesButtonClick(item)}
                                                            >
                                                                <img
                                                                    src={EyeIcon}
                                                                    alt="Eye Icon"
                                                                    className="w-6 h-6"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-8 py-2">{(page * limit) + index + 1}</td>
                                                    <td className="px-8 py-2">{item.ID}</td>
                                                    <td className="px-8 py-2">{item.Title_Name}</td>
                                                    <td className="px-4 py-2">{item.Author_Name}</td>
                                                    <td className="px-4 py-2">{item.Type}</td>
                                                    <td className="px-4 py-2">{formatDate(item.Academic_Year)}</td>
                                                    <td className="px-4 py-2">{item.Course}</td>
                                                    <td className="px-4 py-2">{item.Status}</td>
                                                    <td className="px-4 py-2 w-40">
                                                        <div className="buttons flex flex-row gap-2">
                                                            <button>
                                                                <img
                                                                    className="bg-red-200 px-2 py-2 rounded-xl h-10 w-10"
                                                                    src={ViewIcon}
                                                                />
                                                            </button>
                                                            <button>
                                                                <img
                                                                    className="bg-red-200 px-2 py-2 rounded-xl h-10 w-10"
                                                                    src={EditIcon}
                                                                    onClick={() => handleEditAcademicPaperButtonClick(item)}
                                                                />
                                                            </button>
                                                            <button>
                                                                <img
                                                                    className="bg-red-200 px-2 py-2 rounded-xl h-10 w-10"
                                                                    src={DeleteIcon}
                                                                />
                                                            </button>
                                                        </div>


                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center font-semibold text-3xl">SELECT A CATEGORY</p>
                    )}
                </main>
            </div>

            <AddNewResourceModal
                isOpen={isAddNewResourceModalOpen}
                onClose={() => setIsAddNewResourceModalOpen(false)}
                onSuccess={() => {
                    getResources();
                    fetchDistinctTypes();
                }}
            />
            <ViewBookCopiesModal
                isOpen={isViewBookCopiesModalOpen}
                onClose={() => setIsViewBookCopiesModalOpen(false)}
                bookDetails={bookDetails}
            />
            <EditAcademicPaperModal
                isOpen={isEditAcademicPaperModalOpen}
                onClose={() => setIsEditAcademicPaperModalOpen(false)}
                academicPaperDetails={academicPaperDetails}
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

export default Resources;