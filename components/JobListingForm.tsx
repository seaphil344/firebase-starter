import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { JobListingFormData } from '../types';

const JobListingForm: React.FC = () => {
  const [formData, setFormData] = useState<JobListingFormData>({
    title: '',
    description: '',
    location: '',
    company: '',
    salaryRange: '',
    type: '',
    deadline: '',
    businessCategory: '',
    country: '',
    state: '',
    zipCode: '',
    address: '',
    remote: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobListings'), formData);
      alert('Job listing created successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        company: '',
        salaryRange: '',
        type: '',
        deadline: '',
        businessCategory: '',
        country: '',
        state: '',
        zipCode: '',
        address: '',
        remote: false,
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields here, similar to previous JSX but with TypeScript types in handlers */}
      <button type="submit">Submit Job Listing</button>
    </form>
  );
};

export default JobListingForm;
