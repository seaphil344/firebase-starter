// pages/create-job-listing.tsx
import React from 'react';
import JobListingForm from '@/components/JobListingForm';

const CreateJobListing: React.FC = () => {
  return (
    <div>
      <h1>Create Job Listing</h1>
      <JobListingForm />
    </div>
  );
};

export default CreateJobListing;
