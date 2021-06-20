import React from "react";
import { gql, useQuery } from "@apollo/client";

const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
        }
    }
`;

function App() {
    const result = useQuery(ALL_AUTHORS);
    if (result.loading) {
        return <div>loading</div>;
    }
    return (
        <div className='App'>
            {result.data.allAuthors.map((p) => p.name).join(", ")}
        </div>
    );
}

export default App;
