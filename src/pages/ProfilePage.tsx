import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ProfileHeader } from '../components/user/ProfileHeader';
import { ProfileEditForm } from '../components/user/ProfileEditForm';
import { UserHistoryTabs } from '../components/user/UserHistoryTabs';
import { mockUsers, mockCurrentUser } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common/EmptyState';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [editing, setEditing] = useState(false);

  const profileUser = mockUsers.find((u) => u.username === username) ?? mockUsers[0];
  const isOwnProfile = currentUser?.username === profileUser.username;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-5">
        {editing ? (
          <ProfileEditForm
            user={profileUser}
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
          />
        ) : (
          <ProfileHeader
            user={profileUser}
            isOwnProfile={isOwnProfile}
            onEdit={() => setEditing(true)}
          />
        )}
        <UserHistoryTabs userId={profileUser.id} username={profileUser.username} />
      </div>
    </PageWrapper>
  );
}
