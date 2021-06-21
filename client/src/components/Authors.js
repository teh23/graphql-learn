import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            id
            born
            bookCount
        }
    }
`;

const EDIT_AUTHOR = gql`
    mutation edit($name: String!, $born: Int!) {
        editAuthor(name: $name, setBornTo: $born) {
            name
            born
        }
    }
`;

const Authors = (props) => {
    const authors = useQuery(ALL_AUTHORS, { pollInterval: 3000 });
    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });
    const [name, setName] = useState("");
    const [born, setBorn] = useState();

    const changeAuthor = (e) => {
        e.preventDefault();
        editAuthor({ variables: { name, born: parseInt(born) } });
    };

    if (!props.show) {
        return null;
    }

    if (authors.loading) {
        return <div>loading</div>;
    }

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.data.allAuthors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Set birthyear</h2>
            name
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            born
            <input
                value={born}
                input='number'
                onChange={(e) => setBorn(e.target.value)}
            />
            <br />
            <button onClick={(e) => changeAuthor(e)}>change</button>
        </div>
    );
};

export default Authors;
