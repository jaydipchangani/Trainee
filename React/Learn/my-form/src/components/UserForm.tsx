import React from "react";
import DataCard from "./DataCard";

const UserForm: React.FC = () => {
  return (
    <>
      <form>
  <label htmlFor="firstName">First Name:</label>
  <input type="text" id="firstName" name="firstName" required />

  <label htmlFor="lastName">Last Name:</label>
  <input type="text" id="lastName" name="lastName" required />

  <label htmlFor="email">Email:</label>
  <input type="email" id="email" name="email" required />

  <label htmlFor="phone">Phone Number:</label>
  <input type="number" id="phone" name="phone" required />

  <label htmlFor="dob">Date of Birth:</label>
  <input type="date" id="dob" name="dob" required />

  <fieldset>
    <legend>Gender:</legend>
    <label>
      <input type="radio" name="gender" value="Male" required /> Male
    </label>
    <label>
      <input type="radio" name="gender" value="Female" required /> Female
    </label>
    <label>
      <input type="radio" name="gender" value="Other" required /> Other
    </label>
  </fieldset>

  <label htmlFor="country">Country:</label>
  <select id="country" name="country" required>
    <option value="">Select Country</option>
    <option value="USA">USA</option>
    <option value="Canada">Canada</option>
    <option value="India">India</option>
    <option value="UK">UK</option>
  </select>

  <label htmlFor="hobbies">Hobbies:</label>
  <select id="hobbies" name="hobbies" multiple required>
    <option value="Reading">Reading</option>
    <option value="Traveling">Traveling</option>
    <option value="Gaming">Gaming</option>
    <option value="Cooking">Cooking</option>
  </select>

  <fieldset>
    <legend>Skills:</legend>
    <label>
      <input type="checkbox" name="skills" value="React" required /> React
    </label>
    <label>
      <input type="checkbox" name="skills" value="Node.js" required /> Node.js
    </label>
    <label>
      <input type="checkbox" name="skills" value="JavaScript" required /> JavaScript
    </label>
    <label>
      <input type="checkbox" name="skills" value="Python" required /> Python
    </label>
  </fieldset>

  <label htmlFor="bio">Bio:</label>
  <textarea id="bio" name="bio" required></textarea>

  <label htmlFor="profilePicture">Profile Picture:</label>
  <input type="file" id="profilePicture" name="profilePicture" accept="image/*" required />

  <label htmlFor="password">Password:</label>
  <input type="password" id="password" name="password" required />

  <label>
    <input type="checkbox" name="terms" required /> I agree to the Terms & Conditions
  </label>

  <button type="submit">Submit</button>
</form>


      <DataCard />
    </>
  );
};

export default UserForm;
