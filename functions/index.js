const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.database();
const playersRef = db.ref('players');
const gamesRef = db.ref('games');
const movesRef = db.ref('moves');
const userGamesRef = db.ref('userGames');

exports.playerQueue = functions.database.ref('/players/{uid}').onCreate((snapshot, context) => {
  const { uid } = context.params;

  return playersRef.once('value')
    .then(snapshot => {
      const [player] = Object.keys(snapshot.val())
        .filter(key => key !== uid);

        if(!player) return null;

        const newGameRef = gamesRef.push();

        return Promise.all([
          newGameRef.set({ 
            [uid]: {
              troops: 10,
              wins: 0
            }, 
            [player]: {
              troops: 10,
              wins: 0
            } 
          }),
          playersRef.child(uid).remove(),
          playersRef.child(player).remove(),
          userGamesRef.child(uid).child(newGameRef.key).set(true),
          userGamesRef.child(player).child(newGameRef.key).set(true)
        ]);
    });
});

exports.moveQueue = functions.database.ref('/moves/{gameKey}/{uid}').onCreate((snapshot, context) => {

  const { gameKey } = context.params;

  const gameMovesRef = movesRef.child(gameKey);

  return gameMovesRef.once('value')
    .then(snapshot => {
      
      const game = snapshot.val();
      const moves = Object.keys(game)
        .map(key => ({
          uid: key,
          play: game[key]
        }));
      if(moves.length < 2) return null;

      const gameRef = gamesRef.child(gameKey);
      
      const winner = calculateWinner(moves);
      const winnerRef = gameRef.child(winner);

      const wins = 1 + winnerRef.child('wins').on('value', snapshot => snapshot.val());
      




      // const player1PointsRef = gameRef.child(moves[0].uid).child('points');


      
      
      
      
      
      
      
      const roundRef = gameRef.child('rounds').push();
      return Promise.all([
        gameMovesRef.remove(),
        winnerRef.child('wins').set(wins),
        roundRef.set({
          moves,
          winner
        })
      ]);
    });
});




const calculateWinner = ([a, b]) => {

  // Refund if tie;
  if(a.play === b.play) return null;

  // Undercutter wins;
  const limit = 3;
  if(b.play - a.play > limit) return a.uid;
  if(a.play - b.play > limit) return b.uid;

  // High number wins;
  return a.play > b.play ? a.uid : b.uid;
};