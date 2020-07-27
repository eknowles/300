import { client, q } from 'app/helpers/fauna-client';

const {
  Map,
  Paginate,
  Match,
  Index,
  Lambda,
  Get,
  Var,
  Ref,
  Collection,
  Select,
  Let,
} = q;

export interface ICommunityModel {
  name: string;
  tag: string;
  localeCode: string;
  countryCode: string;
  region: string;
  iconUrl: string;
  splashUrl: string;
  bannerUrl: string;
}

const getCommunityData = (communityId: string): Promise<any> => {
  return client.query<{ data: ICommunityModel }>(
    Let(
      {
        profile: Get(Ref(Collection('community_profiles'), communityId)),
      },
      {
        data: {
          name: Select(['data', 'name'], Var('profile'), null),
          tag: Select(['data', 'tag'], Var('profile'), null),
          localeCode: Select(['data', 'localeCode'], Var('profile'), null),
          countryCode: Select(['data', 'countryCode'], Var('profile'), null),
          region: Select(['data', 'region'], Var('profile'), null),
          iconUrl: Select(['data', 'iconUrl'], Var('profile'), null),
          splashUrl: Select(['data', 'splashUrl'], Var('profile'), null),
          bannerUrl: Select(['data', 'bannerUrl'], Var('profile'), null),
        },
      }
    )
  );
};

const getCommunities = (): any => {
  return client.query(
    Map(
      Paginate(Match(Index('all_community_profiles'))),
      Lambda(
        'X',
        Let(
          { profile: Get(Var('X')) },
          {
            id: Select(['ref', 'id'], Var('profile'), null),
            name: Select(['data', 'name'], Var('profile'), null),
            iconUrl: Select(['data', 'iconUrl'], Var('profile'), null),
            splashUrl: Select(['data', 'splashUrl'], Var('profile'), null),
          }
        )
      )
    )
  );
};

export { getCommunityData, getCommunities };
