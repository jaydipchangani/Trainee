import React from "react";

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

interface DataCardProps {
    data: FormData;
}

const DataCard: React.FC<DataCardProps> = ({ data }) => {
    return (
        <div className="container card mt-4 shadow-sm" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                    {data.profilePicture && (
                        <img
                            src={URL.createObjectURL(data.profilePicture)}
                            alt="Profile"
                            className="rounded-circle me-3"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #007bff' }}
                        />
                    )}
                    <div>
                        <h5 className="card-title mb-0" style={{ color: '#007bff' }}>{data.firstName} {data.lastName}</h5>
                        <p className="text-muted mb-0">{data.email}</p>
                        <p className="text-muted mb-0">{data.phone}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2" style={{ color: '#6c757d' }}>Personal Information</h6>
                    <p className="card-text"><strong>Date of Birth:</strong> {data.dob}</p>
                    <p className="card-text"><strong>Age:</strong> {data.age}</p>
                    <p className="card-text"><strong>Gender:</strong> {data.gender}</p>
                    <p className="card-text"><strong>Country:</strong> {data.country}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2" style={{ color: '#6c757d' }}>Hobbies</h6>
                    <p className="card-text">{data.hobbies.join(', ')}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2" style={{ color: '#6c757d' }}>Skills</h6>
                    <p className="card-text">{data.skills.join(', ')}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2" style={{ color: '#6c757d' }}>Bio</h6>
                    <p className="card-text">{data.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default DataCard;