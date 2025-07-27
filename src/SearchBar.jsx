import React, { useState } from "react";

const SearchBar = ({ userInput }) => { //need the {} for props destructing
    const [search, setSearch] = useState(''); // usestate to creaet state variable

    return (
        <div>
            <input 
                type="text"
                value={search} //displays the current search
                onChange={(e) => setSearch(e.target.value)} //updates whenever the text changes
                placeholder="Search..."
            />
        </div>
    );
};

export default SearchBar;