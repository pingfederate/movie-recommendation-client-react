import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {

    const apiUrl = "http://localhost:8000";
    const suggestionsRef = useRef(null);

    const [inputText, setInputText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState("");

    useEffect( () => { 
        axios.get(`${apiUrl}/movies`)
            .then((response) => {
                setMovies(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
        
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    useEffect(() => {
        setSelectedSuggestionIndex(-1);
    }, [inputText]);

    const handleClickOutside = (event) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            setSuggestions([]);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (selectedSuggestionIndex > 0) {
                setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (selectedSuggestionIndex < suggestions.length - 1) {
                setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
            }
        } else if (e.key === "Enter" && selectedSuggestionIndex !== -1) {
            setInputText(suggestions[selectedSuggestionIndex]);
            setSuggestions([]);
        }
    };

    const handleChange = (e) => {
        const searchText = e.target.value;
        
        setInputText(searchText);

        const filteredMovies = movies.filter(
            (movie) => {
                return movie.toLowerCase().trim().includes(searchText.toLowerCase().trim());
            }
        ).slice(0, 7);

        setSuggestions(filteredMovies);
    };

    const handleItemClick = (movie) => {
        setInputText(movie);
        setSuggestions([]);
    };

    const handleClick = () => {
        console.log("Search for: ", inputText);

        axios.get(`${apiUrl}/recommendations/${inputText}`)
            .then((response) => {
                setRecommendation(response.data.movie_recommendation);
                setError("");
            })
            .catch((error) => {
                setError("Please, input a valid movie name.");
                setRecommendation("");
            });
    };

    return (
        <div className="flex items-center flex-col">
            <div className="flex items-center">
                <input 
                    type="text" 
                    className="w-96 h-12 rounded-l-3xl pl-6 outline-none bg-slate-200" 
                    placeholder="Search for a movie"
                    value={inputText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

                <div className="w-14 h-12 rounded-r-3xl bg-blue-600 cursor-pointer flex justify-center items-center" onClick={() => handleClick()}>
                    <FaSearch className="text-3xl text-slate-200" />
                </div>
            </div>

            <div ref={suggestionsRef} className="w-96 mt-2 rounded-md bg-white shadow-md">
                {
                    suggestions.map(
                        (movie, index) => (
                            <div 
                                key={index} 
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                    selectedSuggestionIndex === index ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => handleItemClick(movie)}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                            {movie}
                        </div>
                        )
                    )
                }
            </div>

            {error && <p className="text-red-500 font-bold">{error}</p>}
            {recommendation && <p className="mt-2">Recommended Movie: {recommendation}</p>}
        </div>
    )
}

export default SearchBar;