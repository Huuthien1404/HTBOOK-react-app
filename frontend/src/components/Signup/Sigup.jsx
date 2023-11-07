import { useFormik } from "formik";
import * as Yup from "yup";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Signup = () => {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkLoggedInSignUpPage() {
            const res = await axios({
                url: "http://localhost:8080/api/auth/v1/logged-in",
                method: "GET",
                withCredentials: true
            });
            return res;
        }
        checkLoggedInSignUpPage().then(res => {
            if (res.data.message_logged_in === "Đã đăng nhập với vai trò user") {
                navigate("/homepage");
            }
            else if (res.data.message_logged_in === "Đã đăng nhập với vai trò admin") {
                navigate("/admin");
            }
        })
            .catch(err => console.log(err))

    }, [navigate]);
    const formik = useFormik({
        initialValues: {
            sign_up_name: "",
            sign_up_email: "",
            sign_up_password: "",
            sign_up_confirm: "",
            role: "",
        },
        validationSchema: Yup.object({
            sign_up_name: Yup.string().required("Bắt buộc").min(4, "Có ít nhất 4 ký tự"),
            sign_up_email: Yup.string().required("Bắt buộc").matches(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/, "Vui lòng nhập email hợp lệ"),
            sign_up_password: Yup.string().required("Bắt buộc").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/, "Mật khẩu phải có độ dài từ 7-19 ký tự, có ít nhất một ký tự thường, một ký tự số và một ký tự đặc biệt"),
            sign_up_confirm: Yup.string().required("Bắt buộc").oneOf([Yup.ref("sign_up_password"), null], "Mật khẩu không khớp"),
        }),
        onSubmit: (values) => {
            async function checkRegister() {
                const res = await axios({
                    url: "http://localhost:8080/api/auth/v1/sign-up",
                    withCredentials: true,
                    method: "POST",
                    data: {
                        ...values
                    }
                });
                return res;
            }
            checkRegister().then(res => {
                alert(res.data.message);
            })
                .catch(err => {
                    console.log(err);
                })
        },
    });
    const handleClickLogIn = () => {
        navigate("/sign-in");
    }
    const handleChangeRole = (e) => {
        formik.values.role = e.target.value;
    }

    return (
        <div className="sign-up-page-container">
            <div className="sign-up-container">
                <header className="sign-up-header">Đăng ký</header>
                <form className="sign-up-form" onSubmit={formik.handleSubmit}>
                    <label htmlFor="sign_up_name">Tên tài khoản</label>
                    <div className="sign-up-name-container">
                        <input type="text" className="sign_up_name" id="sign_up_name" spellCheck="false" autoComplete="off" placeholder="Nhập tên tài khoản" onChange={formik.handleChange} value={formik.values.sign_up_name} />
                        {formik.errors.sign_up_name && (
                            <p className="name-err-msg">{formik.errors.sign_up_name}</p>
                        )}
                    </div>
                    <label htmlFor="sign_up_email">Email</label>
                    <div className="sign-up-email-container">
                        <input type="email" className="sign_up_email" id="sign_up_email" spellCheck="false" autoComplete="off" placeholder="Nhập email" onChange={formik.handleChange} value={formik.values.sign_up_email} />
                        {formik.errors.sign_up_email && (
                            <p className="email-err-msg">{formik.errors.sign_up_email}</p>
                        )}
                    </div>
                    <label htmlFor="sign_up_password">Mật khẩu</label>
                    <div className="sign-up-password-container">
                        <input type="password" className="sign_up_password" id="sign_up_password" spellCheck="false" autoComplete="off" placeholder="Nhập mật khẩu" onChange={formik.handleChange} value={formik.values.sign_up_password} />
                        {formik.errors.sign_up_password && (
                            <p className="password-err-msg">{formik.errors.sign_up_password}</p>
                        )}
                    </div>

                    <label htmlFor="sign_up_confirm">Xác nhận lại mật khẩu</label>
                    <div className="sign-up-confirm-container">
                        <input type="password" className="sign_up_confirm" id="sign_up_confirm" spellCheck="false" autoComplete="off" placeholder="Xác nhận lại mật khẩu" onChange={formik.handleChange} value={formik.values.sign_up_confirm} />
                        {formik.errors.sign_up_confirm && (
                            <p className="confirm-err-msg">{formik.errors.sign_up_confirm}</p>
                        )}
                    </div>
                    <div className="sign-up-role-container">
                        <p className="sign-up-role-title">Đăng ký với tư cách:</p>
                        <input type="radio" className="user" id="user" name="role" value="user" onChange={handleChangeRole} required />
                        <label htmlFor="user">User</label>
                        <input type="radio" className="admin" id="admin" name="role" value="admin" onChange={handleChangeRole} required />
                        <label htmlFor="admin">Admin</label>
                    </div>
                    <button type="submit" className="sign_up_submit">Đăng ký</button>
                    <p className="forward_to_login" onClick={handleClickLogIn}>Tôi đã có tài khoản</p>
                </form>
            </div>
        </div>
    );
}

export default Signup;