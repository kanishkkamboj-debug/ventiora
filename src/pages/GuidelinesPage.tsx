import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';

export function GuidelinesPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="font-headline-lg text-headline-lg font-bold mb-6">Community Guidelines</h1>
        <div className="prose dark:prose-invert max-w-none font-body-md text-body-md">
          <p className="mb-4">Ventiora is a place for honest, open discussions. To keep the community safe, please follow these guidelines.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">1. Be Respectful</h2>
          <p className="mb-4">Harassment, hate speech, and bullying are strictly prohibited. Debate the idea, don't attack the person.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">2. No Spam or Self-Promotion</h2>
          <p className="mb-4">Keep discussions relevant to the campus community. Do not spam links or overtly promote businesses.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">3. Academic Integrity</h2>
          <p className="mb-4">Do not share test answers, cheat sheets, or encourage academic dishonesty.</p>
        </div>
      </div>
    </PageWrapper>
  );
}
