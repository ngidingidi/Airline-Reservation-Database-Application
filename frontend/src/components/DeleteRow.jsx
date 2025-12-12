// Button to delete a row for a specific page
// entityType = the entity table to define the url
// rowItem = the specific row object to delete
// idName = id property name
// onDelete = Delete method passed down from App.jsx

const DeleteRow = ({rowItem, idName, entityType, onDelete}) => {

    return (
        <td>
            <form>
                <button type='submit' 
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(entityType, rowItem[idName]);
                        }}>
                    Delete
                </button>
            </form>
        </td>

    );
};

export default DeleteRow;