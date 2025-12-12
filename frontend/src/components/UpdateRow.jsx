// Button to update a row

const UpdateRow = ({onEdit}) => {

    return (
        <td>
            <button onClick={(e) => {
                e.preventDefault();
                onEdit();
            }}>
                Update
            </button>
        </td>

    );
};

export default UpdateRow;