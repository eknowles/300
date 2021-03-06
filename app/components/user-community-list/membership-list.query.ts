import { gql } from '@apollo/client';

const MEMBERSHIPS_LIST = gql`
  query MembershipsList($userProfileId: ID!) {
    profile: findUserProfileByID(id: $userProfileId) {
      memberships {
        data {
          role
          createdAt
          isPremium
          subscriptionId
          customerId
          communityProfile {
            _id
            name
            iconUrl
          }
        }
      }
    }
  }
`;

export default MEMBERSHIPS_LIST;
