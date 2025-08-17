export type ClashRoyaleBattle = {
  type: string;
  battleTime: string;
  isLadderTournament: boolean;
  arena: {
    id: number;
    name: string;
  };
  gameMode: {
    id: number;
    name: string;
  };
  deckSelection: string;
  team: ClashRoyalePlayer[];
  opponent: ClashRoyalePlayer[];
};

export type ClashRoyalePlayer = {
  tag: string;
  name: string;
  startingTrophies: number;
  trophyChange: number;
  crowns: number;
  clan: {
    tag: string;
    name: string;
    badgeId: number;
  };
  cards: ClashRoyaleCard[];
};

export type ClashRoyaleCard = {
  name: string;
  id: number;
  level: number;
  maxLevel: number;
  count: number;
  iconUrls: {
    medium: string;
  };
};

export type ClashRoyaleBattleLog = ClashRoyaleBattle[];

export type ClashRoyalePlayerInfo = {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role: string;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  warDayWins: number;
  clanCardsCollected: number;
  clan: {
    tag: string;
    name: string;
    badgeId: number;
  };
  arena: {
    id: number;
    name: string;
  };
  leagueStatistics: {
    currentSeason: {
      id: string;
      trophies: number;
      bestTrophies: number;
    };
    previousSeason: {
      id: string;
      trophies: number;
      bestTrophies: number;
    };
    bestSeason: {
      id: string;
      trophies: number;
      bestTrophies: number;
    };
  };
  badges: {
    name: string;
    level: number;
    maxLevel: number;
    progress: number;
    target: number;
  }[];
  achievements: {
    name: string;
    stars: number;
    value: number;
    target: number;
    info: string;
  }[];
  cards: ClashRoyaleCard[];
  currentDeck: ClashRoyaleCard[];
  currentFavouriteCard: ClashRoyaleCard;
};

export type ClashRoyaleStats = {
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
  recentResults: ("W" | "L")[];
  averageTrophyChange: number;
  currentTrophies: number;
};

export type ClashRoyaleApiResponse = {
  player: ClashRoyalePlayerInfo;
  battleLog: ClashRoyaleBattleLog;
};
