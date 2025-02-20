import React from "react";
import DataCard from "./DataCard";

const UserForm: React.FC = () => {
  return (
    <>
      <form
        className="container p-4 border rounded shadow-lg bg-white"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="mb-4 text-center text-primary">Profile Form</h2>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control border-primary"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control border-primary"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control border-primary"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number:
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            className="form-control border-primary"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dob" className="form-label">
            Date of Birth:
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="form-control border-primary"
            required
          />
        </div>

        <fieldset className="mb-3">
          <legend className="form-label">Gender:</legend>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="gender"
              value="Male"
              className="form-check-input"
              required
            />
            <label className="form-check-label">Male</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="gender"
              value="Female"
              className="form-check-input"
              required
            />
            <label className="form-check-label">Female</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              name="gender"
              value="Other"
              className="form-check-input"
              required
            />
            <label className="form-check-label">Other</label>
          </div>
        </fieldset>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <select
            id="country"
            name="country"
            className="form-select border-primary"
            required
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="hobbies" className="form-label">
            Hobbies:
          </label>
          <select
            id="hobbies"
            name="hobbies"
            className="form-select border-primary"
            multiple
            required
          >
            <option value="Reading">Reading</option>
            <option value="Traveling">Traveling</option>
            <option value="Gaming">Gaming</option>
            <option value="Cooking">Cooking</option>
          </select>
        </div>

        <fieldset className="mb-3">
          <legend className="form-label">Skills:</legend>
          <div className="form-check">
            <input
              type="checkbox"
              name="skills"
              value="React"
              className="form-check-input"
              required
            />
            <label className="form-check-label">React</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              name="skills"
              value="Node.js"
              className="form-check-input"
              required
            />
            <label className="form-check-label">Node.js</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              name="skills"
              value="JavaScript"
              className="form-check-input"
              required
            />
            <label className="form-check-label">JavaScript</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              name="skills"
              value="Python"
              className="form-check-input"
              required
            />
            <label className="form-check-label">Python</label>
          </div>
        </fieldset>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio:
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-control border-primary"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="profilePicture" className="form-label">
            Profile Picture:
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            className="form-control border-primary"
            accept="image/*"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control border-primary"
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="terms"
            className="form-check-input"
            required
          />
          <label className="form-check-label">
            I agree to the Terms & Conditions
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>

      <DataCard />
    </>
  );
};

export default UserForm;
