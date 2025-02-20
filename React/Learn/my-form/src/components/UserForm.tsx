
import React, {useState} from "react";
import DataCard from "./DataCard";


const UserForm: React.FC = () => {

    type FormData = {
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
        terms: boolean;
      };

      const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        country: "",
        hobbies: [],
        skills: [],
        bio: "",
        profilePicture: null,
        password: "",
        terms: false,
      });

  return (
    <>
      <form className="container p-4 border rounded shadow-lg bg-light mt-5" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Full screen and flex column */}
      <h2 className="mb-4 text-center text-primary">Profile Form</h2>

      <div className="row mb-3"> {/* Use row for side-by-side inputs */}
        <div className="col-md-6"> {/* Half width on medium and larger screens */}
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input type="text" id="firstName" name="firstName" className="form-control border-primary" required />
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input type="text" id="lastName" name="lastName" className="form-control border-primary" required />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input type="email" id="email" name="email" className="form-control border-primary" required />
      </div>

      <div className="row mb-3"> {/* Side-by-side for phone and dob */}
        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">Phone Number:</label>
          <input type="number" id="phone" name="phone" className="form-control border-primary" required />
        </div>
        <div className="col-md-6">
          <label htmlFor="dob" className="form-label">Date of Birth:</label>
          <input type="date" id="dob" name="dob" className="form-control border-primary" required />
        </div>
      </div>

      <fieldset className="mb-3">
        <legend className="form-label">Gender:</legend>
        <div className="d-flex gap-3"> {/* Use flexbox for better layout */}
          <div className="form-check">
            <input type="radio" name="gender" value="Male" id="male" className="form-check-input" required />
            <label className="form-check-label" htmlFor="male">Male</label>
          </div>
          <div className="form-check">
            <input type="radio" name="gender" value="Female" id="female" className="form-check-input" required />
            <label className="form-check-label" htmlFor="female">Female</label>
          </div>
          <div className="form-check">
            <input type="radio" name="gender" value="Other" id="other" className="form-check-input" required />
            <label className="form-check-label" htmlFor="other">Other</label>
          </div>
        </div>
      </fieldset>

      <div className="mb-3">
        <label htmlFor="country" className="form-label">Country:</label>
        <select id="country" name="country" className="form-select border-primary" required>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="hobbies" className="form-label">Hobbies:</label>
        <select id="hobbies" name="hobbies" className="form-select border-primary" multiple required>
          <option value="Reading">Reading</option>
          <option value="Traveling">Traveling</option>
          <option value="Gaming">Gaming</option>
          <option value="Cooking">Cooking</option>
        </select>
      </div>

      <fieldset className="mb-3">
        <legend className="form-label">Skills:</legend>
        {/* Use map to render checkboxes dynamically if you have a skills array */}
        {["React", "Node.js", "JavaScript", "Python"].map((skill) => (
          <div className="form-check" key={skill}>
            <input type="checkbox" name="skills" value={skill} id={skill} className="form-check-input" required />
            <label className="form-check-label" htmlFor={skill}>{skill}</label>
          </div>
        ))}
      </fieldset>

      <div className="mb-3">
        <label htmlFor="bio" className="form-label">Bio:</label>
        <textarea id="bio" name="bio" className="form-control border-primary" required></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="profilePicture" className="form-label">Profile Picture:</label>
        <input type="file" id="profilePicture" name="profilePicture" className="form-control border-primary" accept="image/*" required />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <input type="password" id="password" name="password" className="form-control border-primary" required />
      </div>

      <div className="mb-3 form-check">
        <input type="checkbox" name="terms" id="terms" className="form-check-input" required />
        <label className="form-check-label" htmlFor="terms">I agree to the Terms & Conditions</label>
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-auto">Submit</button>
    </form>

      <DataCard />
    </>
  );
};

export default UserForm;
