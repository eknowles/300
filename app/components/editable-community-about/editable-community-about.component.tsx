import { gql, useMutation, useQuery } from '@apollo/client';
import { message, Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

const UPDATE_ABOUT = gql`
  mutation UpdateCommunityAbout($id: ID!, $aboutText: String!) {
    community: partialUpdateCommunityProfile(
      id: $id
      data: { aboutText: $aboutText }
    ) {
      _id
      aboutText
    }
  }
`;

const FETCH_ABOUT = gql`
  query GetCommunityAbout($id: ID!) {
    permissionCanUpdateCommunity(id: $id)
    community: findCommunityProfileByID(id: $id) {
      _id
      aboutText
    }
  }
`;

const EditableCommunityAbout: React.FC<any> = ({ id }) => {
  const [updateAbout] = useMutation(UPDATE_ABOUT);
  const { loading, data } = useQuery(FETCH_ABOUT, {
    variables: { id },
  });

  if (loading) {
    return null;
  }

  const onChange = (value) => {
    updateAbout({ variables: { id, aboutText: value } })
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
    <Paragraph {...paragraphProps}>
      {data?.community.aboutText || 'none'}
    </Paragraph>
  );
};

export default EditableCommunityAbout;
