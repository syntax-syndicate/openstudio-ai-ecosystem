import { currentUser } from '@repo/backend/auth/utils';
import { flag } from 'flags/next';

//TODO: Just placeholder for now

export const tubeFlag = flag({
  key: 'tube-flag',
  defaultValue: false,
  async identify() {
    const user = await currentUser();
    return {
      user: { email: user?.email },
    };
  },
  decide({ entities }) {
    return false;
  },
});

export const integrationFlag = flag({
  key: 'integration-flag',
  defaultValue: false,
  decide() {
    return false;
  },
});
