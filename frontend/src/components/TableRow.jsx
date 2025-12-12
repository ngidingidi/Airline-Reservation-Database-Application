// Component to show the table rows

const TableRow = ({ rowObject, onDelete, onEdit }) => {

    // Display the table rows based on the passed down object
    return (
        <tr>
            {Object.values(rowObject).map((value, index) => (
                <td key={index}>{value}</td>
            ))}

            {/* Render the onDelete and/or onEdit component if it was passed down */}
            {onDelete}
            {onEdit}
        </tr>
    );
};

export default TableRow;