import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
          phone,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // After successful registration, also save address to userAddresses in localStorage
      // so it's available during checkout
      const newUserAddress = {
        id: `addr_signup_${Date.now()}`,
        fullName: `${firstName} ${lastName}`,
        addressLine1: address,
        addressLine2: '',
        city: city || 'Default City',
        state: state || 'Default State',
        postalCode: postalCode || '000000',
        phoneNumber: phone,
        isDefault: true
      };
      
      const existingAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
      localStorage.setItem('userAddresses', JSON.stringify([...existingAddresses, newUserAddress]));

      toast.success('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default SignupPage; 