export type RoomInfo = {
  roomId: string;
  userUid: string;
  name: string;
  player: 'player1' | 'player2' | '';
  selectNumber: number[];
  opponent: string;
  opponentSelectNumber: number[];
};

export type RoomData = {
  name: string;
  player: 'player1' | 'player2' | '';
  selectNumber: number[];
  opponent: string;
  opponentSelectNumber: number[];
};

export type RoomPlayerInfo = {
  id: string;
  name: string;
  player: '' | 'player1' | 'player2';
  selected: number[];
}[];

export type LogData = {
  player2: { blow: number; hit: number; ownSelect: number[] };
  player1: { blow: number; hit: number; ownSelect: number[] };
}[];

export type LocationState = {
  id: string;
  uid: string;
} | null;
