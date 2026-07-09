import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { mockUsers, mockPosts, mockComments } from '../utils/mockData';
import { ProfileHeader } from '../components/user/ProfileHeader';
import { UserHistoryTabs } from '../components/user/UserHistoryTabs';
import { ProfileEditForm } from '../components/user/ProfileEditForm';

// NOTE (Prompt 26): replace mockUsers / mockPosts / mockComments below with
// real Supabase queries (getUserByUsername, getUserPosts, getUserComments).

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const user = mockUsers.find((u) => u.username === username);

  // Derive counts from mock data (Prompt 26: these come from the API instead)
  const postCount = mockPosts.filter(
    (p) => !p.author.isAnonymous && p.author.user.id === user?.id,
  ).length;
  const commentCount = mockComments.filter(
    (c) => !c.author.isAnonymous && c.author.user.id === user?.id,
  ).length;

  // Mock "current user" detection — Prompt 16 replaces this with useAuth()
  const isCurrentUser = username === 'alex_campus';

  if (!user) {
    return (
      <PageWrapper>
        <div className="text-center py-20 font-headline-md text-headline-md text-on-surface">
          User not found
        </div>
      </PageWrapper>
    );
  }

  const handleSave = (data: any) => {
    // Mock save — Prompt 26 replaces with updateProfile() API call
    if (data.interests && typeof data.interests === 'string') {
      user.interests = data.interests.split(',').map((s: string) => s.trim());
    }
    user.bio = data.bio;
    user.gender = data.gender;
    user.age_range = data.age_range;
    user.phone = data.phone;
    user.dob = data.dob;
    setIsEditing(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto w-full space-y-6">

        {isEditing ? (
          <ProfileEditForm
            user={user}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        ) : (
          <ProfileHeader
            user={{ ...user, post_count: postCount, comment_count: commentCount }}
            isOwnProfile={isCurrentUser}
            onEdit={() => setIsEditing(true)}
          />
        )}

        {/* Tab history — hidden while editing so layout stays clean */}
        {!isEditing && (
          <UserHistoryTabs userId={user.id} username={user.username} />
        )}

      </div>
    </PageWrapper>
  );
}
