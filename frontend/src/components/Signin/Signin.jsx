import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./signin.css";
import axios from "axios";
import { useEffect } from "react";
const Signin = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("username");
        localStorage.removeItem("item_details");
        async function checkLoggedInSignInPage() {
            const res = await axios({
                url: "/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInSignInPage().then(res => {
            if (res.data.message_logged_in === "Đã đăng nhập với vai trò user") {
                console.log("hihi");
                //navigate("/homepage");
            }
            else if (res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                navigate("/admin");
            }
        })
            .catch(err => console.log(err))

    }, [navigate]);
    const formik = useFormik({
        initialValues: {
            sign_in_username: "",
            sign_in_password: "",
            role: "",
        },
        validationSchema: Yup.object({
            sign_in_username: Yup.string().required("Bắt buộc"),
            sign_in_password: Yup.string().required("Bắt buộc")
        }),
        onSubmit: (values) => {
            async function checkLogin() {
                const res = await axios({
                    url: "/api/auth/v1/sign-in",
                    withCredentials: true,
                    method: "POST",
                    data: {
                        ...values
                    }
                });
                return res;
            }
            checkLogin().then(res => {
                if (res.data.message_login === "Đăng nhập thành công với vai trò: user") {
                    navigate("/homepage");
                }
                else if (res.data.message_login === "Đăng nhập thành công với vai trò: admin") {
                    navigate("/admin");
                }
                else alert(res.data.message_login);
            }).catch(err => {
                console.log(err);
            })
        },
    });

    const handleClickSignUp = () => {
        navigate("/sign-up");
    }
    const handleChangeSignInRole = (e) => {
        formik.values.role = e.target.value;
    }
    return (
        <div className="sign-in-page-container">
            <div className="sign-in-container">
                <header className="sign-in-header">Đăng nhập</header>
                <form className="sign-in-form" onSubmit={formik.handleSubmit}>
                    <div className="sign-in-username-container"><label htmlFor="">Tên đăng nhập</label>
                        <input type="text" className="sign_in_username" id="sign_in_username" spellCheck="false" autoComplete="off" placeholder="Nhập tên đăng nhập" onChange={formik.handleChange} value={formik.values.sign_in_username} />
                        {formik.errors.sign_in_username && (
                            <p className="signIn-username-err-msg">{formik.errors.sign_in_username}</p>
                        )}
                    </div>
                    <div className="sign-in-password-container">
                        <label htmlFor="">Password</label>
                        <input type="password" className="sign_in_password" id="sign_in_password" spellCheck="false" autoComplete="off" placeholder="Nhập mật khẩu" onChange={formik.handleChange} value={formik.values.sign_in_password} />
                        {formik.errors.sign_in_password && (
                            <p className="signIn-password-err-msg">{formik.errors.sign_in_password}</p>
                        )}
                    </div>
                    <div className="sign-in-role-container">
                        <p className="sign-in-role">Đăng nhập với vai trò là:</p>
                        <input type="radio" className="sign-in-user" id="sign-in-user" name="sign_in_role" value="user" onChange={handleChangeSignInRole} required />
                        <label htmlFor="sign-in-user">User</label>
                        <input type="radio" className="sign-in-admin" id="sign-in-admin" name="sign_in_role" value="admin" onChange={handleChangeSignInRole} required />
                        <label htmlFor="sign-in-admin">Admin</label>
                    </div>
                    <button type="submit" className="sign_in_submit">Đăng nhập</button>
                </form>
                <p className="create-account" onClick={handleClickSignUp}>Tạo tài khoản mới</p>
            </div>
        </div>
    );
}

export default Signin;