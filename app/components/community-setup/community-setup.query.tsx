import { gql } from '@apollo/client';

const COMMUNITY_SETUP = gql`
  query CommunitySetup($communityId: ID!) {
    community: findCommunityProfileByID(id: $communityId) {
      name
      communityAccount {
        ownerAccount {
          email
        }
      }
    }
  }
`;

export default COMMUNITY_SETUP;
