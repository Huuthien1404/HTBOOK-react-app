import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
const ProductTable = ({ products, recordsPerPage, setShowEditProductRecord, setEditProductIDProductRecord, setEditProductNameProductRecord, setEditAuthorProductRecord, setEditKeyFeaturesProductRecord , setEditSoldProductRecord, setEditPriceProductRecord, setEditImgUrlProductRecord, handleCLickDeleteProductRecord}) => {
    const itemsPerPage = recordsPerPage;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(() => {
        const endOffset = Number(itemOffset) + Number(itemsPerPage);
        setCurrentItems(products.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(products.length / itemsPerPage));
    }, [itemOffset, products, itemsPerPage]);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        setItemOffset(newOffset);
    };
    const handleClickEditProductRecord = (e) => {
        document.querySelector(".admin-users-title-name").style.pointerEvents = "none";
        document.querySelector(".admin-products-title-name").style.pointerEvents = "none";
        document.querySelector(".admin-orders-title-name").style.pointerEvents = "none";
        setEditProductIDProductRecord(Number(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-productId").innerHTML));
        setEditProductNameProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-productName").innerHTML);
        setEditAuthorProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-author").innerHTML);
        setEditKeyFeaturesProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-keyFeatures").innerHTML);
        setEditSoldProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-sold").innerHTML);
        setEditPriceProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-price").innerHTML);
        setEditImgUrlProductRecord(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-imgUrl").innerHTML);
        // document.querySelector(".edit-product-record-productId-content").value = Number(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-productId").innerHTML);
        setShowEditProductRecord(true);
    }
    return (
        <>
            <div className="record-items-products-title">
                <div className="record-items-products-title-productId">ProductID</div>
                <div className="record-items-products-title-productName">ProductName</div>
                <div className="record-items-products-title-author">Author</div>
                <div className="record-items-products-title-keyFeatures">KeyFeatures</div>
                <div className="record-items-products-title-sold">Sold</div>
                <div className="record-items-products-title-price">Price</div>
                <div className="record-items-products-title-imgUrl">ImgUrl</div>
                <div className="record-items-products-title-action">Action</div>
            </div>
            {currentItems.map((product, index) => {
                return (
                    <div key={index} className="record-item-product">
                        <div className="record-item-product-productId">{product.ProductID}</div>
                        <div className="record-item-product-productName">{product.ProductName}</div>
                        <div className="record-item-product-author">{product.Author}</div>
                        <div className="record-item-product-keyFeatures">{product.KeyFeatures}</div>
                        <div className="record-item-product-sold">{product.Sold}</div>
                        <div className="record-item-product-price">{product.Price.replace(".00", "")}</div>
                        <div className="record-item-product-imgUrl">{product.ImgUrl}</div>
                        <div className="record-item-product-action">
                            <div className="record-item-product-action-edit" onClick={handleClickEditProductRecord}>
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </div>
                            <div className="record-item-product-action-delete" onClick={handleCLickDeleteProductRecord}>
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
                containerClassName="pagination-product-table"
                pageLinkClassName="page-num-product-table"
                previousLinkClassName="page-num-product-table"
                nextLinkClassName="page-num-product-table"
                activeLinkClassName="active-product-table"
            />
        </>
    );
}

export default ProductTable;