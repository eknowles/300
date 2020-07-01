import { client, q } from 'app/helpers/fauna-client';

const { Map, Paginate, Match, Index, Lambda, Get, Var, Ref, Collection } = q;

export interface ICommunityModel {
  name: string;
  tag: string;
  localeCode: string;
  discordGuildId: string;
  countryCode: string;
  region: string;
  iconUrl: string;
}

const getCommunityData = (communityId: string): Promise<any> => {
  return client.query<{ data: ICommunityModel }>(
    Get(Ref(Collection('community_profiles'), communityId))
  );
};

const getCommunities = (): any => {
  return client.query(
    Map(
      Paginate(Match(Index('all_community_profiles'))),
      Lambda('X', Get(Var('X')))
    )
  );
};

export { getCommunityData, getCommunities };
