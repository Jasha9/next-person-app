import { Suspense } from 'react';
import SearchInput from './search-input-cmd';
import UserCard from './user-card';
import { getUserById } from '@/app/actions/actions';
import ClientOnly from './client-only';
import { UserSearchWrapper } from './user-search-wrapper';

interface SearchParams {
  userId?: string;
  page?: string;
}

export default async function UserSearch({ searchParams = {} }: { searchParams?: SearchParams }) {
  const selectedUserId = searchParams?.userId;

  // Fetch the user based on the selectedUserId
  const user = selectedUserId ? await getUserById(selectedUserId) : null;

  return (
    <UserSearchWrapper>
      <SearchInput />
      {selectedUserId && (
        <Suspense fallback={<p>Loading user...</p>}>
          {user ? (
            <ClientOnly>
              <UserCard user={user} />
            </ClientOnly>
          ) : null}
        </Suspense>
      )}
    </UserSearchWrapper>
  );
}
