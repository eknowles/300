import { gql, useMutation, useQuery } from '@apollo/client';
import { message, Typography } from 'antd';
import React from 'react';
import MotionFadeIn from '../motion-fade-in';

const { Paragraph } = Typography;

const UPDATE_PREMIUM_TEXT = gql`
  mutation UpdateCommunityPremium($id: ID!, $premiumText: String!) {
    community: partialUpdateCommunityProfile(
      id: $id
      data: { premiumText: $premiumText }
    ) {
      _id
      premiumText
    }
  }
`;

const FETCH_PREMIUM_TEXT = gql`
  query GetCommunityPremium($id: ID!) {
    permissionCanUpdateCommunity(id: $id)
    community: findCommunityProfileByID(id: $id) {
      _id
      premiumText
    }
  }
`;

const EditableCommunityPremium: React.FC<any> = ({ id }) => {
  const [updatePremiumText] = useMutation(UPDATE_PREMIUM_TEXT);
  const { loading, data } = useQuery(FETCH_PREMIUM_TEXT, {
    variables: { id },
  });

  if (loading) {
    return null;
  }

  const onChange = (value) => {
    updatePremiumText({ variables: { id, premiumText: value } })
      .then(() => {
        message.success('Successfully updated');
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  let paragraphProps = {};

  if (data?.permissionCanUpdateCommunity) {
    paragraphProps = { editable: { onChange } };
  }

  return (
    <MotionFadeIn>
      <Paragraph {...paragraphProps}>
        {data?.community.premiumText || 'none'}
      </Paragraph>
    </MotionFadeIn>
  );
};

export default EditableCommunityPremium;
