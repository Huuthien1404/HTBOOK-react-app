import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
const UserTable = ({ users, recordsPerPage }) => {
    const itemsPerPage = recordsPerPage;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(() => {
        const endOffset = Number(itemOffset) + Number(itemsPerPage);
        setCurrentItems(users.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(users.length / itemsPerPage));
    }, [itemOffset, users, itemsPerPage]);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % users.length;
        setItemOffset(newOffset);
    };
    return (
        <>
            <div className="record-items-users-title">
                <div className="record-items-users-title-username">Username</div>
                <div className="record-items-users-title-email">Email</div>
                <div className="record-items-users-title-role">Role</div>
                <div className="record-items-users-title-action">Action</div>
            </div>
            {currentItems.map((user, index) => {
                return (
                    <div key={index} className="record-item-user">
                        <div className="record-item-user-username">{user.Username}</div>
                        <div className="record-item-user-email">{user.Email}</div>
                        <div className="record-item-user-role">{user.Role}</div>
                        <div className="record-item-user-action">
                            <div className="record-item-user-action-edit">
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </div>
                            <div className="record-item-user-action-delete">
                                <i className="fa-solid fa-trash-can"></i>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                )
            })}
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName="pagination-user-table"
                pageLinkClassName="page-num-user-table"
                previousLinkClassName="page-num-user-table"
                nextLinkClassName="page-num-user-table"
                activeLinkClassName="active-user-table"
            />
        </>
    );
}

export default UserTable;