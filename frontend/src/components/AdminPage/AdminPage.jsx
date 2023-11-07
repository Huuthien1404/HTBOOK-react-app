import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminpage.css";
import UserTable from "../UserTable/UserTable";
import "./loading.css";
import { useState } from "react";
import ProductTable from "../ProductTable/ProductTable";
import OrderTable from "../OrderTable/OrderTable";

const AdminPage = () => {
    const navigate = useNavigate();
    const [tableShow, setTableShow] = useState("Users");
    const [tableName, setTableName] = useState("Users");
    const [tableDescription, setTableDescription] = useState("All users in the database");
    const [showConfigTable, setShowConfigTable] = useState(true);
    const [addNameRecord, setAddNameRecord] = useState("Add user");
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountName, setAccountName] = useState();
    const [recordsPerPage, setRecordsPerPage] = useState(1);
    const [mountedProducts, setMountedProducts] = useState(true);
    const [mountedUsers, setMountedUsers] = useState(true);
    const [showAddItemForm, setShowAddItemForm] = useState("");
    const [showEditProductRecord, setShowEditProductRecord] = useState(false);
    const [editProductIDProductRecord, setEditProductIDProductRecord] = useState();
    const [editProductNameProductRecord, setEditProductNameProductRecord] = useState();
    const [editAuthorProductRecord, setEditAuthorProductRecord] = useState();
    const [editKeyFeaturesProductRecord, setEditKeyFeaturesProductRecord] = useState();
    const [editSoldProductRecord, setEditSoldProductRecord] = useState();
    const [editPriceProductRecord, setEditPriceProductRecord] = useState();
    const [editImgUrlProductRecord, setEditImgUrlProductRecord] = useState();
    useEffect(() => {
        setMountedProducts(true);
        setMountedUsers(true);
    }, [recordsPerPage])
    useEffect(() => {
        async function showAllData() {
            setLoading(true);
            const res = await axios({
                url: "http://localhost:8080/api/show/v1/show-all-users-products-orders",
                withCredentials: true,
                method: "GET"
            });
            return res;
        }
        showAllData().then(res => {
            setUsers(res.data.users);
            setProducts(res.data.products);
            setOrders(res.data.orders);
        })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
            })
    }, [])
    useEffect(() => {
        async function checkLoggedInAdminPage() {
            const res = await axios({
                url: "http://localhost:8080/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInAdminPage().then(res => {
            if (res.data.message_logged_in === "Phiên đăng nhập của bạn đã hết hạn. Bạn sẽ được điều hướng về trang đăng nhập ngay bây giờ" || res.data.message_logged_in === "Đã đăng nhập với vai trò user") {
                navigate("/sign-in");
            }
            else if (res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                setAccountName(res.data.message_username);
            }
        })
            .catch(err => console.log(err))

    }, [navigate]);
    const handleClickUsersTable = (e) => {
        if (tableShow === "Users") {
            e.target.style.color = "#77848a";
            e.target.style.textDecoration = "none";
            setTableShow(null);
            setTableName("");
            setTableDescription("");
            setShowConfigTable(false);
        }
        else {
            e.target.style.color = "white";
            e.target.style.textDecoration = "underline";
            document.querySelector(".admin-products-title-name").style.color = "#77848a";
            document.querySelector(".admin-products-title-name").style.textDecoration = "none";
            document.querySelector(".admin-orders-title-name").style.color = "#77848a";
            document.querySelector(".admin-orders-title-name").style.textDecoration = "none";
            setTableShow("Users");
            setTableName("Users");
            setTableDescription("All users in the database");
            setShowConfigTable(true);
            setAddNameRecord("Add users");
        }
    }
    const handleSubmitAddProductRecord = () => {
        async function addProductRecord() {
            const res = await axios({
                url: "http://localhost:8080/api/product/v1/add-product-record",
                withCredentials: true,
                data: {
                    productId: document.querySelector(".add-product-record-content-productId").value,
                    productName: document.querySelector(".add-product-record-content-productName").value.toString().replace("\n",""),
                    author: document.querySelector(".add-product-record-content-author").value,
                    keyFeatures: document.querySelector(".add-product-record-content-keyFeatures").value.toString().replace("\n",""),
                    sold: document.querySelector(".add-product-record-content-sold").value,
                    price: document.querySelector(".add-product-record-content-price").value.toString().replace(".",""),
                    imgUrl: document.querySelector(".add-product-record-content-imgUrl").value
                },
                method: "POST"
            })
            return res;
        }
        if (Number(document.querySelector(".add-product-record-content-productId").value) && Number(document.querySelector(".add-product-record-content-sold").value) && Number(document.querySelector(".add-product-record-content-price").value)) {
            addProductRecord().then(res => {
                if (res.data.message === "Đã thêm 1 sản phẩm thành công!!!") {
                    setProducts(res.data.data);
                }
                window.location = "/admin";
                document.querySelector(".admin-users-title-name").style.pointerEvents = "";
                document.querySelector(".admin-products-title-name").style.pointerEvents = "";
                document.querySelector(".admin-orders-title-name").style.pointerEvents = "";
            })
                .catch(err => console.log(err));
        }

    }
    const handleClickProductsTable = (e) => {
        if (tableShow === "Products") {
            e.target.style.color = "#77848a";
            e.target.style.textDecoration = "none";
            setTableShow(null);
            setTableName("");
            setTableDescription("");
            setShowConfigTable(false);
        }
        else {
            e.target.style.color = "white";
            e.target.style.textDecoration = "underline";
            document.querySelector(".admin-users-title-name").style.color = "#77848a";
            document.querySelector(".admin-users-title-name").style.textDecoration = "none";
            document.querySelector(".admin-orders-title-name").style.color = "#77848a";
            document.querySelector(".admin-orders-title-name").style.textDecoration = "none";
            setTableShow("Products");
            setTableName("Products");
            setTableDescription("All products in the database");
            setShowConfigTable(true);
            setAddNameRecord("Add products");
        }
    }
    const handleClickAddRecord = () => {
        if (document.querySelector(".add-record-name").innerHTML === "Add products") {
            setShowAddItemForm("product");
            document.querySelector(".admin-users-title-name").style.pointerEvents = "none";
            document.querySelector(".admin-products-title-name").style.pointerEvents = "none";
            document.querySelector(".admin-orders-title-name").style.pointerEvents = "none";
        }
    }
    const handleClickExitAddProductRecord = () => {
        setShowAddItemForm("");
        document.querySelector(".admin-users-title-name").style.pointerEvents = "";
        document.querySelector(".admin-products-title-name").style.pointerEvents = "";
        document.querySelector(".admin-orders-title-name").style.pointerEvents = "";
    }
    const handleClickOrdersTable = (e) => {
        if (tableShow === "Orders") {
            e.target.style.color = "#77848a";
            e.target.style.textDecoration = "none";
            setTableShow(null);
            setTableName("");
            setTableDescription("");
            setShowConfigTable(false);
        }
        else {
            e.target.style.color = "white";
            e.target.style.textDecoration = "underline";
            document.querySelector(".admin-users-title-name").style.color = "#77848a";
            document.querySelector(".admin-users-title-name").style.textDecoration = "none";
            document.querySelector(".admin-products-title-name").style.color = "#77848a";
            document.querySelector(".admin-products-title-name").style.textDecoration = "none";
            setTableShow("Orders");
            setTableName("Orders");
            setTableDescription("All orders in the database");
            setShowConfigTable(true);
            setAddNameRecord("Add orders");
        }
    }
    const handleClickExitEditProductRecord = () => {
        document.querySelector(".admin-users-title-name").style.pointerEvents = "";
        document.querySelector(".admin-products-title-name").style.pointerEvents = "";
        document.querySelector(".admin-orders-title-name").style.pointerEvents = "";
        setShowEditProductRecord(false);
    }
    const handleClickSaveEditProductRecord = () => {
        async function updateInfoProductRecord() {
            const res = await axios({
                url: "http://localhost:8080/api/product/v1/update-info-product-record",
                method: "POST",
                withCredentials: true,
                data: {
                    productId: editProductIDProductRecord,
                    productName: editProductNameProductRecord,
                    author: editAuthorProductRecord,
                    keyFeatures: editKeyFeaturesProductRecord,
                    sold: editSoldProductRecord,
                    price: editPriceProductRecord,
                    imgUrl: editImgUrlProductRecord
                }
            })
            return res;
        }
        updateInfoProductRecord().then(res => {
            setProducts(res.data.data);
            document.querySelector(".admin-users-title-name").style.pointerEvents = "";
            document.querySelector(".admin-products-title-name").style.pointerEvents = "";
            document.querySelector(".admin-orders-title-name").style.pointerEvents = "";

        })
            .catch(err => console.log(err))
            .finally(() => {

            })

    }
    const handleCLickDeleteProductRecord = (e) => {
        if (window.confirm("Bạn đồng ý xoá sản phẩm này?")) {
            async function deleteProductRecord() {
                const res = await axios({
                    url: "http://localhost:8080/api/product/v1/delete-product-record",
                    data: {
                        productId: Number(e.currentTarget.parentNode.parentNode.querySelector(".record-item-product-productId").innerHTML)
                    },
                    withCredentials: true,
                    method: "POST"
                })
                return res;
            }
            deleteProductRecord().then(res => {
                setProducts(res.data.data);
                window.location = "/admin";
            })
                .catch(err => console.log(err));
        }
    }
    const handleClickLogOutAdmin = () => {
        async function adminLogOut() {
            const res = await axios({
                url: "http://localhost:8080/api/auth/v1/log-out",
                method: "GET",
                withCredentials: true
            })
            return res;
        }
        adminLogOut().then(res => {
            navigate("/sign-in");
        })
    }
    if (loading) {
        return (
            <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        )
    }
    else return (
        <div className="admin-page-container">
            <div className="admin-container">
                <div className="admin-sidebar">
                    <div className="admin-logo">
                        <img src="http://localhost:8080/logo1.png" alt="" />
                    </div>
                    <div className="admin-account">
                        <div className="admin-account-avt">
                            <i className="fa-solid fa-circle-user"></i>
                        </div>
                        <div className="admin-account-username">
                            <div className="admin-account-name">{accountName}</div>
                            <div className="admin-account-status">
                                <div className="admin-account-status-icon"></div>
                                <div className="admin-account-status-online">Online</div>
                            </div>
                        </div>
                    </div>
                    <div className="admin-administration">QUẢN TRỊ VIÊN</div>
                    <div className="admin-users-title">
                        <div className="admin-users-title-icon">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="admin-users-title-name" onClick={handleClickUsersTable}>Users</div>
                    </div>
                    <div className="admin-products-title">
                        <div className="admin-products-title-icon">
                            <i className="fa-solid fa-book"></i>
                        </div>
                        <div className="admin-products-title-name" onClick={handleClickProductsTable}>Products</div>
                    </div>
                    <div className="admin-orders-title">
                        <div className="admin-orders-title-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <div className="admin-orders-title-name" onClick={handleClickOrdersTable}>Orders</div>
                    </div>
                    <div className="admin-user">NGƯỜI DÙNG</div>
                    <div className="admin-logout-title" onClick={handleClickLogOutAdmin}>
                        <div className="admin-logout-title-icon">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <div className="admin-logout-title-name">Đăng xuất</div>
                    </div>
                </div>
                <div className="admin-content">
                    <div className="admin-content-header">
                        <div className="admin-content-menu">
                            <i className="fa-solid fa-bars"></i>
                        </div>
                        <div className="admin-content-logout" onClick={handleClickLogOutAdmin}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span> Logout</span>
                        </div>
                    </div>
                    <div className="admin-content-main">
                        <div className="admin-content-main-title">
                            <span className="admin-content-main-title-big">{tableName}</span>
                            <span className="admin-content-main-title-small">{tableDescription}</span>
                        </div>
                        <div className="admin-content-main-items-container">
                            {showAddItemForm === "" ? (
                                <>{showConfigTable && <><div className="add-record" onClick={handleClickAddRecord}>
                                    <div className="add-record-icon">
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                    <div className="add-record-name">
                                        {addNameRecord}
                                    </div>
                                </div>
                                    <div className="record-per-page-search">
                                        <div className="record-per-page">
                                            <input type="number" className="record-number-per-page" value={recordsPerPage} onChange={e => {
                                                if (e.target.value < 1) {
                                                    setRecordsPerPage(1);
                                                }
                                                else {
                                                    setRecordsPerPage(e.target.value);
                                                    setMountedProducts(false);
                                                    setMountedUsers(false);
                                                };
                                            }} />
                                            <span className="record-per-page-name">records per page</span>
                                        </div>
                                        <div className="search-record">
                                            <label htmlFor="search-record-content">Search: </label>
                                            <input type="text" id="search-record-content" className="search-record-content" />
                                        </div>
                                    </div></>}
                                    <div className="record-items">
                                        {tableShow === "Users" ?
                                            (
                                                mountedUsers && <UserTable users={users} recordsPerPage={recordsPerPage} />
                                            ) : (
                                                tableShow === "Products" ? (
                                                    mountedProducts && <ProductTable handleCLickDeleteProductRecord={handleCLickDeleteProductRecord} setEditImgUrlProductRecord={setEditImgUrlProductRecord} setEditPriceProductRecord={setEditPriceProductRecord} setEditSoldProductRecord={setEditSoldProductRecord} setEditKeyFeaturesProductRecord={setEditKeyFeaturesProductRecord} setEditAuthorProductRecord={setEditAuthorProductRecord} setEditProductNameProductRecord={setEditProductNameProductRecord} setEditProductIDProductRecord={setEditProductIDProductRecord} setShowEditProductRecord={setShowEditProductRecord} products={products} recordsPerPage={recordsPerPage} />
                                                ) : (
                                                    tableShow === "Orders" ? (
                                                        <OrderTable orders={orders} />
                                                    ) : (
                                                        <></>
                                                    )
                                                )
                                            )}
                                    </div></>
                            ) : (
                                showAddItemForm === "product" ? (
                                    <>
                                        <form className="add-product-record-form">
                                            <div className="add-product-record-label-container">
                                                <label htmlFor="" className="add-product-record-label-productId">ProductID</label>
                                                <label htmlFor="" className="add-product-record-label-productName">ProductName</label>
                                                <label htmlFor="" className="add-product-record-label-author">Author</label>
                                                <label htmlFor="" className="add-product-record-label-keyFeatures">KeyFeatures</label>
                                                <label htmlFor="" className="add-product-record-label-sold">Sold</label>
                                                <label htmlFor="" className="add-product-record-label-price">Price</label>
                                                <label htmlFor="" className="add-product-record-label-imgUrl">ImgUrl</label>
                                            </div>
                                            <div className="add-product-record-content-container">
                                                <input type="number" className="add-product-record-content-productId" value={Number(products[products.length - 1].ProductID) + 1} readOnly autoComplete="off" required />
                                                <textarea className="add-product-record-content-productName" spellCheck="false" autoComplete="off"  />
                                                <textarea className="add-product-record-content-author" spellCheck="false" autoComplete="off"  />
                                                <textarea className="add-product-record-content-keyFeatures" spellCheck="false" autoComplete="off"></textarea>
                                                <input type="number" className="add-product-record-content-sold" autoComplete="off" required />
                                                <input type="number" className="add-product-record-content-price" autoComplete="off" required />
                                                <textarea className="add-product-record-content-imgUrl" spellCheck="false" autoComplete="off"  />
                                            </div>
                                            <button className="submit-add-product-record" onClick={handleSubmitAddProductRecord}>Add Record</button>
                                        </form>
                                        <button className="exit-add-product-record" onClick={handleClickExitAddProductRecord}>Exit</button></>
                                ) : (
                                    <></>
                                )
                            )}
                            {showEditProductRecord && <div className="show-edit-product-record">
                                <form className="edit-product-record-form">
                                    <label htmlFor="edit-product-record-productId-content" className="edit-product-record-productId-title">ProductID</label>
                                    <input type="number" id="edit-product-record-productId-content" className="edit-product-record-productId-content" readOnly value={editProductIDProductRecord} required autoComplete="off" spellCheck="false" onChange={e => setEditProductIDProductRecord(e.target.value)} />
                                    <label htmlFor="edit-product-record-productName-content" className="edit-product-record-productName-title">ProductName</label>
                                    <input type="text" id="edit-product-record-productName-content" className="edit-product-record-productName-content" value={editProductNameProductRecord} required autoComplete="off" spellCheck="false" onChange={e => setEditProductNameProductRecord(e.target.value)} />
                                    <label htmlFor="edit-product-record-author-content" className="edit-product-record-author-title">Author</label>
                                    <input type="text" id="edit-product-record-author-content" className="edit-product-record-author-content" value={editAuthorProductRecord} required autoComplete="off" spellCheck="false" onChange={e => setEditAuthorProductRecord(e.target.value)} />
                                    <label htmlFor="edit-product-record-keyFeatures-content" className="edit-product-record-keyFeatures-title">KeyFeatures</label>
                                    <input type="text" id="edit-product-record-keyFeatures-content" className="edit-product-record-keyFeatures-content" required autoComplete="off" spellCheck="false" value={editKeyFeaturesProductRecord} onChange={e => setEditKeyFeaturesProductRecord(e.target.value)} />
                                    <label htmlFor="edit-product-record-sold-content" className="edit-product-record-sold-title">Sold</label>
                                    <input type="number" id="edit-product-record-sold-content" className="edit-product-record-sold-content" value={editSoldProductRecord} onChange={e => setEditSoldProductRecord(e.target.value)} required autoComplete="off" spellCheck="false" />
                                    <label htmlFor="edit-product-record-price-content" className="edit-product-record-price-title">Price</label>
                                    <input type="number" id="edit-product-record-price-content" className="edit-product-record-price-content" value={editPriceProductRecord} onChange={e => setEditPriceProductRecord(e.target.value)} required autoComplete="off" spellCheck="false" />
                                    <label htmlFor="edit-product-record-imgUrl-content" className="edit-product-record-imgUrl-title">ImgUrl</label>
                                    <input type="text" id="edit-product-record-imgUrl-content" className="edit-product-record-imgUrl-content" value={editImgUrlProductRecord} onChange={e => setEditImgUrlProductRecord(e.target.value)} required autoComplete="off" spellCheck="false" />
                                    <button className="edit-product-record-submit" onClick={handleClickSaveEditProductRecord}>Save</button>
                                </form>
                                <button className="exit-edit-product-record" onClick={handleClickExitEditProductRecord}>Exit</button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;