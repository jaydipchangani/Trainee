import React, { ChangeEvent, useState, FormEvent } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataCard from "./DataCard";

const userObj = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    country: '',
    hobbies: [],
    skills: [],
    bio: '',
    profilePicture: null,
    password: '',
    age: 0
}
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    country: string;
    hobbies: string[];
    skills: string[];
    bio: string;
    profilePicture: File | null;
    password: string;
    age: number;
}

const ProfileForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(userObj);
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        const checked = (target as HTMLInputElement).checked;
        const files = (target as HTMLInputElement).files;

        setFormData((prevData: FormData) => {
            if (type === 'checkbox') {
                const updatedSkills = checked
                    ? [...prevData.skills, value as string]
                    : prevData.skills.filter((skill) => skill !== value);
                return { ...prevData, skills: updatedSkills };
            } else if (type === 'radio') {
                return { ...prevData, gender: value as string };
            } else if (type === 'select-multiple') {
                const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) => option.value);
                return { ...prevData, hobbies: selectedOptions };
            } else if (type === 'file') {
                return { ...prevData, profilePicture: files ? files[0] : null };
            } else if (name === 'dob') {
                const age = calculateAge(value);
                return { ...prevData, dob: value, age };
            } else {
                return { ...prevData, [name]: value };
            }
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid email address.");
                return;
            }

            const phoneRegex = /^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/;
            if (!phoneRegex.test(formData.phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            if (formData.age < 0) {
                alert("Age cannot be negative.");
                return;
            }

            setSubmittedData(formData);

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dob: '',
                gender: '',
                country: '',
                hobbies: [],
                skills: [],
                bio: '',
                profilePicture: null,
                password: '',
                age: 0
            });

            alert("Form Submitted Successfully")
        }
        setValidated(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <form onSubmit={handleSubmit}
                className={`container p-4 border rounded shadow-lg bg-light mt-5 d-flex flex-column min-vh-100 ${validated ? 'was-validated' : ''}`}
                noValidate>
                <h2 className="mb-4 text-center text-primary"> User Profile Form</h2>

                <div className="row mb-3"> 
                    <div className="col-md-6"> 
                        <label htmlFor="firstName" className="form-label">First Name:</label>
                        <input type="text" id="firstName" name="firstName" className="form-control border-primary" value={formData.firstName} onChange={handleChange} required />
                        <div className="invalid-feedback">Please enter your first name.</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" className="form-control border-primary" value={formData.lastName} onChange={handleChange} required />
                        <div className="invalid-feedback">Please enter your last name.</div>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" name="email" className="form-control border-primary" value={formData.email} onChange={handleChange} required />
                    <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <div className="row mb-3"> 
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone Number:</label>
                        <input type="text" id="phone" name="phone" className="form-control border-primary" value={formData.phone} onChange={handleChange} required pattern="\d{10}" />
                        <div className="invalid-feedback">Please enter a valid 10-digit phone number.</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="dob" className="form-label">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" className="form-control border-primary" value={formData.dob} onChange={handleChange} required />
                        <div className="invalid-feedback">Please enter your date of birth.</div>
                    </div>
                </div>

                <fieldset className="mb-3">
                    <legend className="form-label">Gender:</legend>
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input type="radio" name="gender" value="Male" id="male" className="form-check-input" onChange={handleChange} checked={formData.gender === "Male"} required />
                            <label className="form-check-label" htmlFor="male">Male</label>
                            <div className="invalid-feedback">Please select your gender.</div>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="gender" value="Female" id="female" className="form-check-input" onChange={handleChange} checked={formData.gender === "Female"} required />
                            <label className="form-check-label" htmlFor="female">Female</label>
                            <div className="invalid-feedback">Please select your gender.</div>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="gender" value="Other" id="other" className="form-check-input" onChange={handleChange} checked={formData.gender === "Other"} required /> 
                            <label className="form-check-label" htmlFor="other">Other</label>
                            <div className="invalid-feedback">Please select your gender.</div>
                        </div>
                    </div>
                </fieldset>

                <div className="mb-3">
                    <label htmlFor="country" className="form-label">Country:</label>
                    <select id="country" name="country" className="form-select border-primary" required value={formData.country} onChange={handleChange}>
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Australia">Australia</option>
                        <option value="Nepal">Nepal</option>
                    </select>
                    <div className="invalid-feedback">Please select your country.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="hobbies" className="form-label">Hobbies:</label>
                    <select id="hobbies" name="hobbies" className="form-select border-primary" multiple required value={formData.hobbies} onChange={handleChange}>
                        <option value="Coding">Coding</option>
                        <option value="Hiking">Hiking</option>
                        <option value="Reading">Reading</option>
                        <option value="Traveling">Traveling</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Cooking">Cooking</option>
                    </select>
                    <div className="invalid-feedback">Please select at least one hobby.</div>
                </div>

                <fieldset className="mb-3">
                    <legend className="form-label">Skills:</legend>
                    
                    {["React", "Node.js", "JavaScript", "Python", "SQL", "MongoDB", ".NET"].map((skill) => (
                        <div className="form-check" key={skill}>
                            <input type="checkbox" name="skills" value={skill} id={skill} className="form-check-input" checked={formData.skills.includes(skill)} 
                                onChange={handleChange} />
                            <label className="form-check-label" htmlFor={skill}>{skill}</label>
                        </div>
                    ))}
                    <div className="invalid-feedback">Please select at least one skill.</div>
                </fieldset>

                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio:</label>
                    <textarea id="bio" name="bio" className="form-control border-primary" required value={formData.bio} onChange={handleChange}></textarea>
                    <div className="invalid-feedback">Please enter your bio.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture:</label>
                    <input type="file" id="profilePicture" name="profilePicture" className="form-control border-primary" accept="image/*" required onChange={handleChange} />
                    <div className="invalid-feedback">Please upload your profile picture.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} id="password" name="password" className="form-control border-primary" onChange={handleChange} value={formData.password} required />
                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="invalid-feedback">Please enter your password.</div>
                </div>

                <div className="mb-3 form-check">
                    <input type="checkbox" name="terms" id="terms" className="form-check-input" required />
                    <label className="form-check-label" htmlFor="terms">I agree to the Terms & Conditions</label>
                    <div className="invalid-feedback">You must agree to the terms and conditions.</div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-auto">Submit</button>
            </form>

            {submittedData && <DataCard data={submittedData} />}
        </>
    );
};

export default ProfileForm;