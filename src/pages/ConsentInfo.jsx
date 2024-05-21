import React from 'react';

function ConsentInfo() {
  return (
    <div className="p-8 bg-gray-800 text-white h-screen">
      <h1 className="text-3xl font-bold mb-4">Data Usage Consent</h1>
      <p>
        Your privacy is important to us. We are committed to protecting your personal information and being transparent about how we use it. By registering for an account, you agree to the following:
      </p>
      <ul className="list-disc ml-6 my-4">
        <li>We will collect and store your personal information including your name, email, phone number, and other details provided during registration.</li>
        <li>Your data will be used to allow for login, and ensure the security of our platform.</li>
        <li>We will not share your personal information with third parties without your consent, except as required by law.</li>
        <li>You have the right to access, modify, and delete your personal information at any time.</li>
      </ul>
    </div>
  );
}

export default ConsentInfo;
