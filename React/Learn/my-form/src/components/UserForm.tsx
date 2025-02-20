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

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Validate phone number (e.g., 10 digits for a US number)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        setSubmittedData(formData);

        setFormData({  // Reset to initial state
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
    };

    return (
        <>
            <form onSubmit={handleSubmit}
                className="container p-4 border rounded shadow-lg bg-light mt-5"
                style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <h2 className="mb-4 text-center text-primary">Profile Form</h2>

                <div className="row mb-3"> {/* Use row for side-by-side inputs */}
                    <div className="col-md-6"> {/* Half width on medium and larger screens */}
                        <label htmlFor="firstName" className="form-label">First Name:</label>
                        <input type="text" id="firstName" name="firstName" className="form-control border-primary" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" className="form-control border-primary" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" name="email" className="form-control border-primary" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="row mb-3"> {/* Side-by-side for phone and dob */}
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Phone Number:</label>
                        <input type="number" id="phone" name="phone" className="form-control border-primary" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="dob" className="form-label">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" className="form-control border-primary" value={formData.dob} onChange={handleChange} required />
                    </div>
                </div>

                <fieldset className="mb-3">
                    <legend className="form-label">Gender:</legend>
                    <div className="d-flex gap-3">
                        <div className="form-check">
                            <input type="radio" name="gender" value="Male" id="male" className="form-check-input" onChange={handleChange} checked={formData.gender === "Male"} /> {/* Added value and checked */}
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="gender" value="Female" id="female" className="form-check-input" onChange={handleChange} checked={formData.gender === "Female"} /> {/* Added value and checked */}
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="gender" value="Other" id="other" className="form-check-input" onChange={handleChange} checked={formData.gender === "Other"} /> {/* Added value and checked */}
                            <label className="form-check-label" htmlFor="other">Other</label>
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
                </div>

                <fieldset className="mb-3">
                    <legend className="form-label">Skills:</legend>
                    {/* Use map to render checkboxes dynamically if you have a skills array */}
                    {["React", "Node.js", "JavaScript", "Python","SQL","MongoDB",".NET"].map((skill) => (
                        <div className="form-check" key={skill}>
                            <input type="checkbox" name="skills" value={skill} id={skill} className="form-check-input" checked={formData.skills.includes(skill)} // Bind checked state
                                onChange={handleChange} />
                            <label className="form-check-label" htmlFor={skill}>{skill}</label>
                        </div>
                    ))}
                </fieldset>

                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio:</label>
                    <textarea id="bio" name="bio" className="form-control border-primary" required value={formData.bio} onChange={handleChange}></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="profilePicture" className="form-label">Profile Picture:</label>
                    <input type="file" id="profilePicture" name="profilePicture" className="form-control border-primary" accept="image/*" required onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" id="password" name="password" className="form-control border-primary" onChange={handleChange} value={formData.password} required />
                </div>

                <div className="mb-3 form-check">
                    <input type="checkbox" name="terms" id="terms" className="form-check-input" required />
                    <label className="form-check-label" htmlFor="terms">I agree to the Terms & Conditions</label>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-auto">Submit</button>
            </form>

            {submittedData && <DataCard data={submittedData} />}
        </>
    );
};

export default ProfileForm;
