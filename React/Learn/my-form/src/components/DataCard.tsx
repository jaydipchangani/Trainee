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
        <div className="container card mt-4 shadow-sm bg-light rounded">
            <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                    {data.profilePicture && (
                        <img
                            src={URL.createObjectURL(data.profilePicture)}
                            alt="Profile"
                            className="rounded-circle me-3 border border-primary"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                    )}
                    <div>
                        <h5 className="card-title mb-0 text-primary">{data.firstName} {data.lastName}</h5>
                        <p className="text-muted mb-0">{data.email}</p>
                        <p className="text-muted mb-0">{data.phone}</p>
                    </div>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2 text-muted">Personal Information</h6>
                    <p className="card-text"><strong>Date of Birth:</strong> {data.dob}</p>
                    <p className="card-text"><strong>Age:</strong> {data.age}</p>
                    <p className="card-text"><strong>Gender:</strong> {data.gender}</p>
                    <p className="card-text"><strong>Country:</strong> {data.country}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2 text-muted"><strong>Hobbies</strong></h6>
                    <p className="card-text">{data.hobbies.join(', ')}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2 text-muted"><strong>Skills</strong></h6>
                    <p className="card-text">{data.skills.join(', ')}</p>
                </div>
                <div className="mb-3">
                    <h6 className="card-subtitle mb-2 text-muted"><strong>Bio</strong></h6>
                    <p className="card-text">{data.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default DataCard;