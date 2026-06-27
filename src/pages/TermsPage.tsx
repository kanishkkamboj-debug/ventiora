import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';

export function TermsPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="font-headline-lg text-headline-lg font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none font-body-md text-body-md">
          <p className="mb-4">Welcome to Ventiora. By accessing our platform, you agree to these terms.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">You must be a university student with a valid .edu email address to register for an account.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">2. User Conduct</h2>
          <p className="mb-4">You agree not to use the platform for any unlawful purpose or in any way that violates our Community Guidelines.</p>
        </div>
      </div>
    </PageWrapper>
  );
}
