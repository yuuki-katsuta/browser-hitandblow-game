import { VFC, useCallback, useEffect, useState } from 'react';
import { registerGameData } from '../logic/registerGameData';
import { LogField } from '../components/LogField';
import { CheckboxField } from '../components/CheckboxField';
import { resetGame } from '../logic/resetGame';
import { LogData } from '../types';
import { RoomInfo } from '../types';
import { initRoomData } from '../logic/initRoomInfo';
import { gameDataSubscribe } from '../logic/gameDataSubscribe';
import { playerSubscribe } from '../logic/playerSubscribe';
import { removePlayerData } from '../logic/removePlayerdata';

const onUnload = (e: { preventDefault: () => void; returnValue: string }) => {
  e.preventDefault();
  e.returnValue = '';
};

export const Room: VFC<{
  roomInfo: RoomInfo;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
}> = ({
  roomInfo: {
    roomId,
    userUid,
    name,
    player,
    selectNumber,
    opponent,
    opponentSelectNumber,
  },
  setRoomInfo,
}) => {
  const [isGemeSet, setIsGameSet] = useState<boolean>(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [log, setLog] = useState<LogData>([]);

  useEffect(() => {
    let isMounted = true;
    window.addEventListener('beforeunload', onUnload);

    const unGameDataSubscribe = gameDataSubscribe(
      roomId,
      setIsGameSet,
      setDisabled,
      setLog,
      isMounted,
      userUid,
      setRoomInfo
    );
    const unPlayerSubscribe = playerSubscribe(roomId, userUid, setRoomInfo);

    return () => {
      isMounted = false;
      unPlayerSubscribe();
      unGameDataSubscribe();
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [userUid, roomId, setRoomInfo]);

  const reset = useCallback(
    (id: string, uid: string) => {
      setDisabled(true);
      resetGame(checkedValues, id, uid, setDisabled)
        .then(() => {
          setCheckedValues([]);
          setLog([]);
        })
        .catch(function (error) {
          alert(error.message);
        });
    },
    [checkedValues]
  );

  const add = useCallback(
    (id: string) => {
      registerGameData(checkedValues, id, player, setDisabled)
        .then(() => setCheckedValues([]))
        .catch((e) => alert(e.message));
    },
    [checkedValues, player]
  );

  const leave = useCallback(async () => {
    //await removePlayerData(roomId, userUid);
    //??????????????????????????????
    if (!player || !opponent) await removePlayerData(roomId, userUid);
    window.confirm('????????????????????') && setRoomInfo(initRoomData());
  }, [setRoomInfo, opponent, player, roomId, userUid]);

  const ButtonField: VFC<{
    fresh: boolean;
  }> = ({ fresh }): JSX.Element => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className='button-wrapper'>
        <button onClick={() => leave()}>??????</button>
        <button onClick={() => setCheckedValues([])}>?????????????????????</button>
        <button
          onClick={() => (fresh ? reset(roomId, userUid) : add(roomId))}
          disabled={disabled}
        >
          ??????!
        </button>
      </div>
    </div>
  );
  return (
    <div className='container'>
      <h4>Room: {roomId}</h4>
      {!player || !opponent ? (
        <div>
          <p>?????????????????????????????????...</p>
          <button onClick={() => leave()}>??????</button>
        </div>
      ) : (
        <div>
          <div className='roomInfo-field'>
            <p>?????????????????????????????????!!</p>
            <p>
              {name} vs {opponent}
            </p>
            <p>???????????????: {selectNumber}</p>
          </div>
          <div>
            {!isGemeSet ? (
              <>
                <CheckboxField
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                />
                <br />
                <ButtonField fresh={false} />
                <br />
                {disabled && <span>?????????????????????????????????...</span>}
                <br />
              </>
            ) : (
              <div>
                <p>???????????????!!</p>
                <p>???????????????????????????????????????????????????</p>
                <div>
                  <CheckboxField
                    checkedValues={checkedValues}
                    setCheckedValues={setCheckedValues}
                  />
                  <ButtonField fresh />
                </div>
                {disabled && <p id='text'>?????????????????????????????????...</p>}
              </div>
            )}
            {log.length > 0 && (
              <LogField
                player={player}
                opponentSelectNumber={opponentSelectNumber}
                log={log}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
