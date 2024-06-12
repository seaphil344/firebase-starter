export interface JobListingFormData {
  title: string;
  description: string;
  location: string;
  company: string;
  salaryRange: string;
  type: string;
  deadline: string;
  businessCategory: string;
  country: string;
  state: string;
  zipCode: string;
  address: string;
  remote: boolean;
}

export type SignInResult = { result: any };
export type SignInError = { error: any };

export const isError = (response: SignInResult | SignInError): response is SignInError => {
  return 'error' in response;
};