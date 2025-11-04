import { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import SearchBar from "../components/SearchBar";
import formatDate from "../utits/formatDate";
import AddNewResourceModal from "../components/modals/AddNewResourceModal";

function Resources() {

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [bookTypes, setBookTypes] = useState([]);
    const [paperTypes, setPaperTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isAddNewResourceModalOpen, setIsAddNewResourceModalOpen] = useState(false);

    //FETCH DATA
    const fetchData = async () => {
        try {
            const res = await axios.get("/api/resources", {
                params: {
                    category: selectedCategory,
                    page,
                    types: selectedTypes,
                },
                paramsSerializer: (params) =>
                    qs.stringify(params, { arrayFormat: "repeat" }),
            });
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    //FETCH DISTINCT TYPES
    const fetchDistinctTypes = async () => {
        if (!selectedCategory) return;

        try {
            const res = await axios.get("/api/resources/types", {
                params: { category: selectedCategory },
            });

            if (selectedCategory === "books") {
                setBookTypes(res.data);
            } else if (selectedCategory === "academic-papers") {
                setPaperTypes(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    //HANDLE SEARCH
    const handleSearch = async (searchTerm) => {
        try {
            const res = await axios.get('/api/resources/search', {
                params: { category: selectedCategory, query: searchTerm, page },
            });
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!selectedCategory) return;
        fetchData();
    }, [selectedCategory, page, selectedTypes]);

    useEffect(() => {
        if (searchTerm) {
            handleSearch(searchTerm);
        } else {
            fetchData();
        }
    }, [searchTerm, selectedCategory, page]);

    useEffect(() => {
        setPage(1);
    }, [selectedCategory]);

    useEffect(() => {
        fetchDistinctTypes();
    }, [selectedCategory]);

    const handleCheckboxChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type) // remove if already selected
                : [...prev, type] // add if not selected
        );
    };

    return (
        <>
            <div className="flex flex-row gap-x-4 p-4">
                <aside className="side-bar bg-green-300 border-4 border-green-500 rounded-md flex flex-col w-64 p-4">
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
                                {bookTypes.map((type, index) => (
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
                                {paperTypes.map((type, index) => (
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

                <main className="flex-1 p-4 bg-blue-100 bg-green-300 h-214 rounded-md border-4 border-green-500">
                    <div className="flex items-center justify-between p-2">
                        <h2 className="text-xl font-semibold px-2 py-1">
                            {selectedCategory
                                ? selectedCategory === "books"
                                    ? "Books"
                                    : "Academic Papers"
                                : "Please select a category"}
                        </h2>

                        <div className="flex gap-x-4 justify-center items-center">
                            <button
                                className="bg-red-400 p-2"
                                onClick={() => setIsAddNewResourceModalOpen(true)}
                            >
                                Add New Record
                            </button>

                            <div className="h-8 w-80">
                                <SearchBar
                                    placeholder="Search ..."
                                    onSearch={setSearchTerm}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-4 mb-4">
                        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>{"<<"}</button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)}>{">>"}</button>
                    </div>

                    {items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-gray-400">
                                    <tr>
                                        {selectedCategory === "books" ? (
                                            <>
                                                <th></th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Title</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Author</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Type</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Status</th>
                                            </>
                                        ) : (
                                            <>
                                                <th></th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Title</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Author</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Type</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Academic Year</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Course</th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">Status</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={index} className="hover:bg-green-200">
                                            {selectedCategory === "books" ? (
                                                <>
                                                    <td className="px-8 py-2">{(page - 1) * 15 + index + 1}</td>
                                                    <td className="px-4 py-2">{item.Title_Name}</td>
                                                    <td className="px-4 py-2">{item.Author_Name}</td>
                                                    <td className="px-4 py-2">{item.Type}</td>
                                                    <td className="px-4 py-2">{item.Status}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-8 py-2">{(page - 1) * 15 + index + 1}</td>
                                                    <td className="px-8 py-2">{item.Title_Name}</td>
                                                    <td className="px-4 py-2">{item.Author_Name}</td>
                                                    <td className="px-4 py-2">{item.Type}</td>
                                                    <td className="px-4 py-2">{formatDate(item.Academic_Year)}</td>
                                                    <td className="px-4 py-2">{item.Course}</td>
                                                    <td className="px-4 py-2">{item.Status}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No items to display.</p>
                    )}
                </main>
            </div>

            {/* Modal with transition */}
            <AddNewResourceModal
                isOpen={isAddNewResourceModalOpen}
                onClose={() => setIsAddNewResourceModalOpen(false)}
            />

        </>
    )
}

export default Resources;