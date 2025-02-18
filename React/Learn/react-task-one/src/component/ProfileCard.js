import React from 'react';

const ProfileCard = () => {

    const printLog = () => {
        console.log('Profile Clicked');
    }

    return (
        <>
            <div className="profile-card">
                <img src="profile.jpg" alt="Profile Pic" className='imageProfile' />
                <h2>Jaydip Changani</h2>
                <p>Software Developer Intern</p>

                <button className='profile-btn' onClick={printLog}>View Profile</button>
            </div>
        
        </>
    )
    
}
export default ProfileCard;